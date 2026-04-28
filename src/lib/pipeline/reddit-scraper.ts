import { PipelinePost, PipelineSource } from './types';

const SUBREDDITS = [
  'ChatGPT',
  'ClaudeAI',
  'LocalLLaMA',
  'OpenClawUseCases',
  'singularity',
];

interface RedditChild {
  data: {
    title: string;
    selftext: string;
    permalink: string;
    author: string;
    subreddit: string;
    score: number;
    is_self: boolean;
  };
}

async function fetchSubredditPosts(subreddit: string): Promise<PipelinePost[]> {
  const res = await fetch(
    `https://www.reddit.com/r/${subreddit}/top.json?limit=10&t=week`,
    { headers: { 'User-Agent': 'aiPulse/1.0' } },
  );

  if (!res.ok) {
    console.error(`Failed to fetch r/${subreddit}: ${res.status}`);
    return [];
  }

  const json = await res.json();
  const children: RedditChild[] = json?.data?.children ?? [];

  return children
    .filter(
      (child) =>
        child.data.score >= 100 &&
        child.data.is_self &&
        child.data.selftext.length > 200,
    )
    .map((child) => ({
      title: child.data.title,
      content: child.data.selftext,
      url: `https://www.reddit.com${child.data.permalink}`,
      author: child.data.author,
      source: `r/${child.data.subreddit}`,
      score: child.data.score,
    }));
}

async function fetchRedditPosts(): Promise<PipelinePost[]> {
  const results = await Promise.allSettled(SUBREDDITS.map(fetchSubredditPosts));

  const seen = new Set<string>();
  const posts: PipelinePost[] = [];

  for (const result of results) {
    if (result.status !== 'fulfilled') continue;
    for (const post of result.value) {
      if (seen.has(post.url)) continue;
      seen.add(post.url);
      posts.push(post);
    }
  }

  return posts;
}

export const redditSource: PipelineSource = {
  name: 'Reddit',
  fetchPosts: fetchRedditPosts,
};
