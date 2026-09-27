export interface PipelinePost {
  title: string;
  content: string;
  url: string;
  author: string;
  source: string;
  score: number;
  /** Cover image scraped from the source article (og:image / twitter:image), when found. */
  imageUrl?: string;
}

export interface PipelineSource {
  name: string;
  fetchPosts: () => Promise<PipelinePost[]>;
}
