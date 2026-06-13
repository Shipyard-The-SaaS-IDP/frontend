import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-5-20250929';

const TECH_BRIEF_TOOL = {
  name: 'generate_tech_brief',
  description: 'Generate a technical brief for a founder describing their business in plain English.',
  input_schema: {
    type: 'object' as const,
    properties: {
      tags: {
        type: 'object',
        properties: {
          industry: { type: 'string', description: 'Short industry label, e.g. "Healthcare" or "Climate / Nonprofit"' },
          scale: { type: 'string', description: 'Estimated user/usage scale, e.g. "~5,000 users (year 1)"' },
          team: { type: 'string', description: 'Team size/composition, e.g. "Solo founder" or "3 engineers"' },
          compliance: { type: 'array', items: { type: 'string' }, description: 'Relevant compliance regimes, e.g. ["HIPAA"]. Use ["None flagged yet"] if none apply.' },
        },
        required: ['industry', 'scale', 'team', 'compliance'],
      },
      architecture: { type: 'string', description: 'Recommended architecture pattern, e.g. "Modular monolith"' },
      stack: { type: 'string', description: 'Recommended tech stack, e.g. "FastAPI + PostgreSQL + AWS"' },
      complianceMapping: { type: 'string', description: 'How compliance requirements map to concrete infra controls, e.g. "HIPAA -> encryption at rest, audit logging, VPC isolation". If none, explain the standard security baseline.' },
      costEstimate: { type: 'string', description: 'Estimated monthly infrastructure cost, e.g. "~$340 / month"' },
      workflowPrompt: { type: 'string', description: 'A single plain-English prompt describing the infrastructure to provision, suitable for handing off to an AI workflow generator (mention stack, CI/CD, compliance controls, and any notification channel).' },
    },
    required: ['tags', 'architecture', 'stack', 'complianceMapping', 'costEstimate', 'workflowPrompt'],
  },
};

const SYSTEM_PROMPT = `You are the Translator inside Shipyard, a tool that converts a founder's plain-English business description into a concrete technical brief: architecture pattern, recommended stack, compliance-to-infrastructure mapping, and a rough monthly cost estimate.

Be concise, concrete, and realistic for an early-stage startup (favor managed services and low-ops choices). If the founder mentions an existing AI-coding-tool stack (Base44, Lovable, v0, Bolt, Replit, Next.js + Supabase, etc.), build on top of it rather than replacing it. Always call the generate_tech_brief tool with your answer.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured' }, { status: 503 });
  }

  let body: { description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const description = body.description?.trim();
  if (!description) {
    return NextResponse.json({ error: 'Missing "description"' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: description }],
        tools: [TECH_BRIEF_TOOL],
        tool_choice: { type: 'tool', name: 'generate_tech_brief' },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `Anthropic API error: ${errText}` }, { status: 502 });
    }

    const data = await res.json();
    const toolUse = (data.content as Array<{ type: string; input?: unknown }>).find((b) => b.type === 'tool_use');
    if (!toolUse?.input) {
      return NextResponse.json({ error: 'Model did not return a tech brief' }, { status: 502 });
    }

    return NextResponse.json({ brief: toolUse.input });
  } catch (err) {
    return NextResponse.json({ error: `Request failed: ${(err as Error).message}` }, { status: 500 });
  }
}
