// ─── Community Service ───────────────────────────────────────────────────────
// Backend endpoints: GET /community/posts, POST /community/posts,
//                    POST /community/posts/:id/like, POST /community/posts/:id/replies
// The backend snapshots the author's name/handle/avatar/badge onto each post,
// so the response matches the frontend's Post shape directly.

import { api } from "./api";
import type { Post } from "@/data/community";

export const communityService = {
  getPosts: () => api.get<Post[]>("/community/posts"),

  createPost: (data: { category: string; content: string }) =>
    api.post<Post>("/community/posts", data),

  toggleLike: (postId: string) =>
    api.post<Post>(`/community/posts/${postId}/like`),

  addReply: (postId: string, content: string) =>
    api.post<Post>(`/community/posts/${postId}/replies`, { content }),
};
