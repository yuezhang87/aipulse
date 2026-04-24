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

async function getAccessToken(): Promise<string> {
  const clientId = process.env.REDDIT_CLIENT_ID!;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET!;
  const username = process.env.REDDIT_USERNAME!;
  const password = process.env.REDDIT_PASSWORD!;

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': `aiPulse/1.0 by ${username}`,
    },
    body: new URLSearchParams({ grant_type: 'password', username, password }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Reddit OAuth failed (${res.status}): ${body}`);
  }

  const json = await res.json();
  if (json.error) throw new Error(`Reddit OAuth error: ${json.error}`);
  return json.access_token as string;
}

async function fetchSubredditPosts(
  subreddit: string,
  token: string,
  username: string,
): Promise<PipelinePost[]> {
  const res = await fetch(
    `https://oauth.reddit.com/r/${subreddit}/top?limit=25&t=week`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': `aiPulse/1.0 by ${username}`,
      },
    },
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
        child.data.score >= 50 &&
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
  const username = process.env.REDDIT_USERNAME!;
  const token = await getAccessToken();

  const results = await Promise.allSettled(
    SUBREDDITS.map((sub) => fetchSubredditPosts(sub, token, username)),
  );

  return results
    .filter((r): r is PromiseFulfilledResult<PipelinePost[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value);
}

export const redditSource: PipelineSource = {
  name: 'Reddit',
  fetchPosts: fetchRedditPosts,
};
