import Anthropic from '@anthropic-ai/sdk';
import { choice, score as scoreQuestion, TypeSafeClient } from '@typesafe-ai/sdk';
import { PipelinePost } from './types';
import { Category } from '@/types/story';

export interface ProcessedStory {
  score: number;
  title: string;
  slug: string;
  summary: string;
  content: string[];
  author: string;
  category: Category;
  tool: string;
  toolUrl: string;
  spicy: boolean;
  sourceUrl: string;
}

export type ProcessResult =
  | { score: number; story: ProcessedStory }
  | { score: number; story: null };

const SYSTEM_PROMPT = `You are a trend analyst for aiPulse, a dashboard that tracks how mobile notifications and AI agents are evolving — used by a product researcher to spot macro trends before they hit the mainstream. You curate signals from tech media and official sources, not personal anecdotes. You have very specific taste and a sharp eye for what's a genuine forward-looking signal versus generic AI hype.`;

// Keys must match Category in '@/types/story'.
const CATEGORY_CRITERIA = {
  'Agentic Notifications': null,
  'Notification Fatigue': null,
  Personalization: null,
  'Platform Strategy': null,
  'Ambient Computing': null,
  'Privacy & Security': null,
  'Developer Ecosystem': null,
} as const;

const SIGNAL_INSTRUCTIONS = `Score this post 1-10 as a trend signal for aiPulse, a dashboard that tracks how mobile notifications and AI agents are evolving. Add points from these four criteria:
1. Is it specifically about notifications/alerts, or about an AI agent that notifies or acts on a user's behalf — not just AI in general? (0-3 pts)
2. Is it from a credible tech media outlet, official blog, or research source, with concrete specifics — a product launch, platform change, research finding, or informed prediction (not a vague opinion or a personal complaint)? (0-3 pts)
3. Does it carry a forward-looking signal about where mobile notifications or agent-driven interruptions are heading next? (0-2 pts)
4. Is the take notably bold, contrarian, or non-obvious about that future direction? (0-2 pts)
Be strict — most posts should score 5-7. Only exceptional posts score 9-10.`;

// Indexed by score, from zero, matching the four-criteria rubric above (max 3+3+2+2=10).
const SIGNAL_SCORE_CRITERIA = [
  "Not about notifications or an AI agent acting on a user's behalf; or a personal complaint/opinion with no forward-looking signal and no credible source.",
  null,
  'Weak signal: barely touches notifications/agents, from a low-credibility source, with no forward-looking claim.',
  null,
  'Below-bar: touches the topic but is generic AI hype, a vague opinion, or lacks concrete specifics from a credible source.',
  'Solid but ordinary: clearly about notifications/agents from a credible source with concrete specifics, but no real forward-looking signal or bold take.',
  null,
  'Good signal: specifically about notifications/agents, from a credible source with concrete specifics, and carries a real forward-looking signal about where things are heading.',
  'Strong signal: everything in the prior level, and notably bold, contrarian, or non-obvious about the future direction.',
  'Exceptional: an unusually sharp, concrete, and bold forward-looking signal from a highly credible source — a rare must-read.',
  'The strongest possible signal: a landmark, highly credible, highly specific, and boldly contrarian view of where mobile notifications or agents are heading.',
] as const;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Constructed lazily: unlike the Anthropic client, TypeSafeClient throws immediately
// if the API key is missing, which would break builds/module loads without one set.
let typesafeClient: TypeSafeClient | undefined;
function getTypeSafeClient(): TypeSafeClient {
  if (!typesafeClient) {
    typesafeClient = new TypeSafeClient({ apiKey: process.env.TYPESAFE_API_KEY });
  }
  return typesafeClient;
}

export async function processPost(post: PipelinePost): Promise<ProcessResult> {
  const judgment = await getTypeSafeClient().systemOne({
    state: {
      title: post.title,
      author: post.author,
      source: post.source,
      signalStrength: post.score,
      url: post.url,
      content: post.content,
    },
    questions: {
      category: choice(
        'What category best fits this post for aiPulse, a dashboard that tracks how mobile notifications and AI agents are evolving?',
        CATEGORY_CRITERIA
      ),
      signal: scoreQuestion(SIGNAL_INSTRUCTIONS, SIGNAL_SCORE_CRITERIA),
    },
  });

  const score = Math.round(judgment.answers.signal.score);
  const category = judgment.answers.category.choice as Category;

  if (score < 7) return { score, story: null };

  const userPrompt = `Rewrite this post as an aiPulse trend brief: state the signal plainly, then explain what it implies for the future of mobile notifications, agents, or ambient computing. 4-6 short paragraphs, analytical tone, no first-person narrative.

Return JSON only: { title, slug, summary, content: string[], author, tool, toolUrl, spicy: boolean, sourceUrl }

author: the publication or outlet name (not a person), unless the post itself names an individual analyst.
tool: the specific product, platform, or protocol at the center of the signal (e.g. a named feature, app, or standard).
spicy: true only if the prediction is bold, contrarian, or challenges the conventional read on where notifications/agents are headed.

---
Title: ${post.title}
Author: ${post.author}
Source: ${post.source}
Signal strength (upvotes/reactions): ${post.score}
URL: ${post.url}

${post.content}`;

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return { score, story: null };

  const parsed = JSON.parse(jsonMatch[0]);
  if (!parsed.title) return { score, story: null };

  const story: ProcessedStory = {
    score,
    title: parsed.title,
    slug: parsed.slug ?? parsed.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    summary: parsed.summary ?? '',
    content: Array.isArray(parsed.content) ? parsed.content : [parsed.content],
    author: parsed.author ?? post.author,
    category,
    tool: parsed.tool ?? '',
    toolUrl: parsed.toolUrl ?? '',
    spicy: parsed.spicy ?? false,
    sourceUrl: parsed.sourceUrl ?? post.url,
  };

  return { score, story };
}
