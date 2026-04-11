export type Category =
  | "Design"
  | "Research"
  | "Finance"
  | "Health"
  | "Coding"
  | "Writing";

export interface Story {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string;
  publishedAt: string;
  category: Category;
  readTime: number;
  fireCount: number;
  imageUrl?: string;
}
