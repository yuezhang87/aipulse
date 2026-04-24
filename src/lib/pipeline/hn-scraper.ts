import { load } from 'cheerio';
import { PipelinePost, PipelineSource } from './types';

// AI-related search terms to query against Ask HN posts
const AI_QUERIES = ['ChatGPT', 'Claude AI', 'LLM', 'GPT-4', 'AI tool', 'artificial intelligence'];

interface HnHit {
  objectID: string;
  title: string;
  story_text: string | null;
  url: string | null;
  author: string;
  points: number;
  created_at: string;
  _tags: string[];
}

function stripHtml(html: string): string {
  const $ = load(html);
  return $('body').text().trim();
}

async function searchHn(query: string): Promise<HnHit[]> {
  const params = new URLSearchParams({
    query,
    tags: 'ask_hn',
    numericFilters: 'points>50',
    hitsPerPage: '30',
  });

  const res = await fetch(`https://hn.algolia.com/api/v1/search?${params}`);
  if (!res.ok) {
    console.error(`HN search failed for "${query}": ${res.status}`);
    return [];
  }

  const json = await res.json();
  return (json.hits ?? []) as HnHit[];
}

async function fetchHnPosts(): Promise<PipelinePost[]> {
  const results = await Promise.allSettled(AI_QUERIES.map(searchHn));

  const seen = new Set<string>();
  const posts: PipelinePost[] = [];

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;

    for (const hit of result.value) {
      if (seen.has(hit.objectID)) continue;
      seen.add(hit.objectID);

      const rawText = hit.story_text ? stripHtml(hit.story_text) : '';
      if (rawText.length < 200) continue;

      posts.push({
        title: hit.title,
        content: rawText,
        url: `https://news.ycombinator.com/item?id=${hit.objectID}`,
        author: hit.author,
        source: 'Hacker News',
        score: hit.points,
      });
    }
  }

  return posts;
}

export const hnSource: PipelineSource = {
  name: 'Hacker News',
  fetchPosts: fetchHnPosts,
};
