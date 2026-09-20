export type Category =
  | "Agentic Notifications"
  | "Notification Fatigue"
  | "Personalization"
  | "Platform Strategy"
  | "Ambient Computing"
  | "Privacy & Security"
  | "Developer Ecosystem";

export interface StoryTool {
  name: string;
  job: string;
  review: string;
  url: string;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  author?: string;
  category: Category;
  readTime: number;
  fireCount: number;
  imageUrl?: string;
  content: string[];
  tool: StoryTool;
  spicy?: boolean;
}
