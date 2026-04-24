export interface PipelinePost {
  title: string;
  content: string;
  url: string;
  author: string;
  source: string;
  score: number;
}

export interface PipelineSource {
  name: string;
  fetchPosts: () => Promise<PipelinePost[]>;
}
