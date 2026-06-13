// Real tool integrations for the Shipyard agent.
// Each tool calls the live third-party API using a token from env vars.
// If a token is missing, the tool returns a clear "not connected" result
// instead of throwing, so the agent can explain that to the user.

export interface AgentTool {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  connected: boolean;
  run: (input: Record<string, unknown>) => Promise<unknown>;
}

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;

const notConnected = (service: string, envVar: string) => ({
  error: `${service} is not connected. Set ${envVar} in .env.local to enable this tool.`,
});

// ---------------------------------------------------------------------------
// GitHub
// ---------------------------------------------------------------------------

async function githubRequest(path: string, init?: RequestInit) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.headers ?? {}),
    },
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error(`GitHub API error (${res.status}): ${json?.message ?? text}`);
  }
  return json;
}

const githubListRepos: AgentTool = {
  name: 'github_list_repos',
  description: "List the authenticated user's most recently active GitHub repositories.",
  input_schema: { type: 'object', properties: {} },
  connected: !!GITHUB_TOKEN,
  run: async () => {
    if (!GITHUB_TOKEN) return notConnected('GitHub', 'GITHUB_TOKEN');
    const repos = await githubRequest('/user/repos?sort=updated&per_page=10') as Array<{
      full_name: string; description: string | null; html_url: string; private: boolean;
      stargazers_count: number; open_issues_count: number; updated_at: string; language: string | null;
    }>;
    return repos.map((r) => ({
      name: r.full_name,
      description: r.description,
      url: r.html_url,
      private: r.private,
      stars: r.stargazers_count,
      openIssues: r.open_issues_count,
      language: r.language,
      updatedAt: r.updated_at,
    }));
  },
};

const githubListIssues: AgentTool = {
  name: 'github_list_issues',
  description: 'List open issues for a GitHub repository.',
  input_schema: {
    type: 'object',
    properties: {
      repo: { type: 'string', description: 'Repository in "owner/name" form' },
    },
    required: ['repo'],
  },
  connected: !!GITHUB_TOKEN,
  run: async (input) => {
    if (!GITHUB_TOKEN) return notConnected('GitHub', 'GITHUB_TOKEN');
    const repo = input.repo as string;
    const issues = await githubRequest(`/repos/${repo}/issues?state=open&per_page=10`) as Array<{
      number: number; title: string; html_url: string; user: { login: string }; created_at: string; comments: number;
    }>;
    return issues.map((i) => ({
      number: i.number,
      title: i.title,
      url: i.html_url,
      author: i.user?.login,
      createdAt: i.created_at,
      comments: i.comments,
    }));
  },
};

const githubCreateIssue: AgentTool = {
  name: 'github_create_issue',
  description: 'Create a new issue in a GitHub repository.',
  input_schema: {
    type: 'object',
    properties: {
      repo: { type: 'string', description: 'Repository in "owner/name" form' },
      title: { type: 'string', description: 'Issue title' },
      body: { type: 'string', description: 'Issue body (markdown)' },
    },
    required: ['repo', 'title'],
  },
  connected: !!GITHUB_TOKEN,
  run: async (input) => {
    if (!GITHUB_TOKEN) return notConnected('GitHub', 'GITHUB_TOKEN');
    const repo = input.repo as string;
    const issue = await githubRequest(`/repos/${repo}/issues`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: input.title, body: input.body ?? '' }),
    }) as { number: number; html_url: string };
    return { number: issue.number, url: issue.html_url };
  },
};

// ---------------------------------------------------------------------------
// Notion
// ---------------------------------------------------------------------------

async function notionRequest(path: string, init?: RequestInit) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': '2022-06-28',
      'content-type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Notion API error (${res.status}): ${json?.message ?? JSON.stringify(json)}`);
  }
  return json;
}

const notionSearch: AgentTool = {
  name: 'notion_search',
  description: 'Search the connected Notion workspace for pages and databases by keyword.',
  input_schema: {
    type: 'object',
    properties: {
      query: { type: 'string', description: 'Search keyword' },
    },
    required: ['query'],
  },
  connected: !!NOTION_TOKEN,
  run: async (input) => {
    if (!NOTION_TOKEN) return notConnected('Notion', 'NOTION_TOKEN');
    const data = await notionRequest('/search', {
      method: 'POST',
      body: JSON.stringify({ query: input.query, page_size: 10 }),
    }) as { results: Array<Record<string, unknown>> };
    return data.results.map((r) => {
      const props = r.properties as Record<string, { title?: Array<{ plain_text: string }> }> | undefined;
      const titleProp = props ? Object.values(props).find((p) => p.title) : undefined;
      const title = titleProp?.title?.map((t) => t.plain_text).join('') ?? '(untitled)';
      return { id: r.id, title, url: r.url, lastEditedAt: r.last_edited_time, type: r.object };
    });
  },
};

