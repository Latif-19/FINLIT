import React, { useState, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Modal,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useUserStore } from "../../store/useUserStore";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import "@/types/navigation";
import { LESSON_MODULES } from "@/data/lessons";
import { MODULE_QUIZZES } from "@/data/quizzes";
import { progressService } from "../../services/progress";
import { gamificationService } from "../../services/gamification";

// A professional vector icon per lesson topic (replaces the emoji on each node).
const LESSON_ICONS: Record<number, React.ComponentProps<typeof Ionicons>["name"]> = {
  1: "wallet-outline",           // MoMo Budgeting & Saving
  2: "card-outline",             // Avoiding Digital Debt Traps
  3: "trending-up-outline",      // Treasury Bills & Mutual Funds
  4: "shield-checkmark-outline", // Pensions & Provident Funds
  5: "school-outline",           // Student Loans & Bursaries
  6: "briefcase-outline",        // Side Hustles & Business Finance
  7: "id-card-outline",          // Credit Scores & Digital Credit History
};

function lessonIcon(id: number): React.ComponentProps<typeof Ionicons>["name"] {
  return LESSON_ICONS[id] ?? "book-outline";
}

interface LessonModule {
  id: number;
  title: string;
  desc: string;
  duration: string;
  xp: string;
  xpVal: number;
  content: string[];
  audioUrl?: string;
  audioLocalPath?: any;
  images?: any[];
  emoji?: string;
}

const { width } = Dimensions.get("window");

