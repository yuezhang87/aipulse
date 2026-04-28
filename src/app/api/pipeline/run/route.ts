import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hnSource } from '@/lib/pipeline/hn-scraper';
import { redditSource } from '@/lib/pipeline/reddit-scraper';
import { processPost } from '@/lib/pipeline/claude-processor';
import { PipelineSource } from '@/lib/pipeline/types';

const PIPELINE_SECRET = 'aipulse-pipeline-2026';

const SOURCES: PipelineSource[] = [
  hnSource,
  redditSource,
];

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(url, key);
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-pipeline-secret');
  if (secret !== PIPELINE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

  return NextResponse.json({ processed, approved, saved });
}
