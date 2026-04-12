export type Category =
  | "Design"
  | "Research"
  | "Finance"
  | "Health"
  | "Coding"
  | "Writing";

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
  category: Category;
  readTime: number;
  fireCount: number;
  imageUrl?: string;
  content: string[];
  tool: StoryTool;
}
