import { NextResponse } from 'next/server';
import { AGENT_TOOLS, getToolByName, connectionStatus } from '@/lib/agent/tools';
import { SERVICES, ACTIVITY_FEED } from '@/lib/mock-data';

export const runtime = 'nodejs';

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-5-20250929';
const MAX_AGENT_TURNS = 4;

const BRIEF_TOOL = {
  name: 'generate_daily_brief',
  description: 'Generate the structured Daily Brief for a founder.',
  input_schema: {
    type: 'object' as const,
    properties: {
      headline: { type: 'string', description: 'One punchy sentence summarizing the state of things today.' },
      wins: { type: 'array', items: { type: 'string' }, description: '2-4 short bullet points on what went well / shipped.' },
      attention: { type: 'array', items: { type: 'string' }, description: '1-3 short bullet points on what needs attention or follow-up.' },
      integrationNotes: { type: 'array', items: { type: 'string' }, description: 'Notable findings pulled from connected tools (GitHub/Notion/Slack/Figma), if any.' },
      narration: { type: 'string', description: 'A warm, conversational 60-90 second spoken script version of this brief, written to be read aloud by a TTS voice — like a cofounder giving you the morning rundown.' },
    },
    required: ['headline', 'wins', 'attention', 'integrationNotes', 'narration'],
  },
};

const SYSTEM_PROMPT = `You are the Shipyard Daily Brief generator. You produce a short, founder-facing morning rundown of the company's engineering and ops status.

You have tools for GitHub, Notion, Slack, and Figma — use the ones that are connected to pull real, current information (e.g. recent repo activity, open issues, channel activity). Tools that aren't connected will tell you so; skip those gracefully without dwelling on it.

You're also given a snapshot of the internal service catalog and recent activity feed as context — use it alongside any live tool data.

Keep it tight, plain-English, and a little encouraging. No corporate-speak. When you have everything you need, call generate_daily_brief exactly once.`;

const ANTHROPIC_TOOLS = [
  ...AGENT_TOOLS.map((t) => ({ name: t.name, description: t.description, input_schema: t.input_schema })),
  BRIEF_TOOL,
];

interface AnthropicContentBlock {
  type: string;
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
}

async function callAnthropic(messages: Array<Record<string, unknown>>, apiKey: string) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      messages,
      tools: ANTHROPIC_TOOLS,
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API error: ${errText}`);
  }
  return res.json();
}

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  const healthy = SERVICES.filter((s) => s.status === 'healthy').length;
  const degraded = SERVICES.filter((s) => s.status === 'degraded').length;
  const down = SERVICES.filter((s) => s.status === 'down').length;

  const contextSummary = `Service catalog snapshot: ${SERVICES.length} services total (${healthy} healthy, ${degraded} degraded, ${down} down). Services: ${SERVICES.map((s) => `${s.name} (${s.status})`).join(', ')}.

Recent internal activity (most recent first): ${ACTIVITY_FEED.slice(0, 6).map((e) => e.message).join('; ')}.

Connected live tools: ${Object.entries(connectionStatus()).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none'}.`;

  const messages: Array<Record<string, unknown>> = [
    { role: 'user', content: `Generate today's Daily Brief.\n\n${contextSummary}` },
  ];

  try {
    for (let turn = 0; turn < MAX_AGENT_TURNS; turn++) {
      const data = await callAnthropic(messages, apiKey);
      const content = data.content as AnthropicContentBlock[];

      const briefCall = content.find((b) => b.type === 'tool_use' && b.name === 'generate_daily_brief');
      if (briefCall?.input) {
        return NextResponse.json({ brief: briefCall.input });
      }

      const toolUses = content.filter((b) => b.type === 'tool_use');
      if (toolUses.length === 0) break;

      messages.push({ role: 'assistant', content });

      const toolResults = [];
      for (const block of toolUses) {
        const tool = getToolByName(block.name!);
        let result: unknown;
        try {
          if (!tool) throw new Error(`Unknown tool: ${block.name}`);
          result = await tool.run(block.input ?? {});
        } catch (err) {
          result = { error: (err as Error).message };
        }
        toolResults.push({ type: 'tool_result', tool_use_id: block.id, content: JSON.stringify(result) });
      }
      messages.push({ role: 'user', content: toolResults });

      if (data.stop_reason !== 'tool_use') break;
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }

  return NextResponse.json({ error: 'Failed to generate a daily brief' }, { status: 502 });
}
