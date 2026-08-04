// ─── Shared news shapes & helpers ────────────────────────────────────────────
// Both the News tab and the Home dashboard render backend news, so the article
// shape, the category styling and the backend->UI mapping live here rather than
// being re-declared in each screen. Home previously hardcoded its own preview
// articles with their own inline category colours, which meant the dashboard
// could show different stories (and different chip colours) than the News tab.

import type { NewsArticle as BackendNewsArticle } from "@/types/api";

/** An article as the screens render it. */
export interface Article {
  id: number;
  title: string;
  source: string;
  sourceUrl: string;
  category: string;
  time: string;
  readTime: string;
  image: string;
  summary: string;
  paragraphs: string[];
}

/**
 * Chip styling per category. These stay raw hex rather than theme tokens: they
 * are a fixed categorical palette (like a chart legend), so they should read the
 * same regardless of which brand theme the user picked.
 */
export const CATEGORY_META: Record<
  string,
  { bg: string; text: string; border: string; icon: string }
> = {
  Policy:    { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0", icon: "newspaper-outline" },
  Fintech:   { bg: "#eff6ff", text: "#1e40af", border: "#bfdbfe", icon: "phone-portrait-outline" },
  Investing: { bg: "#faf5ff", text: "#6b21a8", border: "#e9d5ff", icon: "trending-up-outline" },
  Savings:   { bg: "#fefce8", text: "#854d0e", border: "#fde68a", icon: "wallet-outline" },
};

/** Fallback chip styling for a category the app doesn't know about. */
export const DEFAULT_CATEGORY_META = {
  bg: "#f1f5f9",
  text: "#334155",
  border: "#e2e8f0",
  icon: "newspaper-outline",
};

export function categoryMeta(category: string) {
  return CATEGORY_META[category] ?? DEFAULT_CATEGORY_META;
}

/** "2h ago" style relative time from an ISO timestamp. */
export function newsTimeAgo(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 60) return `${Math.max(1, mins)}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

/** Maps a backend news article to the shape the screens render. */
export function mapBackendNews(items: BackendNewsArticle[]): Article[] {
  return items.map((a) => ({
    id: a.id,
    title: a.title,
    source: a.source,
    sourceUrl: a.sourceUrl,
    category: a.category,
    time: newsTimeAgo(a.publishedAt),
    readTime: a.readTime,
    image: a.imageUrl,
    summary: a.summary,
    paragraphs: a.content,
  }));
}
