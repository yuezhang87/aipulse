import { load } from 'cheerio';

// A stale @types/cheerio (pre-1.x API) is installed alongside modern cheerio
// and shadows its bundled types, so CheerioAPI/Cheerio aren't importable by
// name here — derive them from `load` itself instead.
type CheerioAPI = ReturnType<typeof load>;
type CheerioSelection = ReturnType<CheerioAPI>;

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

// Filters out badges, icons, avatars, and tracking pixels so the fallback
// doesn't grab a shields.io badge or nav logo instead of real content.
const NON_CONTENT_IMAGE_PATTERN = /sprite|icon|logo|avatar|pixel|spacer|badge|shields\.io|emoji/i;

function isLikelyContentImage(src: string | undefined, width?: string, height?: string): src is string {
  if (!src || src.startsWith('data:')) return false;
  if (NON_CONTENT_IMAGE_PATTERN.test(src)) return false;
  const w = Number(width);
  const h = Number(height);
  if (w > 0 && w < 50) return false;
  if (h > 0 && h < 50) return false;
  return true;
}

/** First real content image within the article body — a fallback for pages with no og:image (e.g. GitHub READMEs). */
function findInlineImage($: CheerioAPI, root: CheerioSelection, pageUrl: string): string | undefined {
  let found: string | undefined;
  root.find('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (isLikelyContentImage(src, $(el).attr('width'), $(el).attr('height'))) {
      found = resolveImageUrl(src, pageUrl);
      return false; // stop at the first match
    }
  });
  return found;
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

  let imageUrl = resolveImageUrl(
    $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[property="og:image:url"]').attr('content'),
    url,
  );

  $('script, style, nav, header, footer, aside').remove();

  const root = $('article').length ? $('article') : $('main').length ? $('main') : $('body');
  if (!imageUrl) imageUrl = findInlineImage($, root, url);

  const article = root.text().trim();
  const cleaned = article.replace(/\s+/g, ' ').trim();
  return cleaned.length > 0 ? { content: cleaned.slice(0, 6000), imageUrl } : null;
}
