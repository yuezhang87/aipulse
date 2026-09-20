import { PipelinePost, PipelineSource } from './types';
import { isNotificationRelevant } from './relevance';

const TAGS = ['android', 'ios', 'mobiledev', 'ai', 'llm', 'agents'];
const MIN_REACTIONS = 30;
const MIN_BODY_LENGTH = 500;

interface DevtoListItem {
  id: number;
  title: string;
  url: string;
  positive_reactions_count: number;
  user: { name: string };
}

interface DevtoArticle extends DevtoListItem {
  body_markdown: string;
}

async function fetchByTag(tag: string): Promise<DevtoListItem[]> {
  const res = await fetch(
    `https://dev.to/api/articles?tag=${tag}&top=7&per_page=30`,
    { headers: { 'User-Agent': 'aiPulse/1.0' } },
  );
  if (!res.ok) {
    console.error(`Dev.to listing failed for tag "${tag}": ${res.status}`);
    return [];
  }
  return res.json();
}

async function fetchFullArticle(id: number): Promise<DevtoArticle | null> {
  const res = await fetch(`https://dev.to/api/articles/${id}`, {
    headers: { 'User-Agent': 'aiPulse/1.0' },
  });
  if (!res.ok) return null;
  return res.json();
}

async function fetchDevtoPosts(): Promise<PipelinePost[]> {
  // Step 1: fetch listings for all tags in parallel
  const tagResults = await Promise.allSettled(TAGS.map(fetchByTag));

  // Deduplicate and pre-filter by reaction count
  const seen = new Set<number>();
  const candidates: DevtoListItem[] = [];

  for (const result of tagResults) {
    if (result.status !== 'fulfilled') continue;
    for (const article of result.value) {
      if (seen.has(article.id)) continue;
      seen.add(article.id);
      if (article.positive_reactions_count >= MIN_REACTIONS) {
        candidates.push(article);
      }
    }
  }

  // Step 2: fetch full articles (with body_markdown) in parallel for candidates
  const fullResults = await Promise.allSettled(
    candidates.map((c) => fetchFullArticle(c.id)),
  );

  const posts: PipelinePost[] = [];
  for (const result of fullResults) {
    if (result.status !== 'fulfilled' || !result.value) continue;
    const article = result.value;
    if (!article.body_markdown || article.body_markdown.length < MIN_BODY_LENGTH) continue;
    if (!isNotificationRelevant(`${article.title} ${article.body_markdown}`)) continue;

    posts.push({
      title: article.title,
      content: article.body_markdown,
      url: article.url,
      author: article.user.name,
      source: 'devto',
      score: article.positive_reactions_count,
    });
  }

  return posts;
}

export const devtoSource: PipelineSource = {
  name: 'Dev.to',
  fetchPosts: fetchDevtoPosts,
};
