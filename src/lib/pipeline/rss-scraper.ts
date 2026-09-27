import { load } from 'cheerio';
import { PipelinePost, PipelineSource } from './types';
import { isNotificationRelevant } from './relevance';
import { fetchArticleText, fetchWithTimeout } from './article-fetch';

const MAX_ARTICLES_PER_FEED = 10;
const MIN_CONTENT_LENGTH = 300;

interface RssItem {
  title: string;
  link: string;
  author?: string;
}

async function fetchFeedItems(feedUrl: string): Promise<RssItem[]> {
  const res = await fetchWithTimeout(feedUrl);
  if (!res || !res.ok) return [];

  const xml = await res.text();
  const $ = load(xml, { xmlMode: true });

  const items: RssItem[] = [];
  $('item').each((_, el) => {
    const title = $(el).find('title').first().text().trim();
    const link = $(el).find('link').first().text().trim();
    const author = $(el).find('creator, author').first().text().trim();
    if (title && link) items.push({ title, link, author: author || undefined });
  });

  return items.slice(0, MAX_ARTICLES_PER_FEED);
}

/** Builds a PipelineSource from any outlet's public RSS feed — same article-fetch + relevance-filter path as the other sources. */
export function createRssSource(name: string, feedUrl: string): PipelineSource {
  return {
    name,
    async fetchPosts(): Promise<PipelinePost[]> {
      const items = await fetchFeedItems(feedUrl);
      const fetched = await Promise.allSettled(items.map((item) => fetchArticleText(item.link)));

      const posts: PipelinePost[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const outcome = fetched[i];
        const article = outcome.status === 'fulfilled' ? outcome.value : null;
        if (!article || article.content.length < MIN_CONTENT_LENGTH) continue;
        if (!isNotificationRelevant(`${item.title} ${article.content}`)) continue;

        posts.push({
          title: item.title,
          content: article.content,
          url: item.link,
          author: item.author ?? name,
          source: name,
          score: 0, // RSS feeds carry no engagement metric comparable to HN points / Dev.to reactions.
          imageUrl: article.imageUrl,
        });
      }

      return posts;
    },
  };
}