export default function LearnScreen() {
  const colors = useThemeColors();
  const lessonsCompleted = useUserStore((s) => s.lessonsCompleted);
  const userXp = useUserStore((s) => s.xp);
  const streak = useUserStore((s) => s.streak);
  const userGoal = useUserStore((s) => s.goal);
  const completedLessonIds = useUserStore((s) => s.completedLessonIds);

  // Main UI States
  const [selectedModule, setSelectedModule] = useState<LessonModule | null>(null);
  
  // Interactive Session State
  const [sessionLesson, setSessionLesson] = useState<LessonModule | null>(null);
  const [sessionStep, setSessionStep] = useState<number>(0); // 0 to content.length + 1
  const [hearts, setHearts] = useState<number>(5);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  // The user's first answer per question, submitted to the backend at the end.
  const [quizAnswers, setQuizAnswers] = useState<{ questionIndex: number; selectedOptionIndex: number }[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Node triggers
  const handleNodePress = (mod: LessonModule, isUnlocked: boolean) => {
    if (!isUnlocked) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(
        "Module Locked 🔒",
        "Complete the previous modules to unlock this learning session."
      );
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedModule(mod);
  };

  const sessionStartRef = useRef<number | null>(null);

  // Starts the interactive slide-by-slide session
  const startSession = (lesson: LessonModule) => {
    sessionStartRef.current = Date.now();
    setSelectedModule(null);
    setSessionLesson(lesson);
    setSessionStep(0);
    setHearts(5);
    setCurrentQuestionIndex(0);
    setQuizAnswers([]);
    setSelectedOptionIndex(null);
    setIsAnswerChecked(false);
    setIsAnswerCorrect(null);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Quitting active session
  const confirmQuitSession = () => {
    Alert.alert(
      "Quit Lesson? 🦉",
      "You will lose your progress in this learning session.",
      [
        { text: "Keep Learning", style: "cancel" },
        { 
          text: "Quit", 
          style: "destructive", 
          onPress: async () => {
            Speech.stop();
            if (sound) {
              await sound.stopAsync();
              await sound.unloadAsync();
              setSound(null);
            }
            setIsSpeaking(false);
            setIsPlaying(false);
            setSessionLesson(null);
          } 
        }
      ]
    );
  };

  // Handle continuing inside session
  const handleSessionContinue = async () => {
    if (!sessionLesson) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Stop any playing audio/TTS when advancing
    Speech.stop();
    setIsSpeaking(false);
    if (sound) {
      await sound.stopAsync();
      setIsPlaying(false);
    }

    const isSlidesStage = sessionStep < sessionLesson.content.length;
    const isQuizStage = sessionStep === sessionLesson.content.length;

    if (isSlidesStage) {
      setSessionStep((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setIsAnswerChecked(false);
      setIsAnswerCorrect(null);
    } else if (isQuizStage) {
      if (isAnswerChecked) {
        if (isAnswerCorrect) {
          const quizList = MODULE_QUIZZES[sessionLesson.id];
          if (quizList && currentQuestionIndex < quizList.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
            setSelectedOptionIndex(null);
            setIsAnswerChecked(false);
            setIsAnswerCorrect(null);
          } else {
            setSessionStep((prev) => prev + 1);
          }
        } else {
          setSelectedOptionIndex(null);
          setIsAnswerChecked(false);
          setIsAnswerCorrect(null);
        }
      }
    } else {
      // Lesson finished. Persist to the backend, then re-sync the store from the
      // backend's truth so XP / lessons / badges are authoritative.
      const lessonId = sessionLesson.id;
      const xpVal = sessionLesson.xpVal;
      const answers = quizAnswers;
      const timeSpentSeconds = sessionStartRef.current
        ? Math.round((Date.now() - sessionStartRef.current) / 1000)
        : undefined;
      sessionStartRef.current = null;

      Speech.stop();
      setIsSpeaking(false);
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
        setSound(null);
      }
      setIsPlaying(false);
      setSessionLesson(null);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const store = useUserStore.getState();
      try {
        await progressService.completeLesson(lessonId, timeSpentSeconds);
        if (answers.length > 0) {
          await gamificationService.submitQuizScore({ moduleId: lessonId, answers });
        }
        const res = await progressService.getProgress();
        store.applyProgress(res.data);
      } catch {
        // Offline / server down — keep the user progressing locally. Mirror the
        // backend's semantics: XP/count only on first completion, the specific
        // lesson id tracked so the map unlocks, and the quiz score as the
        // count of correct answers (not the hearts remaining).
        const quizList = MODULE_QUIZZES[lessonId];
        let quizScore: number | null = null;
        if (quizList && answers.length > 0) {
          quizScore = answers.filter(
            (a) =>
              quizList[a.questionIndex]?.options[a.selectedOptionIndex]?.isCorrect
          ).length;
        }
        store.completeLessonOffline(lessonId, xpVal, quizScore);
      }
    }
  };

  // Checking quiz answer
  const handleCheckQuizAnswer = () => {
    if (!sessionLesson || selectedOptionIndex === null) return;
    const quizList = MODULE_QUIZZES[sessionLesson.id];
    if (!quizList) return;
    const currentQuestion = quizList[currentQuestionIndex];
    if (!currentQuestion) return;

    const selectedOption = currentQuestion.options[selectedOptionIndex];
    const isCorrect = selectedOption.isCorrect;

    setIsAnswerCorrect(isCorrect);
    setIsAnswerChecked(true);

    // Record the FIRST answer for this question so the backend can score the quiz.
    setQuizAnswers((prev) =>
      prev.some((a) => a.questionIndex === currentQuestionIndex)
        ? prev
        : [...prev, { questionIndex: currentQuestionIndex, selectedOptionIndex }]
    );

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setHearts((h) => {
        const nextHearts = Math.max(0, h - 1);
        if (nextHearts === 0) {
          // Trigger a slight delay before showing no hearts screen or manage it
        }
        return nextHearts;
      });
    }
  };

  // Handle refill hearts
  const handleRefillHearts = () => {
    const store = useUserStore.getState();
    if (store.xp >= 50) {
      store.addXp(-50);
      setHearts(5);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Hearts Restored! ❤️", "50 XP spent. You now have 5 hearts.");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Not Enough XP ⚡", "You need at least 50 XP to buy a refill.");
    }
  };

  // Toggle speech / audio for current slide
  const toggleSpeech = async () => {
    if (!sessionLesson) return;

    // If lesson has a local audio file, play it with expo-av
    if (sessionLesson.audioLocalPath) {
      if (sound && isPlaying) {
        await sound.stopAsync();
        setIsPlaying(false);
        return;
      }

      try {
        if (sound) {
          await sound.setPositionAsync(0);
          await sound.playAsync();
          setIsPlaying(true);
        } else {
          const { sound: newSound } = await Audio.Sound.createAsync(
            sessionLesson.audioLocalPath,
            { shouldPlay: true },
            (status) => {
              if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
                setIsPlaying(false);
              }
            }
          );
          setSound(newSound);
          setIsPlaying(true);
        }
      } catch {
        Alert.alert("Audio Error", "Could not play the audio file.");
      }
      return;
    }

    // Fallback to expo-speech TTS
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
    } else {
      const text = sessionLesson.content[sessionStep] || "";
      Speech.speak(text, {
        language: "en-US",
        rate: 0.9,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
      });
      setIsSpeaking(true);
    }
  };

  const handleTrophyPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/certificate");
  };

  // Mascot Tip Text
  const mascotTips = [
    "🦉: Track your daily wallet fees. MTN MoMo Cash-out fees compound quickly over a year!",
    "🦉: High-interest mobile quick-loans like Qwikloan have APRs exceeding 82%. Avoid them!",
    "🦉: Ghana Treasury Bills pay out by discount - you buy under face value and receive full amount at maturity.",
    "🦉: Tier 3 pensions are voluntary, tax-free, and let you withdraw early in emergencies.",
    "🦉: Student loans (SLTF) are now guarantor-free with a Ghana Card. Use them strictly for educational expenses!",
    "🦉: Keep side hustle funds separate from daily money. Separating accounts is key to campus business success!",
    "🦉: A single late Fido or Qwikloan repayment can quietly shrink your future borrowing limit. Digital lenders are watching your MoMo activity!",
  ];
  const activeTip = mascotTips[lessonsCompleted % mascotTips.length] || mascotTips[0];

  const GOAL_LESSON: Record<string, { id: number; title: string; emoji: string }> = {
    "Build an Emergency Fund": { id: 1, title: "MoMo Budgeting", emoji: "📱" },
    "Improve Budgeting":       { id: 1, title: "MoMo Budgeting", emoji: "📱" },
    "Learn Investing":         { id: 3, title: "Treasury Bills", emoji: "📈" },
    "Become Debt Free":        { id: 2, title: "Digital Loans", emoji: "⚠️" },
    "Start a Business":        { id: 6, title: "Side Hustles & Business Finance", emoji: "💼" },
    "Save for Education":      { id: 5, title: "Student Loans & Bursaries", emoji: "🎓" },
  };
  const recommendedLesson = userGoal ? GOAL_LESSON[userGoal] : null;

  // Goal-relevant lesson first, same six lessons otherwise — nothing hidden,
  // just resequenced. LESSON_MODULES itself is left untouched since
  // data/recommendations.ts indexes it in its original order.
  const orderedModules: LessonModule[] = recommendedLesson
    ? [
        ...LESSON_MODULES.filter((m) => m.id === recommendedLesson.id),
        ...LESSON_MODULES.filter((m) => m.id !== recommendedLesson.id),
      ]
    : LESSON_MODULES;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">
      {/* DUOLINGO STYLE HEADER STATS */}
      <View className="flex-row justify-between items-center bg-brand-bg px-5 pt-3.5 pb-3.5 border-b-2 border-brand-border">
        <View className="flex-1">
          <Text className="text-[10px] font-inter-bold text-brand-gray tracking-widest">
            UNIT {Math.floor(lessonsCompleted / 4) + 1}
          </Text>
          <Text className="text-[15px] font-inter-bold text-brand-dark">
            Ghana Personal Finance
          </Text>
        </View>
        <View className="flex-row gap-3">
          <View className="flex-row items-center bg-brand-slateBg px-2 py-1 rounded-xl gap-[3px]">
            <Text className="text-[13px]">🔥</Text>
            <Text className="text-xs font-inter-bold text-brand-gray">{streak}</Text>
          </View>
          <View className="flex-row items-center bg-brand-slateBg px-2 py-1 rounded-xl gap-[3px]">
            <Text className="text-[13px]">⚡</Text>
            <Text className="text-xs font-inter-bold text-brand-gray">{userXp}</Text>
          </View>
          <View className="flex-row items-center bg-brand-slateBg px-2 py-1 rounded-xl gap-[3px]">
            <Text className="text-[13px]">❤️</Text>
            <Text className="text-xs font-inter-bold text-red-500">{hearts}</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Personalized Path Banner — shown only after assessment is done, and
            hidden once that lesson is actually completed */}
        {userGoal && recommendedLesson && !completedLessonIds.includes(recommendedLesson.id) && (
          <View className="bg-brand-emerald/5 border border-brand-emerald/20 rounded-2xl p-4 mb-5 flex-row items-center gap-3">
            <View className="w-10 h-10 bg-brand-emerald/10 rounded-xl items-center justify-center">
              <Ionicons name={lessonIcon(recommendedLesson.id)} size={20} color={colors.emerald} />
            </View>
            <View className="flex-1">
              <Text className="text-[9px] font-inter-bold text-brand-emerald tracking-widest uppercase">
                Your Personalized Path
              </Text>
              <Text className="text-sm font-inter-bold text-brand-navy mt-0.5">
                Goal: {userGoal}
              </Text>
              <Text className="text-xs text-brand-dark mt-0.5">
                Start with Lesson {recommendedLesson.id}: {recommendedLesson.title}
              </Text>
            </View>
          </View>
        )}

        {/* Certificate Progress Card */}
        <View className="bg-brand-bg rounded-2xl p-4 border-2 border-brand-border shadow-sm mb-5">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center bg-[#16A34A12] px-2 py-1 rounded-md gap-[3px]">
              <Ionicons name="ribbon-outline" size={15} color={colors.emerald} />
              <Text className="text-[9px] font-inter-bold text-green-600">
                ACCREDITED PATHWAY
              </Text>
            </View>
            <Text className="text-[11px] font-inter-semibold text-brand-gray">
              {lessonsCompleted}/{LESSON_MODULES.length} Completed
            </Text>
          </View>
          <Text className="text-base font-inter-bold text-brand-dark mt-2.5">
            Financial Literacy Certificate
          </Text>
          <Text className="text-xs text-brand-gray mt-1 leading-4">
            Walk down the learning path and complete all {LESSON_MODULES.length} lessons to earn
            your official FinLit certificate.
          </Text>

          {/* Progress bar */}
          <View className="h-2 bg-brand-slateBg rounded mt-3 overflow-hidden">
            <View
              className="h-full bg-brand-emerald rounded"
              style={{
                width: `${Math.min(100, (lessonsCompleted / LESSON_MODULES.length) * 100)}%`,
              }}
            />
          </View>
        </View>

        {/* THE DUOLINGO WINDING PATH */}
        <View className="items-center relative my-6 w-full">
          {/* Vertical connecting line */}
          <View className="absolute top-[30px] bottom-[30px] left-1/2 w-1.5 bg-brand-slateBg -translate-x-[3px] z-[-1]" />

          {orderedModules.map((mod, index) => {
            const isCompleted = completedLessonIds.includes(mod.id);
            // Unlocked once every lesson before it IN THE DISPLAYED ORDER is
            // done — not a raw completed-count check, since the goal-priority
            // lesson may now sit at a different position than its id implies.
            const isUnlocked =
              index === 0 ||
              orderedModules.slice(0, index).every((m) => completedLessonIds.includes(m.id));
            const isCurrent = isUnlocked && !isCompleted;

            let layoutClass = "justify-center";
            if (index % 2 === 0) {
              layoutClass = "justify-center -translate-x-[35px]";
            } else {
              layoutClass = "justify-center translate-x-[35px]";
            }

            const isBig = index % 2 === 0;
            const nodeIconColor = isCompleted ? "#ffffff" : isCurrent ? colors.navy : "#64748b";

            return (
              <View
                key={mod.id}
                className={`flex-row items-center my-[18px] w-full px-3 ${layoutClass}`}
              >
                {isCurrent && (
                  <View
                    className={`absolute border-[3px] border-yellow-400 opacity-60 ${
                      isBig
                        ? "w-[96px] h-[96px] rounded-[48px]"
                        : "w-[78px] h-[78px] rounded-[39px]"
                    }`}
                  />
                )}

                <Pressable
                  onPress={() => handleNodePress(mod, isUnlocked)}
                  style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.95 : 1 }] })}
                  className={`w-[76px] h-[76px] rounded-[38px] justify-center items-center shadow-md ${
                    isBig ? "w-[84px] h-[84px] rounded-[42px]" : "w-[66px] h-[66px] rounded-[33px]"
                  } ${
                    isCompleted
                      ? "bg-green-500 border-b-[6px] border-b-green-700"
                      : isCurrent
                      ? "bg-yellow-400 border-b-[6px] border-b-orange-500"
                      : !isUnlocked
                      ? "bg-slate-300 border-b-[6px] border-b-slate-400"
                      : ""
                  }`}
                >
                  <Ionicons
                    name={lessonIcon(mod.id)}
                    size={isBig ? 36 : 28}
                    color={nodeIconColor}
                    style={!isUnlocked ? { opacity: 0.6 } : undefined}
                  />
                  {!isUnlocked && (
                    <View className="absolute -bottom-[2px] -right-[2px] bg-slate-500 w-6 h-6 rounded-full justify-center items-center border-2 border-white shadow-sm">
                      <Ionicons name="lock-closed" size={12} color="white" />
                    </View>
                  )}
                </Pressable>

                {/* Node Label Card — right side for left-offset nodes, left side for right-offset nodes */}
                <View
                  className="absolute w-[140px] bg-brand-bg border-[1.5px] border-brand-border rounded-[10px] py-1.5 px-2.5 shadow-sm"
                  style={
                    index % 2 === 0
                      ? { left: width * 0.5 + 45 }
                      : { right: width * 0.5 + 45 }
                  }
                >
                  <Text className="text-[11px] font-inter-bold text-brand-dark">
                    {mod.title}
                  </Text>
                  <Text className="text-[9px] text-brand-gray mt-0.5">
                    Lesson {mod.id} • {mod.xp}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* FINAL ACCREDITED TROPHY */}
          <View className="flex-row items-center w-full px-3 justify-center mb-[18px] mt-6">
            <Pressable
              onPress={handleTrophyPress}
              style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.95 : 1 }] })}
              className={`w-[86px] h-[86px] rounded-[43px] justify-center items-center shadow-md ${
                lessonsCompleted >= LESSON_MODULES.length
                  ? "bg-yellow-400 border-b-[6px] border-b-yellow-700"
                  : "bg-slate-300 border-b-[6px] border-b-slate-400"
              }`}
            >
              <Text className="text-[30px]">🏆</Text>
            </Pressable>

            <View
              className="absolute w-[140px] bg-brand-bg border-[1.5px] border-brand-border rounded-[10px] py-1.5 px-2.5 shadow-sm"
              style={{ left: width * 0.5 + 45 }}
            >
              <Text className="text-[11px] font-inter-bold text-brand-dark">
                Accredited Certificate
              </Text>
              <Text className="text-[9px] text-brand-gray mt-0.5">
                {lessonsCompleted >= LESSON_MODULES.length
                  ? "Unlocked! Claim now"
                  : `Locked (Complete ${LESSON_MODULES.length} lessons)`}
              </Text>
            </View>
          </View>
        </View>

        {/* MASCOT SUPPORT TIP BANNER */}
        <View className="flex-row bg-brand-bg border-2 border-brand-border rounded-2xl p-4 mt-8 items-center gap-3">
          <View className="w-[50px] h-[50px] rounded-full bg-brand-slateBg items-center justify-center">
            <Text className="text-[28px]">🦉</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[13px] font-inter-semibold text-brand-dark leading-[18px]">
              {activeTip}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* SELECTED NODE TOOLTIP MODAL */}
      <Modal
        visible={!!selectedModule}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedModule(null)}
      >
        <View className="flex-1 bg-slate-900/40 justify-end">
          <Pressable className="flex-1" onPress={() => setSelectedModule(null)} />
          <View className="bg-brand-bg rounded-t-3xl p-6 border-2 border-brand-border border-b-0 shadow-xl">
            {selectedModule && (
              <View>
                {/* Header */}
                <View className="flex-row justify-between items-center mb-4">
                  <View className="bg-brand-slateBg px-2 py-1 rounded-md">
                    <Text className="text-[9px] font-inter-bold text-brand-gray">
                      LESSON {selectedModule.id} OF {LESSON_MODULES.length}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setSelectedModule(null)}
                    className="p-1 active:opacity-80"
                  >
                    <Ionicons name="close" size={22} color={colors.gray} />
                  </Pressable>
                </View>

                {/* Content */}
                <Text className="text-xl font-inter-bold text-brand-dark mb-2">
                  {selectedModule.title}
                </Text>
                <Text className="text-sm text-brand-gray leading-5 mb-[18px]">
                  {selectedModule.desc}
                </Text>

                <View className="flex-row items-center mb-5">
                  <Text className="text-[13px] text-brand-gray">Rewards: </Text>
                  <Ionicons name="flash" size={14} color={colors.gold} />
                  <Text className="text-sm font-inter-bold text-amber-600 ml-1">
                    {selectedModule.xp}{" "}
                  </Text>
                  <Text className="text-[13px] text-brand-gray">• {selectedModule.duration}</Text>
                </View>

                {/* Primary Button */}
                <Pressable
                  onPress={() => startSession(selectedModule)}
                  className="bg-green-500 border-b-[5px] border-b-green-600 h-[52px] rounded-2xl justify-center items-center mb-3.5 active:opacity-80"
                >
                  <Text className="text-white text-base font-inter-bold tracking-wider">
                    {completedLessonIds.includes(selectedModule.id)
                      ? "REVIEW LESSON"
                      : "START +100 XP"}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* INTERACTIVE LESSON MODAL (DUOLINGO SLIDES) */}
      <Modal
        visible={!!sessionLesson}
        animationType="slide"
        onRequestClose={confirmQuitSession}
      >
        <SafeAreaView edges={["top"]} className="flex-1 bg-brand-bg">
          {sessionLesson && (
            <View className="flex-1">
              {/* Header: Close / Progress / Hearts */}
              <View className="flex-row items-center px-4 py-3 gap-[14px] border-b-[1.5px] border-brand-border">
                <Pressable onPress={confirmQuitSession} className="p-1 active:opacity-80">
                  <Ionicons name="close" size={26} color={colors.gray} />
                </Pressable>

                {/* Progress bar */}
                <View className="flex-1 h-4 bg-brand-slateBg rounded-lg overflow-hidden relative">
                  {(() => {
                    const quizList = MODULE_QUIZZES[sessionLesson.id] || [];
                    const totalSteps = sessionLesson.content.length + quizList.length;
                    let currentProgressStep = sessionStep;
                    if (sessionStep === sessionLesson.content.length) {
                      currentProgressStep =
                        sessionLesson.content.length + currentQuestionIndex;
                    } else if (sessionStep > sessionLesson.content.length) {
                      currentProgressStep = totalSteps;
                    }
                    const progressPercentage = Math.min(
                      100,
                      Math.max(0, (currentProgressStep / totalSteps) * 100)
                    );

                    return (
                      <View
                        className="h-full bg-green-500 rounded-lg"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    );
                  })()}
                  <View className="absolute top-[1px] left-[2px] right-[2px] h-[3px] bg-white/40 rounded-[1.5px]" />
                </View>

                {/* Hearts */}
                <View className="flex-row items-center gap-1">
                  <Text className="text-lg">❤️</Text>
                  <Text className="text-base font-inter-bold text-red-500">{hearts}</Text>
                </View>
              </View>

              {/* Body: Slides / Quiz / Complete */}
              {sessionStep < sessionLesson.content.length ? (
                /* SLIDE STAGE */
                <View className="flex-1 p-6 justify-center items-center">
                  {/* Mascot Dialogue */}
                  <View className="flex-row items-start mb-7 w-full">
                    <View className="w-[60px] h-[60px] rounded-full bg-brand-slateBg border-2 border-brand-border justify-center items-center">
                      <Text className="text-[36px]">🦉</Text>
                    </View>
                    <View
                      style={{
                        width: 0,
                        height: 0,
                        borderTopWidth: 10,
                        borderTopColor: "transparent",
                        borderBottomWidth: 10,
                        borderBottomColor: "transparent",
                        borderRightWidth: 12,
                        borderRightColor: "#F1F5F9",
                        marginTop: 20,
                        marginLeft: 6,
                        zIndex: 2,
                      }}
                    />
                    <View className="flex-1 bg-brand-slateBg border-[1.5px] border-brand-border rounded-[18px] p-4 shadow-sm">
                      <Text className="text-base text-brand-dark leading-6 font-inter-medium">
                        {sessionLesson.content[sessionStep]}
                      </Text>
                    </View>
                  </View>

                  {/* Slide image (if provided) */}
                  {sessionLesson.images && sessionLesson.images[sessionStep] && (
                    <View className="w-full mb-4 rounded-2xl overflow-hidden border border-brand-border">
                      <Image
                        source={sessionLesson.images[sessionStep]}
                        className="w-full h-[180px]"
                        resizeMode="contain"
                      />
                    </View>
                  )}

                  {/* Interactive key takeaway illustration */}
                  <View className="bg-amber-50 border-[1.5px] border-amber-200 rounded-2xl p-4 w-full mt-3">
                    <View className="flex-row items-center gap-2 mb-2">
                      <Ionicons name="bulb" size={20} color={colors.gold} />
                      <Text className="text-[11px] font-inter-bold text-amber-700 tracking-wider">
                        KEY LITERACY CONCEPT
                      </Text>
                    </View>
                    <Text className="text-[13px] text-amber-900 leading-[18px] font-inter-medium">
                      {sessionLesson.id === 1 &&
                        "Separate savings vault accounts (like Vault/Cash) protect funds from instant transfer temptations."}
                      {sessionLesson.id === 2 &&
                        "Quick money apps compound flat daily/monthly interest into massive annual percentages. Check APR first!"}
                      {sessionLesson.id === 3 &&
                        "Government T-Bills operate under secure backing, yielding safe returns that help shield against inflation."}
                      {sessionLesson.id === 4 &&
                        "Pension contribution plans accumulate long-term compounds, ensuring guaranteed security in retirement years."}
                      {sessionLesson.id === 5 &&
                        "SLTF student loans are now guarantor-free with a Ghana Card. Use them strictly for educational expenses to avoid long-term debt."}
                      {sessionLesson.id === 6 &&
                        "Always separate personal and business finances. A dedicated MoMo merchant wallet helps track true profit and prevents overspending."}
                      {sessionLesson.id === 7 &&
                        "Your MoMo history IS your credit file in Ghana. Consistent activity and on-time digital loan repayments build the score lenders check before approving you."}
                    </Text>
                  </View>

                  {/* Listen / Audio button */}
                  <Pressable
                    onPress={toggleSpeech}
                    className="flex-row items-center justify-center mt-4 bg-brand-slateBg rounded-xl py-3 px-5 active:bg-brand-slateBg gap-2"
                  >
                    <Ionicons
                      name={isSpeaking || isPlaying ? "pause-circle" : "play-circle"}
                      size={20}
                      color={colors.gray}
                    />
                    <Text className="text-sm font-inter-semibold text-brand-gray">
                      {isSpeaking || isPlaying
                        ? "Stop Listening"
                        : sessionLesson.audioLocalPath
                        ? "Listen to Audio"
                        : "Listen to Slide"}
                    </Text>
                    {sessionLesson.audioLocalPath && !(isSpeaking || isPlaying) && (
                      <View className="bg-brand-emerald/10 px-1.5 py-0.5 rounded ml-1">
                        <Text className="text-[8px] font-inter-bold text-brand-emerald uppercase">MP3</Text>
                      </View>
                    )}
                  </Pressable>
                </View>
              ) : sessionStep === sessionLesson.content.length ? (
                /* QUIZ STAGE */
                hearts === 0 ? (
                  /* No Hearts screen */
                  <View className="flex-1 justify-center items-center p-6">
                    <Text className="text-[80px] mb-6">🦉💦</Text>
                    <Text className="text-[26px] font-inter-bold text-red-500 mb-2.5">
                      No Hearts Left!
                    </Text>
                    <Text className="text-[15px] text-brand-gray text-center leading-[22px] mb-8">
                      You made too many mistakes in this quiz. You can spend 50 XP to refill your
                      hearts, or exit the lesson.
                    </Text>

                    <Pressable
                      onPress={handleRefillHearts}
                      className="bg-yellow-400 border-b-[5px] border-b-yellow-700 w-full h-[52px] rounded-2xl justify-center items-center mb-3.5 active:opacity-80"
                    >
                      <Text className="text-white text-base font-inter-bold">
                        Refill Hearts (50 XP)
                      </Text>
                    </Pressable>

                    <Pressable
                      onPress={() => {
                        setSessionLesson(null);
                      }}
                      className="w-full h-[52px] rounded-2xl border-2 border-brand-border justify-center items-center active:opacity-80"
                    >
                      <Text className="text-brand-gray text-base font-inter-bold">
                        Quit Lesson
                      </Text>
                    </Pressable>
                  </View>
                ) : (
                  /* Live Quiz Question */
                  <ScrollView className="flex-1 p-6">
                    <View className="flex-row items-start mb-7 w-full">
                      <View className="w-[60px] h-[60px] rounded-full bg-brand-slateBg border-2 border-brand-border justify-center items-center">
                        <Text className="text-[36px]">🦉</Text>
                      </View>
                      <View
                        style={{
                          width: 0,
                          height: 0,
                          borderTopWidth: 10,
                          borderTopColor: "transparent",
                          borderBottomWidth: 10,
                          borderBottomColor: "transparent",
                          borderRightWidth: 12,
                          borderRightColor: "#F1F5F9",
                          marginTop: 20,
                          marginLeft: 6,
                          zIndex: 2,
                        }}
                      />
                      <View className="flex-1 bg-brand-slateBg border-[1.5px] border-brand-border rounded-[18px] p-4 shadow-sm">
                        <Text className="text-base text-brand-dark leading-6 font-inter-bold">
                          {"Let's verify what you've learned! Answer the question below:"}
                        </Text>
                      </View>
                    </View>

                    {(() => {
                      const quizList = MODULE_QUIZZES[sessionLesson.id];
                      if (!quizList || quizList.length === 0) {
                        return (
                          <Text className="text-base text-brand-dark leading-6 font-inter-medium">
                            No quiz configured for this lesson.
                          </Text>
                        );
                      }
                      const currentQuestion = quizList[currentQuestionIndex];
                      if (!currentQuestion) {
                        return (
                          <Text className="text-base text-brand-dark leading-6 font-inter-medium">
                            No question found for this quiz stage.
                          </Text>
                        );
                      }

                      return (
                        <View className="mt-6 pb-10">
                          <Text className="text-[10px] font-inter-bold text-brand-gray tracking-widest mb-1.5">
                            QUESTION {currentQuestionIndex + 1} OF {quizList.length}
                          </Text>
                          <Text className="text-[22px] font-inter-bold text-brand-dark leading-[30px] mb-[22px]">
                            {currentQuestion.question}
                          </Text>

                          <View className="gap-3">
                            {currentQuestion.options.map((opt, i) => {
                              const isSelected = selectedOptionIndex === i;

                              let optBtnClass =
                                "p-4 rounded-2xl border-2 border-brand-border border-b-[6px] bg-brand-bg flex-row items-center justify-between active:opacity-80";
                              let optTextClass =
                                "text-[17px] font-inter-semibold text-brand-dark flex-1 mr-2.5 leading-6";
                              let optionIcon = "ellipse-outline";
                              let optionIconColor = colors.gray;

                              if (isAnswerChecked) {
                                if (opt.isCorrect) {
                                  optBtnClass += " border-green-500 border-b-green-900 bg-green-50";
                                  optTextClass += " text-green-700";
                                  optionIcon = "checkmark-circle";
                                  optionIconColor = colors.success;
                                } else if (isSelected) {
                                  optBtnClass += " border-red-500 border-b-red-900 bg-red-50";
                                  optTextClass += " text-red-700";
                                  optionIcon = "close-circle";
                                  optionIconColor = colors.danger;
                                }
                              } else if (isSelected) {
                                optBtnClass += " border-blue-700 border-b-blue-950 bg-blue-50";
                                optTextClass += " text-blue-700";
                                optionIconColor = colors.info;
                              }

                              return (
                                <Pressable
                                  key={i}
                                  onPress={() => {
                                    if (isAnswerChecked && isAnswerCorrect) return;
                                    setSelectedOptionIndex(i);
                                    setIsAnswerChecked(false);
                                    setIsAnswerCorrect(null);
                                  }}
                                  className={optBtnClass}
                                >
                                  <Text className={optTextClass}>{opt.text}</Text>
                                  <Ionicons name={optionIcon as any} size={18} color={optionIconColor} />
                                </Pressable>
                              );
                            })}
                          </View>
                        </View>
                      );
                    })()}
                  </ScrollView>
                )
              ) : (
                /* LESSON COMPLETE STAGE */
                <View className="flex-1 justify-center items-center p-6">
                  <Text className="text-[88px] mb-4">🦉🎓</Text>
                  <Text className="text-[26px] font-inter-bold text-green-600 mb-2">
                    Lesson Complete!
                  </Text>
                  <Text className="text-sm text-brand-gray text-center leading-5 mb-8">
                    You successfully finished the course and demonstrated master-level understanding.
                  </Text>

                  <View className="flex-row bg-brand-slateBg border-2 border-brand-border rounded-[20px] p-5 w-full gap-4">
                    <View className="flex-1 items-center bg-brand-bg border-[1.5px] border-brand-border rounded-[14px] py-3.5">
                      <Text className="text-base mb-1">⚡</Text>
                      <Text className="text-base font-inter-bold text-brand-dark">+{sessionLesson.xpVal} XP</Text>
                      <Text className="text-[9px] font-inter-bold text-brand-gray mt-0.5">BONUS POINTS</Text>
                    </View>
                    <View className="flex-1 items-center bg-brand-bg border-[1.5px] border-brand-border rounded-[14px] py-3.5">
                      <Text className="text-base mb-1">❤️</Text>
                      <Text className="text-base font-inter-bold text-brand-dark">{hearts}/5</Text>
                      <Text className="text-[9px] font-inter-bold text-brand-gray mt-0.5">HEARTS LEFT</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Session Footer Control Button */}
              {sessionStep === sessionLesson.content.length && hearts === 0 ? null : (
                <View
                  className={`px-5 pt-4 pb-6 border-t-2 ${
                    isAnswerChecked && isAnswerCorrect === true
                      ? "bg-green-100 border-t-green-200"
                      : isAnswerChecked && isAnswerCorrect === false
                      ? "bg-red-100 border-t-red-200"
                      : "bg-brand-bg border-t-slate-200"
                  }`}
                >
                  {isAnswerChecked && (
                    <View className="flex-row items-center mb-3.5 gap-2">
                      <Ionicons
                        name={isAnswerCorrect ? "checkmark-circle" : "alert-circle"}
                        size={24}
                        color={isAnswerCorrect ? colors.success : colors.danger}
                      />
                      <Text
                        className={`text-sm font-inter-bold flex-1 ${
                          isAnswerCorrect ? "text-green-700" : "text-red-700"
                        }`}
                      >
                        {isAnswerCorrect
                          ? "Amazing! You got the answer correct! 🎉"
                          : "Oops! Incorrect answer. Try again! 💔"}
                      </Text>
                    </View>
                  )}

                  <Pressable
                    disabled={
                      sessionStep === sessionLesson.content.length &&
                      selectedOptionIndex === null
                    }
                    onPress={
                      sessionStep === sessionLesson.content.length && !isAnswerChecked
                        ? handleCheckQuizAnswer
                        : handleSessionContinue
                    }
                    className={`h-[52px] rounded-2xl justify-center items-center active:opacity-80 ${
                      isAnswerChecked && isAnswerCorrect === true
                        ? "bg-green-500 border-b-[5px] border-b-green-700"
                        : isAnswerChecked && isAnswerCorrect === false
                        ? "bg-red-500 border-b-[5px] border-b-red-700"
                        : sessionStep === sessionLesson.content.length &&
                          selectedOptionIndex === null
                        ? "bg-brand-slateBg border-b-[5px] border-b-slate-300"
                        : "bg-green-500 border-b-[5px] border-b-green-600"
                    }`}
                  >
                    <Text className="text-white text-base font-inter-bold tracking-wider">
                      {sessionStep === sessionLesson.content.length
                        ? isAnswerChecked
                          ? isAnswerCorrect
                            ? "CONTINUE"
                            : "TRY AGAIN"
                          : "CHECK ANSWER"
                        : sessionStep > sessionLesson.content.length
                        ? "FINISH"
                        : "CONTINUE"}
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
