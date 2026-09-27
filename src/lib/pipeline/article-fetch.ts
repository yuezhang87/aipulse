import { load } from 'cheerio';

const FETCH_TIMEOUT_MS = 8000;

export interface ArticleFetch {
  content: string;
  imageUrl?: string;
}

function resolveImageUrl(raw: string | undefined, pageUrl: string): string | undefined {
  if (!raw) return undefined;
  try {
    return new URL(raw, pageUrl).toString();
  } catch {
    return undefined;
  }
}

export async function fetchWithTimeout(url: string): Promise<Response | null> {
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

/** Fetches a page's readable text plus its og:image/twitter:image, when present. */
export async function fetchArticleText(url: string): Promise<ArticleFetch | null> {
  const res = await fetchWithTimeout(url);
  if (!res || !res.ok) return null;

  const contentType = res.headers.get('content-type') ?? '';
  if (!contentType.includes('text/html')) return null;

  const html = await res.text();
  const $ = load(html);

  const imageUrl = resolveImageUrl(
    $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content'),
    url,
  );

  $('script, style, nav, header, footer, aside').remove();

  const article = $('article').text().trim() || $('main').text().trim() || $('body').text().trim();
  const cleaned = article.replace(/\s+/g, ' ').trim();
  return cleaned.length > 0 ? { content: cleaned.slice(0, 6000), imageUrl } : null;
}
