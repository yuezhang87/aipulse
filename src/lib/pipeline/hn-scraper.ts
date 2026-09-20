import { load } from 'cheerio';
import { PipelinePost, PipelineSource } from './types';
import { isNotificationRelevant } from './relevance';

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

const FETCH_TIMEOUT_MS = 8000;
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

async function fetchWithTimeout(url: string): Promise<Response | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      headers: { 'User-Agent': 'aiPulse/1.0' },
      signal: controller.signal,
    });
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchArticleText(url: string): Promise<string | null> {
  const res = await fetchWithTimeout(url);
  if (!res || !res.ok) return null;

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html')) return null;

  const html = await res.text();
  const $ = load(html);
  $('script, style, nav, header, footer, aside').remove();

  const article = $('article').text().trim() || $('main').text().trim() || $('body').text().trim();
  const cleaned = article.replace(/\s+/g, ' ').trim();
  return cleaned.length > 0 ? cleaned.slice(0, 6000) : null;
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
    toProcess.map(async (hit) => {
      if (hit.story_text) return stripHtml(hit.story_text);
      if (hit.url) return fetchArticleText(hit.url);
      return null;
    }),
  );

  for (let i = 0; i < toProcess.length; i++) {
    const hit = toProcess[i];
    const outcome = contents[i];
    const content = outcome.status === 'fulfilled' ? outcome.value : null;
    if (!content || content.length < 300) continue;
    if (!isNotificationRelevant(`${hit.title} ${content}`)) continue;

    posts.push({
      title: hit.title,
      content,
      url: hit.url ?? `https://news.ycombinator.com/item?id=${hit.objectID}`,
      author: hit.author,
      source: 'Hacker News',
      score: hit.points,
    });
  }

  return posts;
}

export const hnSource: PipelineSource = {
  name: 'Hacker News',
  fetchPosts: fetchHnPosts,
};