const notionCreatePage: AgentTool = {
  name: 'notion_create_page',
  description: 'Create a new Notion page inside a parent page.',
  input_schema: {
    type: 'object',
    properties: {
      parentPageId: { type: 'string', description: 'The Notion page ID to nest the new page under' },
      title: { type: 'string', description: 'Title of the new page' },
      content: { type: 'string', description: 'Plain text content for the first paragraph of the page' },
    },
    required: ['parentPageId', 'title'],
  },
  connected: !!NOTION_TOKEN,
  run: async (input) => {
    if (!NOTION_TOKEN) return notConnected('Notion', 'NOTION_TOKEN');
    const page = await notionRequest('/pages', {
      method: 'POST',
      body: JSON.stringify({
        parent: { page_id: input.parentPageId },
        properties: {
          title: { title: [{ text: { content: input.title as string } }] },
        },
        children: input.content
          ? [{
              object: 'block',
              type: 'paragraph',
              paragraph: { rich_text: [{ type: 'text', text: { content: input.content as string } }] },
            }]
          : [],
      }),
    }) as { id: string; url: string };
    return { id: page.id, url: page.url };
  },
};

// ---------------------------------------------------------------------------
// Slack
// ---------------------------------------------------------------------------

const slackPostMessage: AgentTool = {
  name: 'slack_post_message',
  description: 'Post a message to a Slack channel.',
  input_schema: {
    type: 'object',
    properties: {
      channel: { type: 'string', description: 'Channel name or ID, e.g. "#general" or "C0123456789"' },
      text: { type: 'string', description: 'Message text (markdown supported)' },
    },
    required: ['channel', 'text'],
  },
  connected: !!SLACK_BOT_TOKEN,
  run: async (input) => {
    if (!SLACK_BOT_TOKEN) return notConnected('Slack', 'SLACK_BOT_TOKEN');
    const res = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SLACK_BOT_TOKEN}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ channel: input.channel, text: input.text }),
    });
    const json = await res.json();
    if (!json.ok) throw new Error(`Slack API error: ${json.error}`);
    return { ok: true, channel: json.channel, ts: json.ts };
  },
};

const slackListChannels: AgentTool = {
  name: 'slack_list_channels',
  description: 'List public channels in the connected Slack workspace.',
  input_schema: { type: 'object', properties: {} },
  connected: !!SLACK_BOT_TOKEN,
  run: async () => {
    if (!SLACK_BOT_TOKEN) return notConnected('Slack', 'SLACK_BOT_TOKEN');
    const res = await fetch('https://slack.com/api/conversations.list?limit=50&types=public_channel', {
      headers: { Authorization: `Bearer ${SLACK_BOT_TOKEN}` },
    });
    const json = await res.json();
    if (!json.ok) throw new Error(`Slack API error: ${json.error}`);
    return (json.channels as Array<{ id: string; name: string; num_members: number }>).map((c) => ({
      id: c.id, name: c.name, members: c.num_members,
    }));
  },
};

// ---------------------------------------------------------------------------
// Figma
// ---------------------------------------------------------------------------

const figmaGetFile: AgentTool = {
  name: 'figma_get_file',
  description: 'Get metadata (name, pages, last modified) for a Figma file.',
  input_schema: {
    type: 'object',
    properties: {
      fileKey: { type: 'string', description: 'The Figma file key (from the file URL, e.g. figma.com/file/<fileKey>/...)' },
    },
    required: ['fileKey'],
  },
  connected: !!FIGMA_TOKEN,
  run: async (input) => {
    if (!FIGMA_TOKEN) return notConnected('Figma', 'FIGMA_TOKEN');
    const res = await fetch(`https://api.figma.com/v1/files/${input.fileKey}?depth=1`, {
      headers: { 'X-Figma-Token': FIGMA_TOKEN },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(`Figma API error: ${json?.err ?? res.statusText}`);
    return {
      name: json.name,
      lastModified: json.lastModified,
      version: json.version,
      pages: (json.document?.children ?? []).map((p: { name: string }) => p.name),
    };
  },
};

const figmaGetComments: AgentTool = {
  name: 'figma_get_comments',
  description: 'Get recent comments on a Figma file.',
  input_schema: {
    type: 'object',
    properties: {
      fileKey: { type: 'string', description: 'The Figma file key' },
    },
    required: ['fileKey'],
  },
  connected: !!FIGMA_TOKEN,
  run: async (input) => {
    if (!FIGMA_TOKEN) return notConnected('Figma', 'FIGMA_TOKEN');
    const res = await fetch(`https://api.figma.com/v1/files/${input.fileKey}/comments`, {
      headers: { 'X-Figma-Token': FIGMA_TOKEN },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(`Figma API error: ${json?.err ?? res.statusText}`);
    return (json.comments as Array<{ message: string; user: { handle: string }; created_at: string }>)
      .slice(0, 10)
      .map((c) => ({ message: c.message, author: c.user?.handle, createdAt: c.created_at }));
  },
};

// ---------------------------------------------------------------------------

export const AGENT_TOOLS: AgentTool[] = [
  githubListRepos,
  githubListIssues,
  githubCreateIssue,
  notionSearch,
  notionCreatePage,
  slackPostMessage,
  slackListChannels,
  figmaGetFile,
  figmaGetComments,
];

export function getToolByName(name: string): AgentTool | undefined {
  return AGENT_TOOLS.find((t) => t.name === name);
}

export function connectionStatus() {
  return {
    github: !!GITHUB_TOKEN,
    notion: !!NOTION_TOKEN,
    slack: !!SLACK_BOT_TOKEN,
    figma: !!FIGMA_TOKEN,
  };
}
