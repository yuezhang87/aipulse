import { load } from 'cheerio';
import { PipelinePost, PipelineSource } from './types';
import { isNotificationRelevant } from './relevance';
import { ArticleFetch, fetchArticleText } from './article-fetch';

// Search terms aimed at tech-blog coverage of notification & agent trends,
// not generic AI discussion or personal complaint threads.
const QUERIES = [
  'notification fatigue',
  'push notifications AI',
  'AI agent notifications',
  'ambient computing',
  'proactive AI assistant',
  'do not disturb mode',
  'agentic AI',
  'digital wellbeing',
];

const MAX_ARTICLE_FETCHES = 15;

interface HnHit {
  objectID: string;
  title: string;
  story_text: string | null;
  url: string | null;
  author: string;
  points: number;
  created_at: string;
}

function stripHtml(html: string): string {
  const $ = load(html);
  return $('body').text().trim();
}

async function searchHn(query: string): Promise<HnHit[]> {
  const params = new URLSearchParams({
    query,
    tags: 'story',
    numericFilters: 'points>30',
    hitsPerPage: '10',
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
  const results = await Promise.allSettled(QUERIES.map(searchHn));

  const seen = new Set<string>();
  const candidates: HnHit[] = [];

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const hit of result.value) {
      if (seen.has(hit.objectID)) continue;
      seen.add(hit.objectID);
      candidates.push(hit);
    }
  }

  // Prioritize the strongest signals first, then cap external fetches.
  candidates.sort((a, b) => b.points - a.points);
  const toProcess = candidates.slice(0, MAX_ARTICLE_FETCHES);

  const posts: PipelinePost[] = [];

  const contents = await Promise.allSettled(
    toProcess.map(async (hit): Promise<ArticleFetch | null> => {
      if (hit.story_text) return { content: stripHtml(hit.story_text) };
      if (hit.url) return fetchArticleText(hit.url);
      return null;
    }),
  );

  for (let i = 0; i < toProcess.length; i++) {
    const hit = toProcess[i];
    const outcome = contents[i];
    const fetched = outcome.status === 'fulfilled' ? outcome.value : null;
    if (!fetched || fetched.content.length < 300) continue;
    if (!isNotificationRelevant(`${hit.title} ${fetched.content}`)) continue;

    posts.push({
      title: hit.title,
      content: fetched.content,
      url: hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
      author: hit.author,
      source: 'Hacker News',
      score: hit.points,
      imageUrl: fetched.imageUrl,
    });
  }

  return posts;
}

export const hnSource: PipelineSource = {
  name: 'Hacker News',
  fetchPosts: fetchHnPosts,
};
