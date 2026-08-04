import React, { useState, useCallback } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  View,
  Pressable,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useUserStore } from "../../store/useUserStore";
import { useCommunityStore } from "../../store/useCommunityStore";
import { communityService } from "../../services/community";
import { COMMUNITY_CATEGORIES, Post, Reply } from "@/data/community";

const CATEGORIES = COMMUNITY_CATEGORIES;

// Turns a backend ISO timestamp into "Just now / 5m ago / 2h ago / 3d ago".
// If the value is already a label (e.g. an optimistic "Just now"), returns it as-is.
function timeAgo(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
}

export default function CommunityScreen() {
  const colors = useThemeColors();
  const userName = useUserStore((s) => s.name);
  const userAvatar = useUserStore((s) => s.avatar);
  const userScore = useUserStore((s) => s.score);

  const posts = useCommunityStore((s) => s.posts);
  const addPost = useCommunityStore((s) => s.addPost);
  const likePost = useCommunityStore((s) => s.likePost);
  const addReply = useCommunityStore((s) => s.addReply);
  const setPosts = useCommunityStore((s) => s.setPosts);

  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load the forum from the backend whenever this tab is focused.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      communityService
        .getPosts()
        .then((res) => {
          if (active) setPosts(res.data);
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }, [setPosts])
  );

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

  const handleLike = async (postId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    // Optimistic toggle for instant feedback.
    likePost(postId, post.likedByUser);
    if (activePost && activePost.id === postId) {
      const liked = !activePost.likedByUser;
      setActivePost({
        ...activePost,
        likedByUser: liked,
        likes: liked ? activePost.likes + 1 : activePost.likes - 1,
      });
    }

    // Sync with the backend (source of truth for the like count).
    try {
      const res = await communityService.toggleLike(postId);
      const updated = res.data;
      const store = useCommunityStore.getState();
      store.setPosts(store.posts.map((p) => (p.id === updated.id ? updated : p)));
      setActivePost((prev) => (prev && prev.id === updated.id ? updated : prev));
    } catch {
      // Offline — keep the optimistic state.
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;

    const content = newPostContent.trim();
    const category = newPostCategory;
    setNewPostContent("");
    setCreateModalVisible(false);

    try {
      // The backend fills in author/handle/avatar/badge from the logged-in user.
      const res = await communityService.createPost({ category, content });
      addPost(res.data);
    } catch {
      // Offline fallback — show the post locally.
      addPost({
        id: `post-${Date.now()}`,
        author: userName,
        handle: getUserHandle(),
        avatar: userAvatar || "🦉",
        badge: getUserBadge(),
        category,
        content,
        likes: 0,
        likedByUser: false,
        createdAt: "Just now",
        replies: [],
      });
    }
  };

  const handleAddReply = async () => {
    if (!replyText.trim() || !activePost) return;

    const postId = activePost.id;
    const content = replyText.trim();
    setReplyText("");

    try {
      const res = await communityService.addReply(postId, content);
      const updated = res.data;
      const store = useCommunityStore.getState();
      store.setPosts(store.posts.map((p) => (p.id === updated.id ? updated : p)));
      setActivePost((prev) => (prev && prev.id === updated.id ? updated : prev));
    } catch {
      // Offline fallback — append the reply locally.
      const newReply: Reply = {
        id: `rep-${Date.now()}`,
        author: userName,
        handle: getUserHandle(),
        avatar: userAvatar || "🦉",
        badge: getUserBadge(),
        content,
        createdAt: "Just now",
      };
      addReply(postId, newReply);
      setActivePost((prev) =>
        prev && prev.id === postId ? { ...prev, replies: [...prev.replies, newReply] } : prev
      );
    }
  };

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "Savings":
        return "bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20";
      case "Budgeting":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Investing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Debt Free":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-brand-slateBg text-brand-textPrimary border-brand-border";
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">
      {/* Header Panel */}
      <View className="bg-brand-bg pt-4 pb-5 px-6 border-b border-brand-border">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-3xl font-inter-bold text-brand-textPrimary">Community Hub</Text>
            <Text className="text-brand-gray text-xs mt-1">
              {"Connect & grow with fellow financial builders"}
            </Text>
          </View>
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
                  ? "bg-brand-emerald border-brand-emerald"
                  : "bg-brand-bg border-brand-border active:bg-brand-slateBg"
              }`}
            >
              <Text
                className={`text-xs font-inter-bold ${
                  selectedCategory === cat ? "text-brand-textOnDark" : "text-brand-textPrimary"
                }`}
              >
                {cat === "All" ? cat : `#${cat}`}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Main Post Feed */}
      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-16 px-6">
            <View className="w-20 h-20 bg-brand-emerald/10 rounded-3xl items-center justify-center mb-5">
              <Ionicons name="chatbubbles-outline" size={38} color={colors.emerald} />
            </View>
            <Text className="text-brand-textPrimary text-lg font-inter-bold text-center">
              {selectedCategory === "All"
                ? "No discussions yet"
                : `Nothing in #${selectedCategory} yet`}
            </Text>
            <Text className="text-brand-gray text-sm mt-2 text-center leading-5 px-4">
              Start the conversation — ask a question, share a win, or drop a money tip for fellow learners.
            </Text>
            <Pressable
              onPress={() => setCreateModalVisible(true)}
              style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}
              className="flex-row items-center bg-brand-emerald mt-6 px-5 py-3 rounded-2xl shadow-sm"
            >
              <Ionicons name="create-outline" size={18} color="white" />
              <Text className="text-brand-textOnDark font-inter-bold text-sm ml-2">Start a discussion</Text>
            </Pressable>
          </View>
        }
        renderItem={({ item: post }) => (
          <View className="bg-brand-bg border border-brand-border rounded-3xl p-5 mb-4 shadow-sm shadow-slate-200/40">
            {/* Tapping the header/content opens the thread */}
            <Pressable
              onPress={() => {
                setActivePost(post);
                setReplyModalVisible(true);
              }}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              {/* Post Header */}
              <View className="flex-row justify-between items-start">
                <View className="flex-row items-center flex-1 mr-2">
                  <View className="w-10 h-10 bg-brand-slateBg rounded-xl items-center justify-center mr-3 overflow-hidden border border-brand-border">
                    {isImageUri(post.avatar) ? (
                      <Image source={{ uri: post.avatar }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                      <Text className="text-2xl">{post.avatar}</Text>
                    )}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center flex-wrap gap-1.5">
                      <Text className="font-inter-bold text-brand-textPrimary text-[15px]" numberOfLines={1}>
                        {post.author}
                      </Text>
                      <View className="px-2 py-0.5 rounded-full bg-brand-emerald/10 border border-brand-emerald/20">
                        <Text className="text-[9px] text-brand-emerald font-inter-bold uppercase tracking-wider">
                          {post.badge}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-brand-gray text-[11px] mt-0.5 font-inter-medium">
                      {post.handle} • {timeAgo(post.createdAt)}
                    </Text>
                  </View>
                </View>

                {/* Category tag */}
                <View className={`px-2.5 py-1 rounded-lg border ${getCategoryBadgeColor(post.category)}`}>
                  <Text className="text-[9px] font-inter-bold uppercase tracking-wider">
                    {post.category}
                  </Text>
                </View>
              </View>

              {/* Post Content */}
              <Text className="text-brand-textPrimary text-[15px] mt-4 leading-[22px] font-inter">
                {post.content}
              </Text>
            </Pressable>

            {/* Feed Actions */}
            <View className="flex-row items-center mt-4 pt-3.5 border-t border-brand-border gap-2">
              <Pressable
                onPress={() => handleLike(post.id)}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                className={`flex-row items-center px-3 py-1.5 rounded-full ${
                  post.likedByUser ? "bg-red-50" : "bg-brand-slateBg"
                }`}
              >
                <Ionicons
                  name={post.likedByUser ? "heart" : "heart-outline"}
                  size={17}
                  color={post.likedByUser ? colors.danger : colors.gray}
                />
                <Text
                  className={`text-xs font-inter-bold ml-1.5 ${
                    post.likedByUser ? "text-red-500" : "text-brand-gray"
                  }`}
                >
                  {post.likes}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setActivePost(post);
                  setReplyModalVisible(true);
                }}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                className="flex-row items-center px-3 py-1.5 rounded-full bg-brand-slateBg"
              >
                <Ionicons name="chatbubble-outline" size={16} color={colors.gray} />
                <Text className="text-xs font-inter-bold text-brand-gray ml-1.5">
                  {post.replies.length} {post.replies.length === 1 ? "reply" : "replies"}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Floating Add Post Button on the right corner */}
      <Pressable
        onPress={() => setCreateModalVisible(true)}
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.95 : 1 }],
          position: "absolute",
          bottom: 24,
          right: 24,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
          zIndex: 50,
        })}
        className="bg-brand-emerald w-14 h-14 rounded-full items-center justify-center"
      >
        <Ionicons name="create-outline" size={28} color="white" />
      </Pressable>

      {/* ── NEW POST MODAL ── */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <SafeAreaView edges={["top"]} className="flex-1 bg-brand-bg">
          {/* Modal Header */}
          <View className="px-5 pt-6 pb-4 border-b border-brand-border flex-row justify-between items-center bg-brand-bg">
            <Pressable
              onPress={() => setCreateModalVisible(false)}
              className="w-10 h-10 bg-brand-slateBg rounded-full items-center justify-center"
            >
              <Ionicons name="close" size={22} color={colors.navy} />
            </Pressable>
            <Text className="text-lg font-inter-bold text-brand-textPrimary">Ask the Community</Text>
            <Pressable
              onPress={handleCreatePost}
              disabled={!newPostContent.trim()}
              className={`px-4 py-2 rounded-full ${
                newPostContent.trim() ? "bg-brand-emerald" : "bg-brand-slateBg"
              }`}
            >
              <Text
                className={`text-xs font-inter-bold uppercase tracking-wider ${
                  newPostContent.trim() ? "text-brand-textOnDark" : "text-brand-gray"
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
                <View className="w-10 h-10 bg-brand-bg rounded-xl items-center justify-center mr-3 overflow-hidden">
                  {isImageUri(userAvatar) ? (
                    <Image source={{ uri: userAvatar || "" }} className="w-full h-full" resizeMode="cover" />
                  ) : (
                    <Text className="text-2xl">{userAvatar || "🦉"}</Text>
                  )}
                </View>
                <View>
                  <Text className="font-inter-bold text-brand-textPrimary text-sm">
                    {`Posting as ${userName}`}
                  </Text>
                  <Text className="text-brand-gray text-xs">{getUserHandle()}</Text>
                </View>
              </View>

              {/* Tag selector */}
              <Text className="text-brand-gray text-xs font-inter-bold uppercase tracking-wider mb-2">
                Select Category Topic
              </Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {CATEGORIES.slice(1).map((cat) => (
                  <Pressable
                    key={cat}
                    onPress={() => setNewPostCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl border ${
                      newPostCategory === cat
                        ? "bg-brand-emerald/10 border-brand-emerald text-brand-emerald"
                        : "bg-brand-slateBg border-brand-border"
                    }`}
                  >
                    <Text
                      className={`text-xs font-inter-bold ${
                        newPostCategory === cat ? "text-brand-emerald" : "text-brand-gray"
                      }`}
                    >
                      {`# ${cat}`}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Text Input */}
              <TextInput
                textAlignVertical="top"
                className="bg-brand-slateBg rounded-2xl p-4 text-base font-inter-semibold text-brand-textPrimary border border-brand-border min-h-[160]"
                multiline
                placeholder="What is on your mind? Ask a question, share a victory, or give a tip..."
                placeholderTextColor={colors.gray}
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
        <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">
          {/* Header */}
          <View className="px-5 pt-6 pb-4 border-b border-brand-border flex-row items-center bg-brand-bg justify-between">
            <Pressable
              onPress={() => {
                setReplyModalVisible(false);
                setActivePost(null);
              }}
              className="w-10 h-10 bg-brand-slateBg rounded-full items-center justify-center mr-3"
            >
              <Ionicons name="arrow-back" size={22} color={colors.navy} />
            </Pressable>
            <Text className="text-lg font-inter-bold text-brand-textPrimary">Thread Details</Text>
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
                <View className="bg-brand-bg border border-brand-border rounded-3xl p-5 mb-6 shadow-sm">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-row items-center mr-2 flex-1">
                      <View className="w-12 h-12 bg-brand-slateBg rounded-2xl items-center justify-center mr-3 overflow-hidden border border-brand-border">
                        {isImageUri(activePost.avatar) ? (
                          <Image source={{ uri: activePost.avatar }} className="w-full h-full" resizeMode="cover" />
                        ) : (
                          <Text className="text-2xl">{activePost.avatar}</Text>
                        )}
                      </View>
                      <View className="flex-1">
                        <View className="flex-row items-center flex-wrap gap-1">
                          <Text className="font-inter-bold text-brand-textPrimary text-base" numberOfLines={1}>
                            {activePost.author}
                          </Text>
                          <View className="px-2 py-0.5 rounded-full bg-brand-slateBg border border-brand-border">
                            <Text className="text-[10px] text-brand-gray font-inter-bold uppercase tracking-wider">
                              {activePost.badge}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-brand-gray text-xs mt-0.5">
                          {activePost.handle} • {timeAgo(activePost.createdAt)}
                        </Text>
                      </View>
                    </View>
                    <View className={`px-2.5 py-1 rounded-xl border ${getCategoryBadgeColor(activePost.category)}`}>
                      <Text className="text-[10px] font-inter-bold uppercase tracking-wider">
                        {activePost.category}
                      </Text>
                    </View>
                  </View>

                  <Text className="text-brand-textPrimary text-base mt-4 leading-6 font-inter-semibold">
                    {activePost.content}
                  </Text>

                  <View className="flex-row items-center mt-5 pt-4 border-t border-brand-border gap-6">
                    <Pressable
                      onPress={() => handleLike(activePost.id)}
                      className="flex-row items-center"
                    >
                      <Ionicons
                        name={activePost.likedByUser ? "heart" : "heart-outline"}
                        size={20}
                        color={activePost.likedByUser ? colors.danger : colors.gray}
                      />
                      <Text
                        className={`text-sm font-inter-bold ml-2 ${
                          activePost.likedByUser ? "text-red-500" : "text-brand-gray"
                        }`}
                      >
                        {activePost.likes}
                      </Text>
                    </Pressable>
                    <View className="flex-row items-center">
                      <Ionicons name="chatbubble-outline" size={19} color={colors.gray} />
                      <Text className="text-sm font-inter-bold text-brand-gray ml-2">
                        {activePost.replies.length} replies
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Section title */}
                <Text className="text-brand-gray text-xs font-inter-bold uppercase tracking-wider mb-4 ml-1">
                  {`Replies (${activePost.replies.length})`}
                </Text>

                {/* Reply cards */}
                {activePost.replies.length === 0 ? (
                  <View className="items-center py-10">
                    <View className="w-14 h-14 bg-brand-slateBg rounded-2xl items-center justify-center mb-3">
                      <Ionicons name="chatbubble-ellipses-outline" size={26} color={colors.gray} />
                    </View>
                    <Text className="text-brand-textPrimary text-sm font-inter-bold">No replies yet</Text>
                    <Text className="text-brand-gray text-xs mt-1 font-inter">Be the first to answer this question.</Text>
                  </View>
                ) : (
                  activePost.replies.map((rep) => (
                    <View
                      key={rep.id}
                      className="bg-brand-bg border border-brand-border rounded-2xl p-4 mb-3 shadow-sm shadow-slate-200/40"
                    >
                      <View className="flex-row items-center mb-2.5 justify-between">
                        <View className="flex-row items-center flex-1 mr-2">
                          <View className="w-9 h-9 bg-brand-emerald/5 border border-brand-emerald/20 rounded-xl items-center justify-center mr-2.5">
                            <Text className="text-lg">{rep.avatar}</Text>
                          </View>
                          <View className="flex-1">
                            <View className="flex-row items-center flex-wrap gap-1.5">
                              <Text className="font-inter-bold text-brand-textPrimary text-sm" numberOfLines={1}>
                                {rep.author}
                              </Text>
                              <View className="px-1.5 py-0.5 rounded-md bg-brand-emerald/10 border border-brand-emerald/20">
                                <Text className="text-[8px] text-brand-emerald font-inter-bold uppercase tracking-wide">
                                  {rep.badge}
                                </Text>
                              </View>
                            </View>
                            <Text className="text-brand-gray text-[10px] font-inter-medium">{rep.handle}</Text>
                          </View>
                        </View>
                        <Text className="text-brand-gray text-[10px]">{timeAgo(rep.createdAt)}</Text>
                      </View>
                      <Text className="text-brand-textPrimary text-sm leading-[20px] font-inter mt-0.5">{rep.content}</Text>
                    </View>
                  ))
                )}
              </ScrollView>

              {/* Bottom Reply Input bar */}
              <View className="p-4 bg-brand-bg border-t border-brand-border flex-row items-center gap-3">
                <TextInput
                  className="flex-1 bg-brand-slateBg border border-brand-border rounded-2xl px-4 py-3 text-sm font-inter-semibold text-brand-textPrimary"
                  placeholder={`Reply to ${activePost.author}...`}
                  placeholderTextColor={colors.gray}
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
                    replyText.trim() ? "bg-brand-emerald" : "bg-brand-slateBg"
                  }`}
                >
                  <Ionicons
                    name="send"
                    size={16}
                    color={replyText.trim() ? "white" : colors.gray}
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
