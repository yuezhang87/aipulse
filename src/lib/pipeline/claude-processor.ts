import Anthropic from '@anthropic-ai/sdk';
import { PipelinePost } from './types';
import { Category } from '@/types/story';

export interface ProcessedStory {
  score: number;
  title: string;
  slug: string;
  summary: string;
  content: string[];
  author: string;
  category: Category;
  tool: string;
  toolUrl: string;
  spicy: boolean;
  sourceUrl: string;
}

export type ProcessResult =
  | { score: number; story: ProcessedStory }
  | { score: number; story: null };

const SYSTEM_PROMPT = `You are a trend analyst for aiPulse, a dashboard that tracks how mobile notifications and AI agents are evolving — used by a product researcher to spot macro trends before they hit the mainstream. You curate signals from tech media and official sources, not personal anecdotes. You have very specific taste and a sharp eye for what's a genuine forward-looking signal versus generic AI hype.`;

const CATEGORIES = [
  'Agentic Notifications',
  'Notification Fatigue',
  'Personalization',
  'Platform Strategy',
  'Ambient Computing',
  'Privacy & Security',
  'Developer Ecosystem',
];

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function processPost(post: PipelinePost): Promise<ProcessResult> {
  const userPrompt = `Score this post 1-10 on these four criteria:
1. Is it specifically about notifications/alerts, or about an AI agent that notifies or acts on a user's behalf — not just AI in general? (0-3 pts)
2. Is it from a credible tech media outlet, official blog, or research source, with concrete specifics — a product launch, platform change, research finding, or informed prediction (not a vague opinion or a personal complaint)? (0-3 pts)
3. Does it carry a forward-looking signal about where mobile notifications or agent-driven interruptions are heading next? (0-2 pts)
4. Is the take notably bold, contrarian, or non-obvious about that future direction? (0-2 pts)

Add the points for a total score 1-10. Be strict — most posts should score 5-7. Only exceptional posts score 9-10.

If score >= 7, rewrite it as an aiPulse trend brief: state the signal plainly, then explain what it implies for the future of mobile notifications, agents, or ambient computing. 4-6 short paragraphs, analytical tone, no first-person narrative.

Return JSON only: { score, title, slug, summary, content: string[], author, category, tool, toolUrl, spicy: boolean, sourceUrl }

Categories: ${CATEGORIES.join(', ')}.
author: the publication or outlet name (not a person), unless the post itself names an individual analyst.
tool: the specific product, platform, or protocol at the center of the signal (e.g. a named feature, app, or standard).
spicy: true only if the prediction is bold, contrarian, or challenges the conventional read on where notifications/agents are headed.

If score < 7, return { score } only.

---
Title: ${post.title}
Author: ${post.author}
Source: ${post.source}
Signal strength (upvotes/reactions): ${post.score}
URL: ${post.url}

${post.content}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { score: 0, story: null };

  const parsed = JSON.parse(jsonMatch[0]);
  const score: number = parsed.score ?? 0;

  if (score < 7 || !parsed.title) return { score, story: null };

  const story: ProcessedStory = {
    score,
    title: parsed.title,
    slug: parsed.slug ?? parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    summary: parsed.summary ?? '',
    content: Array.isArray(parsed.content) ? parsed.content : [parsed.content],
    author: parsed.author ?? post.author,
    category: parsed.category ?? 'Platform Strategy',
    tool: parsed.tool ?? '',
    toolUrl: parsed.toolUrl ?? '',
    spicy: parsed.spicy ?? false,
    sourceUrl: parsed.sourceUrl ?? post.url,
  };

  return { score, story };
}
