import Anthropic from '@anthropic-ai/sdk';
import { RedditPost } from './reddit-scraper';
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

const SYSTEM_PROMPT = `You are a content curator for aiPulse, a platform that collects real personal stories of how people use AI tools in their work and life. You have very specific taste.`;

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function processRedditPost(post: RedditPost): Promise<ProcessResult> {
  const userPrompt = `Score this Reddit post 1-10 on: (1) Is it a personal story not advice? (2) Does it mention a specific AI tool? (3) Is there a concrete result? (4) Is it surprising or insightful?

If score is 7 or higher, rewrite it as an aiPulse story with: engaging opening, easy to understand, focused on HOW they did it, 4-6 paragraphs.

Return JSON only: { score, title, slug, summary, content: string[], author, category, tool, toolUrl, spicy: boolean, sourceUrl }

Categories: Health, Finance, Coding, Design, Writing, Research, Business.

If score is below 7, return { score } only.

---
Title: ${post.title}
Author: ${post.author}
Subreddit: r/${post.subreddit}
Score: ${post.score}
URL: https://www.reddit.com/r/${post.subreddit}

${post.content}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return { score: 0, story: null };
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const score: number = parsed.score ?? 0;

  if (score < 7 || !parsed.title) {
    return { score, story: null };
  }

  const story: ProcessedStory = {
    score,
    title: parsed.title,
    slug: parsed.slug ?? parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    summary: parsed.summary ?? '',
    content: Array.isArray(parsed.content) ? parsed.content : [parsed.content],
    author: parsed.author ?? post.author,
    category: parsed.category ?? 'Research',
    tool: parsed.tool ?? '',
    toolUrl: parsed.toolUrl ?? '',
    spicy: parsed.spicy ?? false,
    sourceUrl: parsed.sourceUrl ?? `https://www.reddit.com/r/${post.subreddit}`,
  };

  return { score, story };
}
