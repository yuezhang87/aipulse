export interface RedditPost {
  title: string;
  content: string;
  url: string;
  author: string;
  subreddit: string;
  score: number;
}

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
    url: string;
    author: string;
    subreddit: string;
    score: number;
    is_self: boolean;
  };
}

async function fetchSubredditPosts(subreddit: string): Promise<RedditPost[]> {
  const url = `https://www.reddit.com/r/${subreddit}/top/.json?limit=25&t=week`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'aiPulse/1.0 content-pipeline' },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    console.error(`Failed to fetch r/${subreddit}: ${res.status}`);
    return [];
  }

  const json = await res.json();
  const children: RedditChild[] = json?.data?.children ?? [];

  return children
    .filter(
      (child) =>
        child.data.score >= 50 &&
        child.data.is_self &&
        child.data.selftext.length > 200
    )
    .map((child) => ({
      title: child.data.title,
      content: child.data.selftext,
      url: `https://www.reddit.com${child.data.url.startsWith('/r/') ? child.data.url : `/r/${subreddit}/comments/`}`,
      author: child.data.author,
      subreddit: child.data.subreddit,
      score: child.data.score,
    }));
}

export async function fetchRedditPosts(): Promise<RedditPost[]> {
  const results = await Promise.allSettled(
    SUBREDDITS.map((sub) => fetchSubredditPosts(sub))
  );

  return results
    .filter((r): r is PromiseFulfilledResult<RedditPost[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value);
}
