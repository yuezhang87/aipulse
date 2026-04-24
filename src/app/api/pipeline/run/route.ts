import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { hnSource } from '@/lib/pipeline/hn-scraper';
// import { redditSource } from '@/lib/pipeline/reddit-scraper';
import { processPost } from '@/lib/pipeline/claude-processor';
import { PipelineSource } from '@/lib/pipeline/types';

const PIPELINE_SECRET = 'aipulse-pipeline-2026';

const SOURCES: PipelineSource[] = [
  hnSource,
  // redditSource,
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

  for (const source of SOURCES) {
    let posts;
    try {
      posts = await source.fetchPosts();
    } catch (err) {
      console.error(`[${source.name}] Failed to fetch posts:`, err);
      continue;
    }

    for (const post of posts) {
      processed++;

      let result;
      try {
        result = await processPost(post);
      } catch (err) {
        console.error(`[${source.name}] Failed to process "${post.title}":`, err);
        continue;
      }

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

  return NextResponse.json({ processed, approved, saved });
}
