import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hnSource } from '@/lib/pipeline/hn-scraper';
import { devtoSource } from '@/lib/pipeline/devto-scraper';
import { createRssSource } from '@/lib/pipeline/rss-scraper';
import { processPost } from '@/lib/pipeline/claude-processor';
import { PipelineSource } from '@/lib/pipeline/types';

// Pipeline runs can take a while (multiple article fetches + Claude calls per source).
export const maxDuration = 60;

const PIPELINE_SECRET = 'aipulse-pipeline-2026';

const SOURCES: PipelineSource[] = [
  hnSource,
  devtoSource,
  // Mainstream tech-media coverage, balanced across platforms (not just Android).
  createRssSource('TechCrunch', 'https://techcrunch.com/feed/'),
  createRssSource('9to5Mac', 'https://9to5mac.com/feed/'),
  createRssSource('9to5Google', 'https://9to5google.com/feed/'),
  createRssSource('The Verge', 'https://www.theverge.com/rss/index.xml'),
];

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

async function runPipeline() {
  const supabase = getSupabase();
  let processed = 0;
  let approved = 0;
  let saved = 0;
  const seenUrls = new Set<string>();

  for (const source of SOURCES) {
    let posts;
    try {
      posts = await source.fetchPosts();
    } catch (err) {
      console.error(`[${source.name}] Failed to fetch posts:`, err);
      continue;
    }

    posts = posts.filter((p) => {
      if (seenUrls.has(p.url)) return false;
      seenUrls.add(p.url);
      return true;
    });

    processed += posts.length;

    // Process Claude calls in batches of 3 to stay within rate limits
    const CONCURRENCY = 3;
    for (let i = 0; i < posts.length; i += CONCURRENCY) {
      const batch = posts.slice(i, i + CONCURRENCY);
      const results = await Promise.allSettled(batch.map((post) => processPost(post)));

      for (let j = 0; j < results.length; j++) {
        const outcome = results[j];
        const post = batch[j];

        if (outcome.status === 'rejected') {
          console.error(`[${source.name}] Failed to process "${post.title}":`, outcome.reason);
          continue;
        }

        const result = outcome.value;
        console.log(`[${source.name}] "${post.title}" scored ${result.score}${result.story ? ' — approved' : ''}`);
        if (!result.story) continue;
        approved++;

        const story = result.story;
        const { error } = await supabase.from('pending_stories').insert({
          title: story.title,
          slug: story.slug,
          summary: story.summary,
          content: story.content,
          author: story.author,
          category: story.category,
          tool: story.tool,
          tool_url: story.toolUrl,
          spicy: story.spicy,
          source_url: story.sourceUrl,
          source: post.source,
          score: story.score,
          image_url: story.imageUrl ?? null,
          status: 'pending',
        });

        if (error) {
          console.error(`[${source.name}] Failed to save "${story.title}":`, error.message);
        } else {
          saved++;
        }
      }
    }
  }

  return { processed, approved, saved };
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-pipeline-secret');
  if (secret !== PIPELINE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await runPipeline();
  return NextResponse.json(result);
}

// Vercel Cron invokes scheduled routes with GET and an
// `Authorization: Bearer $CRON_SECRET` header (see vercel.json). The
// `?secret=` query param is an alternate way to authenticate the same
// GET route for a manual/ad-hoc run (e.g. from a browser or a tool that
// can't set custom headers).
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  const querySecret = req.nextUrl.searchParams.get('secret');
  const authorized =
    auth === `Bearer ${process.env.CRON_SECRET}` || querySecret === process.env.CRON_SECRET;
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const result = await runPipeline();
  return NextResponse.json(result);
}
