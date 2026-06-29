import { router, useLocalSearchParams } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../../store/useUserStore";
import { AVATAR_OPTIONS } from "@/data/avatars";
import { RECOMMENDED_LESSONS } from "@/data/lessons";
import { DAILY_QUIZ } from "@/data/quizzes";


export default function HomeScreen() {
  const params = useLocalSearchParams();

  // Synced User States
  const userName = useUserStore((s) => s.name);
  const score = useUserStore((s) => s.score);
  const avatar = useUserStore((s) => s.avatar);
  const savings = useUserStore((s) => s.savings);
  const targetGoal = useUserStore((s) => s.targetGoal);
  const xp = useUserStore((s) => s.xp);
  const lessonsCompleted = useUserStore((s) => s.lessonsCompleted);
  const hasDoneDailyQuiz = useUserStore((s) => s.hasDoneDailyQuiz);
  const userGoal = useUserStore((s) => s.goal);

  // Modals Visibility
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [savingsModalOpen, setSavingsModalOpen] = useState(false);

  // Form Inputs
  const [savingsInput, setSavingsInput] = useState("");
  const [savingsError, setSavingsError] = useState("");

  // Quiz States
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<"correct" | "incorrect" | null>(null);

  useEffect(() => {
    const store = useUserStore.getState();
    if (params.score) {
      store.setScore(parseInt(params.score as string, 10));
    }
    if (params.goal) {
      store.setGoal(params.goal as string);
    }
  }, [params.score, params.goal]);

  const progressPercentage = Math.min((savings / targetGoal) * 100, 100);
  const amountLeft = Math.max(0, targetGoal - savings);

  const handleAvatarSelect = (char: string) => {
    useUserStore.getState().setAvatar(char);
    setAvatarModalOpen(false);
  };

  const handleLogSavings = (amount: number) => {
    useUserStore.getState().addSavings(amount);
    setSavingsModalOpen(false);
    setSavingsInput("");
    setSavingsError("");
  };

  const handleCustomSavingsSubmit = () => {
    setSavingsError("");
    const parsed = parseFloat(savingsInput);
    if (isNaN(parsed) || parsed <= 0) {
      setSavingsError("Please enter a valid positive number.");
      return;
    }
    handleLogSavings(parsed);
  };

  // Quiz configuration
  const quizQuestion = DAILY_QUIZ.question;
  const quizOptions = DAILY_QUIZ.options;

  const handleQuizAnswer = (index: number, isCorrect: boolean) => {
    if (hasDoneDailyQuiz) return;
    setSelectedQuizIndex(index);
    if (isCorrect) {
      setQuizFeedback("correct");
      const store = useUserStore.getState();
      store.addXp(50);
      store.setHasDoneDailyQuiz(true);
    } else {
      setQuizFeedback("incorrect");
    }
  };

  let recommendedLesson = {
    tag: score >= 13 ? "Investing Pro" : score >= 8 ? "Savings Strategy" : "Budgeting Basics",
    title: score >= 13 ? "Stock Market Index Funds 101" : score >= 8 ? "Building an Emergency Fund" : "Intro to Budgeting: The 50/30/20 Rule",
    desc: score >= 13 ? "Understand diversification and how to compound index investments." : score >= 8 ? "How to build a financial security cushion and place it securely." : "Categorize your monthly earnings into Needs, Wants, and Savings.",
  };

  if (userGoal && RECOMMENDED_LESSONS[userGoal]) {
    recommendedLesson = RECOMMENDED_LESSONS[userGoal];
  }

  return (
    <ScrollView 
      className="flex-1 bg-[#f8fafc]" 
      contentContainerStyle={{ paddingBottom: 50 }} 
      showsVerticalScrollIndicator={false}
    >
      {/* ── PREMIUM HEADER BLOCK ── */}
      <View className="bg-green-800 pt-16 pb-10 px-6 rounded-b-[40px] shadow-lg shadow-green-900/10">
        <View className="flex-row justify-between items-center">
          <View className="flex-1 pr-4">
            <Text className="text-green-200 text-xs font-black uppercase tracking-widest">Dashboard Panel</Text>
            <Text className="text-white text-3xl font-black mt-1 tracking-tight" numberOfLines={1}>
              Hi, {userName.split(" ")[0]}! 👋
            </Text>
          </View>
          
          {/* Avatar frame */}
          <Pressable
            onPress={() => setAvatarModalOpen(true)}
            className="w-16 h-16 bg-white/10 rounded-3xl items-center justify-center border-2 border-white/20 active:scale-95 transition-all duration-150"
          >
            <Text className="text-3xl">{avatar}</Text>
            <View className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full items-center justify-center border border-green-800">
              <Ionicons name="pencil" size={10} color="white" />
            </View>
          </Pressable>
        </View>

        {/* User Badges Row */}
        <View className="mt-6 flex-row flex-wrap items-center gap-2">
          <View className="px-3.5 py-1.5 rounded-2xl bg-white/15 border border-white/10 flex-row items-center">
            <Ionicons name="ribbon" size={13} color="#4ade80" />
            <Text className="text-white text-[10px] font-black uppercase tracking-wider ml-1.5">
              {score >= 13 ? "Wealth Builder Pro" : score >= 8 ? "Smart Manager" : "Novice Explorer"}
            </Text>
          </View>
          {userGoal && (
            <View className="px-3.5 py-1.5 rounded-2xl bg-white/15 border border-white/10 flex-row items-center">
              <Ionicons name="flag" size={13} color="#60a5fa" />
              <Text className="text-white text-[10px] font-black uppercase tracking-wider ml-1.5">
                Target: {userGoal}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Main Screen Content */}
      <View className="px-5 -mt-5">
        
        {/* ── SAVINGS PROGRESS CARD ── */}
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xl shadow-slate-100/40">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">SAVINGS PROGRESS</Text>
              <Text className="text-slate-900 text-3xl font-black mt-1">
                GH₵ {savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Text>
            </View>
            <View className="bg-teal-50 border border-teal-100 rounded-2xl px-3.5 py-2">
              <Text className="text-teal-800 font-extrabold text-xs">Goal: GH₵ {targetGoal}</Text>
            </View>
          </View>

          {/* Progress stats */}
          <View className="flex-row justify-between items-center mt-4">
            <Text className="text-slate-500 text-xs font-semibold">
              {progressPercentage >= 100 ? "🎉 Target achieved!" : `${Math.round(progressPercentage)}% completed`}
            </Text>
            {amountLeft > 0 && (
              <Text className="text-slate-500 text-xs font-semibold">
                To save: <Text className="font-bold text-teal-700">GH₵ {amountLeft}</Text>
              </Text>
            )}
          </View>

          {/* Bar track */}
          <View className="w-full h-3.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden border border-slate-100">
            <View
              style={{ width: `${progressPercentage}%` }}
              className="h-full bg-teal-600 rounded-full"
            />
          </View>

          {savings === 0 && (
            <Text className="text-slate-400 text-xs mt-3 leading-4 font-semibold italic text-center px-4">
              {"You haven't logged any savings yet! Click 'Log Savings' below whenever you tuck money away into your bank or mobile money vaults."}
            </Text>
          )}

          {/* Action buttons */}
          <View className="flex-row mt-5 border-t border-slate-50 pt-4 gap-3">
            <Pressable
              onPress={() => setSavingsModalOpen(true)}
              className="flex-1 bg-slate-900 active:bg-slate-800 py-3.5 rounded-2xl shadow-sm flex-row justify-center items-center active:scale-98 transition-all"
            >
              <Ionicons name="add-circle" size={18} color="white" />
              <Text className="text-white font-extrabold text-sm ml-2 uppercase tracking-wide">Log Savings</Text>
            </Pressable>
            
            <Pressable
              onPress={() => router.push("/assessment")}
              className="bg-slate-100 active:bg-slate-200 px-5 rounded-2xl justify-center items-center active:scale-98"
            >
              <Ionicons name="refresh" size={18} color="#475569" />
            </Pressable>
          </View>
        </View>

        {/* ── QUICK PROGRESS STATS ── */}
        <View className="flex-row mt-6 gap-3">
          <View className="flex-1 bg-white p-4 rounded-3xl border border-slate-100 shadow-md">
            <View className="flex-row justify-between items-center">
              <Text className="text-slate-400 text-[9px] uppercase font-black tracking-wider">Lessons Done</Text>
              <View className="w-6 h-6 bg-teal-50 rounded-lg items-center justify-center">
                <Ionicons name="book" size={12} color="#0d9488" />
              </View>
            </View>
            <Text className="text-slate-800 text-2xl font-black mt-2">{lessonsCompleted}</Text>
          </View>
          
          <View className="flex-1 bg-white p-4 rounded-3xl border border-slate-100 shadow-md">
            <View className="flex-row justify-between items-center">
              <Text className="text-slate-400 text-[9px] uppercase font-black tracking-wider">XP Score</Text>
              <View className="w-6 h-6 bg-amber-50 rounded-lg items-center justify-center">
                <Ionicons name="flash" size={12} color="#d97706" />
              </View>
            </View>
            <Text className="text-slate-800 text-2xl font-black mt-2">{xp} <Text className="text-xs text-amber-600 font-bold">XP</Text></Text>
          </View>
        </View>

        {/* ── DAILY QUIZ CHALLENGE ── */}
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xl shadow-slate-100/40 mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center">
              <View className="bg-purple-50 p-2 rounded-xl mr-2.5">
                <Ionicons name="game-controller" size={18} color="#7c3aed" />
              </View>
              <Text className="text-slate-900 font-black text-base">Quiz Challenge</Text>
            </View>
            <View className="bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <Text className="text-amber-800 font-bold text-[9px] uppercase tracking-wide">+50 XP</Text>
            </View>
          </View>

          <Text className="text-slate-700 text-sm font-semibold mb-3 leading-5">
            {quizQuestion}
          </Text>

          <View className="space-y-2">
            {quizOptions.map((opt, index) => {
              const isSelected = selectedQuizIndex === index;
              let btnClass = "border-slate-200 bg-slate-50/30";
              let textClass = "text-slate-700";
              let iconName: "ellipse-outline" | "checkmark-circle" | "close-circle" = "ellipse-outline";
              let iconColor = "#94a3b8";

              if (isSelected || (hasDoneDailyQuiz && opt.isCorrect)) {
                if (opt.isCorrect) {
                  btnClass = "bg-teal-50 border-teal-500";
                  textClass = "text-teal-900 font-bold";
                  iconName = "checkmark-circle";
                  iconColor = "#0d9488";
                } else {
                  btnClass = "bg-red-50 border-red-500";
                  textClass = "text-red-900 font-bold";
                  iconName = "close-circle";
                  iconColor = "#ef4444";
                }
              }

              return (
                <Pressable
                  key={index}
                  onPress={() => handleQuizAnswer(index, opt.isCorrect)}
                  disabled={hasDoneDailyQuiz}
                  className={`p-3.5 rounded-2xl border flex-row items-center mt-2 justify-between active:scale-99 ${btnClass}`}
                >
                  <Text className={`text-xs flex-1 pr-2 font-semibold ${textClass}`}>
                    {opt.text}
                  </Text>
                  <Ionicons name={iconName} size={18} color={iconColor} />
                </Pressable>
              );
            })}
          </View>

          {hasDoneDailyQuiz && (
            <View className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mt-4 flex-row items-start">
              <Ionicons name="checkmark-circle-outline" size={20} color="#0d9488" style={{ marginRight: 8, marginTop: 1 }} />
              <Text className="text-teal-950 font-bold text-xs flex-1 leading-5">
                Completed! You earned +50 XP. Next challenge will be available in 24 hours.
              </Text>
            </View>
          )}

          {quizFeedback === "incorrect" && !hasDoneDailyQuiz && (
            <View className="bg-red-50 border border-red-100 rounded-2xl p-4 mt-4 flex-row items-start">
              <Ionicons name="alert-circle-outline" size={20} color="#ef4444" style={{ marginRight: 8, marginTop: 1 }} />
              <Text className="text-red-950 text-xs font-bold flex-1 leading-5">
                That is not correct. Take a look at the module material to understand compounding.
              </Text>
            </View>
          )}
        </View>

        {/* ── RECOMMENDED LESSON ── */}
        <Text className="text-lg font-black text-slate-800 mt-8 mb-3.5">Curated For You</Text>
        <Pressable
          onPress={() => router.push("/(tabs)/learn")}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xl shadow-slate-100/40 flex-row items-center justify-between active:scale-[0.99]"
        >
          <View className="flex-1 pr-4">
            <View className="bg-teal-50 self-start px-2.5 py-1 rounded-xl border border-teal-100">
              <Text className="text-teal-800 text-[10px] font-black uppercase tracking-wider">
                {recommendedLesson.tag}
              </Text>
            </View>
            <Text className="text-lg font-black text-slate-800 mt-2.5">
              {recommendedLesson.title}
            </Text>
            <Text className="text-slate-500 text-xs mt-1.5 leading-5 font-semibold">
              {recommendedLesson.desc}
            </Text>
          </View>
          <View className="w-11 h-11 bg-slate-900 rounded-2xl items-center justify-center shadow-md">
            <Ionicons name="arrow-forward" size={20} color="white" />
          </View>
        </Pressable>

        {/* ── INTERACTIVE FINANCIAL TOOLS ── */}
        <Text className="text-lg font-black text-slate-800 mt-8 mb-3.5">Financial Engines</Text>
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.push("/simulations")}
            className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 shadow-md items-center justify-center active:scale-[0.98]"
          >
            <View className="w-12 h-12 bg-teal-50 rounded-2xl items-center justify-center mb-3">
              <Ionicons name="calculator" size={22} color="#0d9488" />
            </View>
            <Text className="text-sm font-extrabold text-slate-800">Simulators</Text>
            <Text className="text-[10px] text-slate-400 mt-1.5 text-center leading-4 font-semibold px-2">
              Assess MoMo fees, T-Bills, & loans
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/ai-tutor")}
            className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 shadow-md items-center justify-center active:scale-[0.98]"
          >
            <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-3">
              <Ionicons name="chatbubbles" size={22} color="#2563eb" />
            </View>
            <Text className="text-sm font-extrabold text-slate-800">AI Coach</Text>
            <Text className="text-[10px] text-slate-400 mt-1.5 text-center leading-4 font-semibold px-2">
              Solve local finance queries
            </Text>
          </Pressable>
        </View>

      </View>

      {/* ================= MODALS ================= */}

      {/* A. AVATAR CHOOSER MODAL */}
      <Modal visible={avatarModalOpen} transparent animationType="fade">
        <View className="flex-1 bg-slate-900/60 justify-center items-center px-6">
          <View className="bg-white w-full rounded-[32px] p-6 max-w-sm shadow-2xl border border-slate-100">
            <View className="flex-row justify-between items-center border-b border-slate-100 pb-4">
              <Text className="text-slate-800 text-lg font-black">Choose Character</Text>
              <Pressable onPress={() => setAvatarModalOpen(false)} className="p-1 active:opacity-75">
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <Text className="text-slate-500 text-xs my-4 text-center font-medium leading-4">
              {"Select a personal character to represent your financial dashboard avatar."}
            </Text>

            <View className="flex-row flex-wrap justify-center gap-3.5 mt-2">
              {AVATAR_OPTIONS.map((item, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => handleAvatarSelect(item.char)}
                  className="w-[72] h-[72] rounded-2xl bg-slate-50 active:bg-teal-50 border border-slate-100 items-center justify-center active:border-teal-500"
                >
                  <Text className="text-3xl">{item.char}</Text>
                  <Text className="text-[8px] text-slate-400 font-extrabold mt-1 uppercase tracking-wide">{item.name}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* B. LOG SAVINGS MODAL */}
      <Modal visible={savingsModalOpen} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1 bg-slate-900/60 justify-center items-center px-6"
        >
          <View className="bg-white w-full rounded-[32px] p-6 max-w-sm shadow-2xl border border-slate-100">
            <View className="flex-row justify-between items-center border-b border-slate-100 pb-4">
              <Text className="text-slate-800 text-lg font-black">Log Savings</Text>
              <Pressable onPress={() => {
                setSavingsModalOpen(false);
                setSavingsError("");
                setSavingsInput("");
              }} className="p-1 active:opacity-75">
                <Ionicons name="close" size={24} color="#6b7280" />
              </Pressable>
            </View>

            <Text className="text-slate-700 font-bold text-xs mt-5 mb-2">Quick Log Value:</Text>
            <View className="flex-row gap-2 justify-between">
              {[10, 50, 100, 200].map((val) => (
                <Pressable
                  key={val}
                  onPress={() => handleLogSavings(val)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 items-center active:bg-teal-50 active:border-teal-500"
                >
                  <Text className="text-teal-800 font-black text-xs">+GH₵ {val}</Text>
                </Pressable>
              ))}
            </View>

            <Text className="text-slate-700 font-bold text-xs mt-5 mb-2">Or enter custom amount (GH₵):</Text>
            <TextInput
              value={savingsInput}
              onChangeText={(t) => {
                setSavingsError("");
                setSavingsInput(t);
              }}
              placeholder="e.g. 150"
              keyboardType="decimal-pad"
              className="border border-slate-200 rounded-2xl p-4 text-base text-slate-800 bg-slate-50/50 focus:border-teal-600 font-semibold"
              autoFocus
            />

            {savingsError ? (
              <Text className="text-red-600 text-xs font-bold mt-2.5 pl-1">
                {savingsError}
              </Text>
            ) : null}

            <Pressable
              onPress={handleCustomSavingsSubmit}
              className="bg-slate-900 py-4 rounded-2xl mt-6 shadow-sm active:bg-slate-800 flex-row justify-center items-center"
            >
              <Text className="text-white text-center font-black text-sm uppercase tracking-wider">Add to Balance</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </ScrollView>
  );
}
