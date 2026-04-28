import { PipelinePost, PipelineSource } from './types';

const TAGS = ['ai', 'chatgpt', 'claude', 'llm', 'machinelearning'];

interface DevtoArticle {
  id: number;
  title: string;
  url: string;
  body_markdown: string;
  positive_reactions_count: number;
  user: {
    name: string;
  };
}

async function fetchByTag(tag: string): Promise<DevtoArticle[]> {
  const res = await fetch(
    `https://dev.to/api/articles?tag=${tag}&top=7&per_page=30`,
    { headers: { 'User-Agent': 'aiPulse/1.0' } },
  );

  if (!res.ok) {
    console.error(`Dev.to fetch failed for tag "${tag}": ${res.status}`);
    return [];
  }

  return res.json();
}

async function fetchDevtoPosts(): Promise<PipelinePost[]> {
  const results = await Promise.allSettled(TAGS.map(fetchByTag));

  const seen = new Set<string>();
  const posts: PipelinePost[] = [];

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;

    for (const article of result.value) {
      if (seen.has(article.url)) continue;
      seen.add(article.url);

      if (
        article.positive_reactions_count < 30 ||
        !article.body_markdown ||
        article.body_markdown.length < 500
      ) continue;

      posts.push({
        title: article.title,
        content: article.body_markdown,
        url: article.url,
        author: article.user.name,
        source: 'devto',
        score: article.positive_reactions_count,
      });
    }
  }

  return posts;
}

export const devtoSource: PipelineSource = {
  name: 'Dev.to',
  fetchPosts: fetchDevtoPosts,
};
