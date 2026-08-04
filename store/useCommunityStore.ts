import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { INITIAL_POSTS, Post, Reply } from "@/data/community";

interface CommunityState {
  posts: Post[];
}

interface CommunityActions {
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  likePost: (postId: string, currentlyLiked: boolean) => void;
  addReply: (postId: string, reply: Reply) => void;
  resetPosts: () => void;
}

export const useCommunityStore = create<CommunityState & CommunityActions>()(
  persist(
    (set) => ({
      posts: INITIAL_POSTS,

      // Replaces the whole list with the backend's posts.
      setPosts: (posts) => set({ posts: posts.slice(0, 50) }),

      addPost: (post) =>
        set((state) => ({
          posts: [post, ...state.posts].slice(0, 50),
        })),

      likePost: (postId, currentlyLiked) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  likedByUser: !currentlyLiked,
                  likes: currentlyLiked ? Math.max(0, p.likes - 1) : p.likes + 1,
                }
              : p
          ),
        })),

      addReply: (postId, reply) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === postId ? { ...p, replies: [...p.replies, reply] } : p
          ),
        })),

      resetPosts: () => set({ posts: INITIAL_POSTS }),
    }),
    {
      name: "finlit-community-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
