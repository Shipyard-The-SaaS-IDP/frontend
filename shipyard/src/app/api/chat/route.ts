import { NextRequest, NextResponse } from 'next/server';
import { AGENT_TOOLS, getToolByName, connectionStatus } from '@/lib/agent/tools';

export async function GET() {
  return NextResponse.json({ connections: connectionStatus(), hasApiKey: !!process.env.ANTHROPIC_API_KEY });
}

export const runtime = 'nodejs';

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-5-20250929';
const MAX_AGENT_TURNS = 6;

const SYSTEM_PROMPT = `You are the Shipyard agent — a co-founder-style assistant for a startup's engineering and ops command center.

You have tools that make REAL calls to GitHub, Notion, Slack, and Figma on the founder's behalf. Use them whenever a request needs live information or an action in one of those systems. Don't guess at data you can fetch.

Be direct, concise, and a little warm — like a sharp cofounder, not a support bot. When a tool isn't connected (you'll get a "not connected" result), tell the user plainly which env var to set, then keep helping with what you can.

When you take multiple steps (e.g. look something up, then post a message), narrate briefly what you're doing and why before moving to the next step.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnthropicContentBlock {
  type: string;
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
  tool_use_id?: string;
  content?: string;
  is_error?: boolean;
}

export interface AgentStep {
  type: 'text' | 'tool_call';
  text?: string;
  toolName?: string;
  toolInput?: Record<string, unknown>;
  toolResult?: unknown;
  toolError?: boolean;
}

const ANTHROPIC_TOOLS = AGENT_TOOLS.map((t) => ({
  name: t.name,
  description: t.description,
  input_schema: t.input_schema,
}));

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

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  let body: { messages?: ChatMessage[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const history = body.messages ?? [];
  if (history.length === 0) {
    return NextResponse.json({ error: 'Missing "messages"' }, { status: 400 });
  }

  const messages: Array<Record<string, unknown>> = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const steps: AgentStep[] = [];
  let finalText = '';

  try {
    for (let turn = 0; turn < MAX_AGENT_TURNS; turn++) {
      const data = await callAnthropic(messages, apiKey);
      const content = data.content as AnthropicContentBlock[];

      const toolUses = content.filter((b) => b.type === 'tool_use');

      for (const block of content) {
        if (block.type === 'text' && block.text) {
          steps.push({ type: 'text', text: block.text });
          finalText += (finalText ? '\n\n' : '') + block.text;
        }
      }

      if (toolUses.length === 0) {
        break;
      }

      messages.push({ role: 'assistant', content });

      const toolResults: AnthropicContentBlock[] = [];
      for (const block of toolUses) {
        const tool = getToolByName(block.name!);
        let result: unknown;
        let isError = false;
        try {
          if (!tool) throw new Error(`Unknown tool: ${block.name}`);
          result = await tool.run(block.input ?? {});
          if (result && typeof result === 'object' && 'error' in (result as Record<string, unknown>)) {
            isError = true;
          }
        } catch (err) {
          result = { error: (err as Error).message };
          isError = true;
        }

        steps.push({
          type: 'tool_call',
          toolName: block.name,
          toolInput: block.input,
          toolResult: result,
          toolError: isError,
        });

        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(result),
          is_error: isError,
        });
      }

      messages.push({ role: 'user', content: toolResults });

      if (data.stop_reason !== 'tool_use') break;
    }
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message, steps }, { status: 502 });
  }

  return NextResponse.json({ reply: finalText, steps });
}
