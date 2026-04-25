import { createClient } from '@supabase/supabase-js';
import { Story, Category } from '@/types/story';

interface DbStory {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string | string[];
  author: string;
  category: string;
  tool: string;
  tool_url: string;
  image_url: string | null;
  spicy: boolean;
  source_url: string;
  source: string;
  score: number;
  status: string;
  created_at: string;
}

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (url, options) =>
          fetch(url, { ...options, cache: 'no-store' }),
      },
    }
  );
}

export function mapDbStory(row: DbStory): Story {
  const contentArr: string[] = Array.isArray(row.content)
    ? row.content
    : typeof row.content === 'string'
    ? [row.content]
    : [];
  const wordCount = contentArr.join(' ').split(/\s+/).filter(Boolean).length;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? '',
    source: row.source ?? 'Hacker News',
    sourceUrl: row.source_url ?? '',
    publishedAt: row.created_at,
    author: row.author ?? '',
    category: row.category as Category,
    readTime: Math.max(1, Math.ceil(wordCount / 200)),
    fireCount: 0,
    imageUrl: row.image_url ?? undefined,
    content: contentArr,
    spicy: row.spicy ?? false,
    tool: {
      name: row.tool ?? '',
      job: '',
      review: '',
      url: row.tool_url ?? '',
    },
  };
}

export async function getApprovedStories(): Promise<Story[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('pending_stories')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return (data as DbStory[]).map(mapDbStory);
}

export async function getStoryBySlug(slug: string): Promise<Story | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('pending_stories')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'approved')
    .maybeSingle();

  if (error || !data) return null;
  return mapDbStory(data as DbStory);
}
