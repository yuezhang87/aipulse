import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fetchRedditPosts } from '@/lib/pipeline/reddit-scraper';
import { processRedditPost } from '@/lib/pipeline/claude-processor';

const PIPELINE_SECRET = 'aipulse-pipeline-2026';

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

  const posts = await fetchRedditPosts();
  let processed = 0;
  let approved = 0;
  let saved = 0;

  for (const post of posts) {
    processed++;

    let result;
    try {
      result = await processRedditPost(post);
    } catch (err) {
      console.error(`Failed to process post "${post.title}":`, err);
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
      source: `r/${post.subreddit}`,
      score: story.score,
      status: 'pending',
    });

    if (error) {
      console.error(`Failed to save story "${story.title}":`, error.message);
    } else {
      saved++;
    }
  }

  return NextResponse.json({ processed, approved, saved });
}
