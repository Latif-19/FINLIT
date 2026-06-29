import React, { useState, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/useUserStore";

interface Reply {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  badge: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  badge: string;
  category: string;
  content: string;
  likes: number;
  likedByUser: boolean;
  createdAt: string;
  replies: Reply[];
}

import { COMMUNITY_CATEGORIES, INITIAL_POSTS } from "@/data/community";

const CATEGORIES = COMMUNITY_CATEGORIES;

export default function CommunityScreen() {
  const userName = useUserStore((s) => s.name);
  const userAvatar = useUserStore((s) => s.avatar);
  const userScore = useUserStore((s) => s.score);

  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Create Post Modal State
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("Savings");

  // Thread Details/Reply Modal State
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [replyText, setReplyText] = useState("");

  const getUserBadge = () => {
    if (userScore >= 13) return "Wealth Builder Pro";
    if (userScore >= 8) return "Smart Manager";
    return "Novice Explorer";
  };

  const getUserHandle = () => {
    return `@${userName.toLowerCase().replace(/\s+/g, "_")}`;
  };

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const liked = !post.likedByUser;
          return {
            ...post,
            likedByUser: liked,
            likes: liked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
    // Sync the active post in detail view if it's currently open
    if (activePost && activePost.id === postId) {
      setActivePost((prev) => {
        if (!prev) return null;
        const liked = !prev.likedByUser;
        return {
          ...prev,
          likedByUser: liked,
          likes: liked ? prev.likes + 1 : prev.likes - 1,
        };
      });
    }
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: userName,
      handle: getUserHandle(),
      avatar: userAvatar || "🦉",
      badge: getUserBadge(),
      category: newPostCategory,
      content: newPostContent.trim(),
      likes: 0,
      likedByUser: false,
      createdAt: "Just now",
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setCreateModalVisible(false);
  };

  const handleAddReply = () => {
    if (!replyText.trim() || !activePost) return;

    const newReply: Reply = {
      id: `rep-${Date.now()}`,
      author: userName,
      handle: getUserHandle(),
      avatar: userAvatar || "🦉",
      badge: getUserBadge(),
      content: replyText.trim(),
      createdAt: "Just now",
    };

    const updatedPosts = posts.map((post) => {
      if (post.id === activePost.id) {
        const newReplies = [...post.replies, newReply];
        return {
          ...post,
          replies: newReplies,
        };
      }
      return post;
    });

    setPosts(updatedPosts);
    setActivePost({
      ...activePost,
      replies: [...activePost.replies, newReply],
    });
    setReplyText("");
  };

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Savings":
        return "bg-green-100 text-green-800 border-green-200";
      case "Budgeting":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Investing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Debt Free":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header Panel */}
      <View className="bg-white pt-12 pb-5 px-6 border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-black text-gray-800">Community Hub</Text>
            <Text className="text-gray-400 text-xs mt-1">
              {"Connect & grow with fellow financial builders"}
            </Text>
          </View>
          <Pressable
            onPress={() => setCreateModalVisible(true)}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
            className="bg-green-700 w-11 h-11 rounded-2xl items-center justify-center shadow-sm"
          >
            <Ionicons name="create-outline" size={22} color="white" />
          </Pressable>
        </View>

        {/* Categories Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mt-5"
          contentContainerStyle={{ gap: 8, paddingRight: 16 }}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-full border ${
                selectedCategory === cat
                  ? "bg-green-700 border-green-700"
                  : "bg-white border-gray-200 active:bg-gray-50"
              }`}
            >
              <Text
                className={`text-xs font-extrabold ${
                  selectedCategory === cat ? "text-white" : "text-gray-600"
                }`}
              >
                {cat === "All" ? cat : `#${cat}`}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Main Post Feed */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredPosts.length === 0 ? (
          <View className="items-center justify-center py-20">
            <View className="w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="chatbubbles-outline" size={32} color="#9ca3af" />
            </View>
            <Text className="text-gray-700 text-base font-bold">No discussions yet</Text>
            <Text className="text-gray-400 text-sm mt-1 text-center px-6">
              {`Be the first to ask a question or start a discussion under #${selectedCategory}!`}
            </Text>
          </View>
        ) : (
          filteredPosts.map((post) => (
            <View
              key={post.id}
              className="bg-white border border-gray-200 rounded-3xl p-5 mb-4 shadow-sm"
            >
              {/* Post Header */}
              <View className="flex-row justify-between items-start">
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-11 h-11 bg-green-50 rounded-2xl items-center justify-center mr-3 border border-green-100">
                    <Text className="text-2xl">{post.avatar}</Text>
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center flex-wrap gap-1">
                      <Text className="font-bold text-gray-800 text-base" numberOfLines={1}>
                        {post.author}
                      </Text>
                      <View className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                        <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                          {post.badge}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-gray-400 text-xs mt-0.5">
                      {post.handle} • {post.createdAt}
                    </Text>
                  </View>
                </View>

                {/* Category tag */}
                <View className={`px-2.5 py-1 rounded-xl border ${getCategoryBadgeColor(post.category)}`}>
                  <Text className="text-[10px] font-black uppercase tracking-wider">
                    {post.category}
                  </Text>
                </View>
              </View>

              {/* Post Content */}
              <Text className="text-gray-700 text-base mt-4 leading-6 font-medium">
                {post.content}
              </Text>

              {/* Feed Buttons */}
              <View className="flex-row items-center mt-5 pt-4 border-t border-gray-100 gap-6">
                {/* Like Button */}
                <Pressable
                  onPress={() => handleLike(post.id)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  className="flex-row items-center"
                >
                  <Ionicons
                    name={post.likedByUser ? "heart" : "heart-outline"}
                    size={20}
                    color={post.likedByUser ? "#ef4444" : "#9ca3af"}
                  />
                  <Text
                    className={`text-sm font-bold ml-2 ${
                      post.likedByUser ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    {post.likes}
                  </Text>
                </Pressable>

                {/* Reply/Comments Button */}
                <Pressable
                  onPress={() => {
                    setActivePost(post);
                    setReplyModalVisible(true);
                  }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  className="flex-row items-center"
                >
                  <Ionicons name="chatbubble-outline" size={19} color="#9ca3af" />
                  <Text className="text-sm font-bold text-gray-400 ml-2">
                    {post.replies.length}
                  </Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ── NEW POST MODAL ── */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          {/* Modal Header */}
          <View className="px-5 pt-6 pb-4 border-b border-gray-200 flex-row justify-between items-center bg-white">
            <Pressable
              onPress={() => setCreateModalVisible(false)}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={22} color="#4b5563" />
            </Pressable>
            <Text className="text-lg font-bold text-gray-800">Ask the Community</Text>
            <Pressable
              onPress={handleCreatePost}
              disabled={!newPostContent.trim()}
              className={`px-4 py-2 rounded-full ${
                newPostContent.trim() ? "bg-green-700" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-xs font-bold uppercase tracking-wider ${
                  newPostContent.trim() ? "text-white" : "text-gray-400"
                }`}
              >
                Post
              </Text>
            </Pressable>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1"
          >
            <ScrollView className="flex-1 p-5">
              {/* User preview header */}
              <View className="flex-row items-center mb-5">
                <View className="w-11 h-11 bg-green-50 rounded-2xl items-center justify-center mr-3 border border-green-100">
                  <Text className="text-2xl">{userAvatar || "🦉"}</Text>
                </View>
                <View>
                  <Text className="font-bold text-gray-800 text-sm">
                    {`Posting as ${userName}`}
                  </Text>
                  <Text className="text-gray-400 text-xs">{getUserHandle()}</Text>
                </View>
              </View>

              {/* Tag selector */}
              <Text className="text-gray-400 text-xs font-extrabold uppercase tracking-wider mb-2">
                Select Category Topic
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {CATEGORIES.slice(1).map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setNewPostCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl border ${
                      newPostCategory === cat
                        ? "bg-green-100 border-green-700 text-green-700"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        newPostCategory === cat ? "text-green-800" : "text-gray-500"
                      }`}
                    >
                      {`# ${cat}`}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Text Input */}
              <TextInput
                className="bg-gray-50 rounded-2xl p-4 text-base font-semibold text-gray-800 border border-gray-200 min-h-[160] text-start align-top"
                multiline
                placeholder="What is on your mind? Ask a question, share a victory, or give a tip..."
                placeholderTextColor="#9ca3af"
                value={newPostContent}
                onChangeText={setNewPostContent}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* ── THREAD DETAILS / REPLY MODAL ── */}
      <Modal
        visible={replyModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setReplyModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-gray-50">
          {/* Header */}
          <View className="px-5 pt-6 pb-4 border-b border-gray-200 flex-row items-center bg-white justify-between">
            <Pressable
              onPress={() => {
                setReplyModalVisible(false);
                setActivePost(null);
              }}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3"
            >
              <Ionicons name="arrow-back" size={22} color="#4b5563" />
            </Pressable>
            <Text className="text-lg font-bold text-gray-800">Thread Details</Text>
            <View style={{ width: 40 }} />
          </View>

          {activePost && (
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              className="flex-1"
              keyboardVerticalOffset={Platform.OS === "ios" ? 44 : 0}
            >
              {/* Comments List */}
              <ScrollView className="flex-1 p-5" showsVerticalScrollIndicator={false}>
                {/* Original Post Card */}
                <View className="bg-white border border-gray-200 rounded-3xl p-5 mb-6 shadow-sm">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-row items-center mr-2 flex-1">
                      <View className="w-11 h-11 bg-green-50 rounded-2xl items-center justify-center mr-3 border border-green-100">
                        <Text className="text-2xl">{activePost.avatar}</Text>
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center flex-wrap gap-1">
                          <Text className="font-bold text-gray-800 text-base" numberOfLines={1}>
                            {activePost.author}
                          </Text>
                          <View className="px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                            <Text className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                              {activePost.badge}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-gray-400 text-xs mt-0.5">
                          {activePost.handle} • {activePost.createdAt}
                        </Text>
                      </View>
                    </View>
                    <View className={`px-2.5 py-1 rounded-xl border ${getCategoryBadgeColor(activePost.category)}`}>
                      <Text className="text-[10px] font-black uppercase tracking-wider">
                        {activePost.category}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-gray-800 text-base mt-4 leading-6 font-semibold">
                    {activePost.content}
                  </Text>

                  <View className="flex-row items-center mt-5 pt-4 border-t border-gray-100 gap-6">
                    <Pressable
                      onPress={() => handleLike(activePost.id)}
                      className="flex-row items-center"
                    >
                      <Ionicons
                        name={activePost.likedByUser ? "heart" : "heart-outline"}
                        size={20}
                        color={activePost.likedByUser ? "#ef4444" : "#9ca3af"}
                      />
                      <Text
                        className={`text-sm font-bold ml-2 ${
                          activePost.likedByUser ? "text-red-500" : "text-gray-400"
                        }`}
                      >
                        {activePost.likes}
                      </Text>
                    </Pressable>
                    <View className="flex-row items-center">
                      <Ionicons name="chatbubble-outline" size={19} color="#9ca3af" />
                      <Text className="text-sm font-bold text-gray-400 ml-2">
                        {activePost.replies.length} replies
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Section title */}
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 ml-1">
                  {`Replies (${activePost.replies.length})`}
                </Text>

                {/* Reply cards */}
                {activePost.replies.length === 0 ? (
                  <View className="items-center py-8">
                    <Text className="text-gray-400 text-sm italic">{"No replies yet. Be the first to answer!"}</Text>
                  </View>
                ) : (
                  activePost.replies.map((rep) => (
                    <View
                      key={rep.id}
                      className="bg-white border border-gray-200 rounded-2xl p-4 mb-3"
                    >
                      <View className="flex-row items-center mb-2.5 justify-between">
                        <View className="flex-row items-center flex-1 mr-2">
                          <View className="w-8 h-8 bg-gray-100 rounded-xl items-center justify-center mr-2.5">
                            <Text className="text-lg">{rep.avatar}</Text>
                          </View>
                          <View className="flex-1">
                            <View className="flex-row items-center flex-wrap gap-1">
                              <Text className="font-bold text-gray-800 text-sm" numberOfLines={1}>
                                {rep.author}
                              </Text>
                              <View className="px-1.5 py-0.5 rounded bg-gray-100">
                                <Text className="text-[8px] text-gray-500 font-extrabold uppercase tracking-wide">
                                  {rep.badge}
                                </Text>
                              </View>
                            </View>
                            <Text className="text-gray-400 text-[10px]">{rep.handle}</Text>
                          </View>
                        </View>
                        <Text className="text-gray-400 text-[10px]">{rep.createdAt}</Text>
                      </View>
                      <Text className="text-gray-700 text-sm leading-5 pl-1">{rep.content}</Text>
                    </View>
                  ))
                )}
              </ScrollView>

              {/* Bottom Reply Input bar */}
              <View className="p-4 bg-white border-t border-gray-200 flex-row items-center gap-3">
                <TextInput
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800"
                  placeholder={`Reply to ${activePost.author}...`}
                  placeholderTextColor="#9ca3af"
                  value={replyText}
                  onChangeText={setReplyText}
                />
                <Pressable
                  onPress={handleAddReply}
                  disabled={!replyText.trim()}
                  style={({ pressed }) => ({
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  })}
                  className={`w-11 h-11 rounded-2xl items-center justify-center ${
                    replyText.trim() ? "bg-green-700" : "bg-gray-100"
                  }`}
                >
                  <Ionicons
                    name="send"
                    size={16}
                    color={replyText.trim() ? "white" : "#9ca3af"}
                  />
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
