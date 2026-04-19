export interface Prompt {
  id: string;
  title: string;
  content: string;
  complexity: number;
  tags?: string[];
  created_at: string;
  view_count?: number; // Only returned on detail view
}
