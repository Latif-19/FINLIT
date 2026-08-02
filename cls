warning: in the working copy of 'backend/secrets.properties.example', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'package-lock.json', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'package.json', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/app/(tabs)/home.tsx b/app/(tabs)/home.tsx[m
[1mindex 626372f..94a825f 100644[m
[1m--- a/app/(tabs)/home.tsx[m
[1m+++ b/app/(tabs)/home.tsx[m
[36m@@ -15,6 +15,14 @@[m [mimport { AVATAR_OPTIONS } from "@/data/avatars";[m
 import { getSmartRecommendations, SmartRecommendation } from "@/data/recommendations";[m
 import { useThemeColors } from "../../hooks/useThemeColors";[m
 [m
[32m+[m[32mfunction formatDuration(totalSeconds: number): string {[m
[32m+[m[32m  const totalMinutes = Math.round(totalSeconds / 60);[m
[32m+[m[32m  if (totalMinutes < 60) return `${totalMinutes}m`;[m
[32m+[m[32m  const hours = Math.floor(totalMinutes / 60);[m
[32m+[m[32m  const minutes = totalMinutes % 60;[m
[32m+[m[32m  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;[m
[32m+[m[32m}[m
[32m+[m
 const HOME_NEWS_PREVIEW = [[m
   {[m
     id: 1,[m
[36m@@ -62,6 +70,7 @@[m [mexport default function HomeScreen() {[m
   const avatar = useUserStore((s) => s.avatar);[m
   const xp = useUserStore((s) => s.xp);[m
   const lessonsCompleted = useUserStore((s) => s.lessonsCompleted);[m
[32m+[m[32m  const totalTimeSpentSeconds = useUserStore((s) => s.totalTimeSpentSeconds);[m
   const userGoal = useUserStore((s) => s.goal);[m
   const streak = useUserStore((s) => s.streak);[m
 [m
[36m@@ -245,6 +254,20 @@[m [mexport default function HomeScreen() {[m
               {xp} <Text className="text-xs text-brand-gold font-inter-bold">XP</Text>[m
             </Text>[m
           </View>[m
[32m+[m
[32m+[m[32m          <View className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-md">[m
[32m+[m[32m            <View className="flex-row justify-between items-center">[m
[32m+[m[32m              <Text className="text-brand-gray text-[10px] font-inter-semibold uppercase tracking-wider">[m
[32m+[m[32m                Learning[m
[32m+[m[32m              </Text>[m
[32m+[m[32m              <View className="w-6 h-6 bg-brand-navy/10 rounded-lg items-center justify-center">[m
[32m+[m[32m                <Ionicons name="time" size={12} color={colors.navy} />[m
[32m+[m[32m              </View>[m
[32m+[m[32m            </View>[m
[32m+[m[32m            <Text className="text-brand-navy text-2xl font-inter-bold mt-2">[m
[32m+[m[32m              {formatDuration(totalTimeSpentSeconds)}[m
[32m+[m[32m            </Text>[m
[32m+[m[32m          </View>[m
         </View>[m
 [m
         {/* ── FINANCIAL NEWS MINI-FEED ── */}[m
[1mdiff --git a/app/(tabs)/learn.tsx b/app/(tabs)/learn.tsx[m
[1mindex decbbfe..8ab3169 100644[m
[1m--- a/app/(tabs)/learn.tsx[m
[1m+++ b/app/(tabs)/learn.tsx[m
[36m@@ -1,4 +1,4 @@[m
[31m-import React, { useState } from "react";[m
[32m+[m[32mimport React, { useState, useRef } from "react";[m
 import {[m
   ScrollView,[m
   Text,[m
[36m@@ -30,6 +30,7 @@[m [mconst LESSON_ICONS: Record<number, React.ComponentProps<typeof Ionicons>["name"][m
   4: "shield-checkmark-outline", // Pensions & Provident Funds[m
   5: "school-outline",           // Student Loans & Bursaries[m
   6: "briefcase-outline",        // Side Hustles & Business Finance[m
[32m+[m[32m  7: "id-card-outline",          // Credit Scores & Digital Credit History[m
 };[m
 [m
 function lessonIcon(id: number): React.ComponentProps<typeof Ionicons>["name"] {[m
[36m@@ -57,6 +58,7 @@[m [mexport default function LearnScreen() {[m
   const userXp = useUserStore((s) => s.xp);[m
   const streak = useUserStore((s) => s.streak);[m
   const userGoal = useUserStore((s) => s.goal);[m
[32m+[m[32m  const completedLessonIds = useUserStore((s) => s.completedLessonIds);[m
 [m
   // Main UI States[m
   const [selectedModule, setSelectedModule] = useState<LessonModule | null>(null);[m
[36m@@ -89,8 +91,11 @@[m [mexport default function LearnScreen() {[m
     setSelectedModule(mod);[m
   };[m
 [m
[32m+[m[32m  const sessionStartRef = useRef<number | null>(null);[m
[32m+[m
   // Starts the interactive slide-by-slide session[m
   const startSession = (lesson: LessonModule) => {[m
[32m+[m[32m    sessionStartRef.current = Date.now();[m
     setSelectedModule(null);[m
     setSessionLesson(lesson);[m
     setSessionStep(0);[m
[36m@@ -174,6 +179,10 @@[m [mexport default function LearnScreen() {[m
       const lessonId = sessionLesson.id;[m
       const xpVal = sessionLesson.xpVal;[m
       const answers = quizAnswers;[m
[32m+[m[32m      const timeSpentSeconds = sessionStartRef.current[m
[32m+[m[32m        ? Math.round((Date.now() - sessionStartRef.current) / 1000)[m
[32m+[m[32m        : undefined;[m
[32m+[m[32m      sessionStartRef.current = null;[m
 [m
       Speech.stop();[m
       setIsSpeaking(false);[m
[36m@@ -188,7 +197,7 @@[m [mexport default function LearnScreen() {[m
 [m
       const store = useUserStore.getState();[m
       try {[m
[31m-        await progressService.completeLesson(lessonId);[m
[32m+[m[32m        await progressService.completeLesson(lessonId, timeSpentSeconds);[m
         if (answers.length > 0) {[m
           await gamificationService.submitQuizScore({ moduleId: lessonId, answers });[m
         }[m
[36m@@ -319,6 +328,7 @@[m [mexport default function LearnScreen() {[m
     "🦉: Tier 3 pensions are voluntary, tax-free, and let you withdraw early in emergencies.",[m
     "🦉: Student loans (SLTF) are now guarantor-free with a Ghana Card. Use them strictly for educational expenses!",[m
     "🦉: Keep side hustle funds separate from daily money. Separating accounts is key to campus business success!",[m
[32m+[m[32m    "🦉: A single late Fido or Qwikloan repayment can quietly shrink your future borrowing limit. Digital lenders are watching your MoMo activity!",[m
   ];[m
   const activeTip = mascotTips[lessonsCompleted % mascotTips.length] || mascotTips[0];[m
 [m
[36m@@ -332,6 +342,16 @@[m [mexport default function LearnScreen() {[m
   };[m
   const recommendedLesson = userGoal ? GOAL_LESSON[userGoal] : null;[m
 [m
[32m+[m[32m  // Goal-relevant lesson first, same six lessons otherwise — nothing hidden,[m
[32m+[m[32m  // just resequenced. LESSON_MODULES itself is left untouched since[m
[32m+[m[32m  // data/recommendations.ts indexes it in its original order.[m
[32m+[m[32m  const orderedModules: LessonModule[] = recommendedLesson[m
[32m+[m[32m    ? [[m
[32m+[m[32m        ...LESSON_MODULES.filter((m) => m.id === recommendedLesson.id),[m
[32m+[m[32m        ...LESSON_MODULES.filter((m) => m.id !== recommendedLesson.id),[m
[32m+[m[32m      ][m
[32m+[m[32m    : LESSON_MODULES;[m
[32m+[m
   return ([m
     <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">[m
       {/* DUOLINGO STYLE HEADER STATS */}[m
[36m@@ -364,8 +384,9 @@[m [mexport default function LearnScreen() {[m
         contentContainerStyle={{ padding: 20, paddingBottom: 60 }}[m
         showsVerticalScrollIndicator={false}[m
       >[m
[31m-        {/* Personalized Path Banner — shown only after assessment is done */}[m
[31m-        {userGoal && recommendedLesson && ([m
[32m+[m[32m        {/* Personalized Path Banner — shown only after assessment is done, and[m
[32m+[m[32m            hidden once that lesson is actually completed */}[m
[32m+[m[32m        {userGoal && recommendedLesson && !completedLessonIds.includes(recommendedLesson.id) && ([m
           <View className="bg-brand-emerald/5 border border-brand-emerald/20 rounded-2xl p-4 mb-5 flex-row items-center gap-3">[m
             <View className="w-10 h-10 bg-brand-emerald/10 rounded-xl items-center justify-center">[m
               <Ionicons name={lessonIcon(recommendedLesson.id)} size={20} color="#16A34A" />[m
[36m@@ -421,10 +442,15 @@[m [mexport default function LearnScreen() {[m
           {/* Vertical connecting line */}[m
           <View className="absolute top-[30px] bottom-[30px] left-1/2 w-1.5 bg-slate-200 -translate-x-[3px] z-[-1]" />[m
 [m
[31m-          {LESSON_MODULES.map((mod, index) => {[m
[31m-            const isCompleted = lessonsCompleted >= mod.id;[m
[31m-            const isUnlocked = lessonsCompleted >= index;[m
[31m-            const isCurrent = lessonsCompleted === index;[m
[32m+[m[32m          {orderedModules.map((mod, index) => {[m
[32m+[m[32m            const isCompleted = completedLessonIds.includes(mod.id);[m
[32m+[m[32m            // Unlocked once every lesson before it IN THE DISPLAYED ORDER is[m
[32m+[m[32m            // done — not a raw completed-count check, since the goal-priority[m
[32m+[m[32m            // lesson may now sit at a different position than its id implies.[m
[32m+[m[32m            const isUnlocked =[m
[32m+[m[32m              index === 0 ||[m
[32m+[m[32m              orderedModules.slice(0, index).every((m) => completedLessonIds.includes(m.id));[m
[32m+[m[32m            const isCurrent = isUnlocked && !isCompleted;[m
 [m
             let layoutClass = "justify-center";[m
             if (index % 2 === 0) {[m
[36m@@ -592,7 +618,7 @@[m [mexport default function LearnScreen() {[m
                   className="bg-green-500 border-b-[5px] border-b-green-600 h-[52px] rounded-2xl justify-center items-center mb-3.5 active:opacity-80"[m
                 >[m
                   <Text className="text-white text-base font-inter-bold tracking-wider">[m
[31m-                    {lessonsCompleted >= selectedModule.id[m
[32m+[m[32m                    {completedLessonIds.includes(selectedModule.id)[m
                       ? "REVIEW LESSON"[m
                       : "START +100 XP"}[m
                   </Text>[m
[36m@@ -715,6 +741,8 @@[m [mexport default function LearnScreen() {[m
                         "SLTF student loans are now guarantor-free with a Ghana Card. Use them strictly for educational expenses to avoid long-term debt."}[m
                       {sessionLesson.id === 6 &&[m
                         "Always separate personal and business finances. A dedicated MoMo merchant wallet helps track true profit and prevents overspending."}[m
[32m+[m[32m                      {sessionLesson.id === 7 &&[m
[32m+[m[32m                        "Your MoMo history IS your credit file in Ghana. Consistent activity and on-time digital loan repayments build the score lenders check before approving you."}[m
                     </Text>[m
                   </View>[m
 [m
[1mdiff --git a/app/_layout.tsx b/app/_layout.tsx[m
[1mindex af4669c..3aaa49f 100644[m
[1m--- a/app/_layout.tsx[m
[1m+++ b/app/_layout.tsx[m
[36m@@ -32,6 +32,7 @@[m [mfunction NavigationGuard() {[m
   const router = useRouter();[m
   const segments = useSegments() as unknown as string[];[m
   const isAuthenticated = useUserStore((s) => s.isAuthenticated);[m
[32m+[m[32m  const lastAssessedAt = useUserStore((s) => s.lastAssessedAt);[m
   const rootNavigationState = useRootNavigationState();[m
 [m
   useEffect(() => {[m
[36m@@ -49,14 +50,25 @@[m [mfunction NavigationGuard() {[m
       segments[0] === "index" ||[m
       segments.length === 0;[m
 [m
[32m+[m[32m    // The one-time onboarding assessment — backend-verified via lastAssessedAt,[m
[32m+[m[32m    // not a one-shot redirect that's easy to fall out of (e.g. by later logging[m
[32m+[m[32m    // in instead of registering fresh).[m
[32m+[m[32m    const inAssessmentFlow =[m
[32m+[m[32m      segments[0] === "assessment" || segments[0] === "assessment-result";[m
[32m+[m[32m    const needsAssessment = isAuthenticated && !lastAssessedAt;[m
[32m+[m
     if (!isAuthenticated && !inAuthGroup) {[m
       // Redirect unauthenticated user[m
       router.replace("/auth");[m
     } else if (isAuthenticated && inAuthGroup && segments[0] !== "index") {[m
       // Prevent authenticated user from accessing auth screens[m
[31m-      router.replace("/(tabs)/home");[m
[32m+[m[32m      router.replace(needsAssessment ? "/assessment" : "/(tabs)/home");[m
[32m+[m[32m    } else if (needsAssessment && !inAuthGroup && !inAssessmentFlow) {[m
[32m+[m[32m      // Never let an authenticated-but-unassessed user reach the rest of the[m
[32m+[m[32m      // app, regardless of how they got authenticated.[m
[32m+[m[32m      router.replace("/assessment");[m
     }[m
[31m-  }, [isAuthenticated, segments, router, rootNavigationState?.key]);[m
[32m+[m[32m  }, [isAuthenticated, lastAssessedAt, segments, router, rootNavigationState?.key]);[m
 [m
   return null;[m
 }[m
[1mdiff --git a/app/assessment.tsx b/app/assessment.tsx[m
[1mindex ea67b7a..1d4f380 100644[m
[1m--- a/app/assessment.tsx[m
[1m+++ b/app/assessment.tsx[m
[36m@@ -1,6 +1,6 @@[m
 import { router } from "expo-router";[m
 import React, { useState } from "react";[m
[31m-import { Pressable, ScrollView, Text, View, ActivityIndicator, Modal } from "react-native";[m
[32m+[m[32mimport { Pressable, ScrollView, Text, View, ActivityIndicator, Modal, Alert } from "react-native";[m
 import { SafeAreaView } from "react-native-safe-area-context";[m
 import { Ionicons } from "@expo/vector-icons";[m
 import { useUserStore } from "../store/useUserStore";[m
[36m@@ -44,7 +44,20 @@[m [mexport default function AssessmentScreen() {[m
       score = res.data.score;[m
       goal = res.data.goal;[m
     } catch {[m
[31m-      // keep the locally-computed score/goal[m
[32m+[m[32m      // A 401 that couldn't be refreshed logs the user out entirely (see the[m
[32m+[m[32m      // response interceptor in services/api.ts). Don't silently pretend this[m
[32m+[m[32m      // succeeded — NavigationGuard would just bounce them off[m
[32m+[m[32m      // assessment-result with no explanation a moment later.[m
[32m+[m[32m      if (!useUserStore.getState().isAuthenticated) {[m
[32m+[m[32m        setIsAnalyzing(false);[m
[32m+[m[32m        Alert.alert([m
[32m+[m[32m          "Session Expired",[m
[32m+[m[32m          "You've been signed out. Please sign in again to finish your assessment.",[m
[32m+[m[32m          [{ text: "OK", onPress: () => router.replace("/auth") }][m
[32m+[m[32m        );[m
[32m+[m[32m        return;[m
[32m+[m[32m      }[m
[32m+[m[32m      // Otherwise — offline / network error — keep the locally-computed score/goal.[m
     }[m
 [m
     const store = useUserStore.getState();[m
[1mdiff --git a/app/certificate.tsx b/app/certificate.tsx[m
[1mindex b4aa7ee..c832978 100644[m
[1m--- a/app/certificate.tsx[m
[1m+++ b/app/certificate.tsx[m
[36m@@ -1,14 +1,16 @@[m
 import { router } from "expo-router";[m
[31m-import React from "react";[m
[32m+[m[32mimport React, { useRef, useState } from "react";[m
 import {[m
   View,[m
   Text,[m
   Pressable,[m
   ScrollView,[m
[31m-  Share,[m
   Alert,[m
[32m+[m[32m  ActivityIndicator,[m
 } from "react-native";[m
 import { Ionicons } from "@expo/vector-icons";[m
[32m+[m[32mimport ViewShot from "react-native-view-shot";[m
[32m+[m[32mimport * as Sharing from "expo-sharing";[m
 import { useUserStore } from "../store/useUserStore";[m
 import { LESSON_MODULES } from "@/data/lessons";[m
 [m
[36m@@ -19,6 +21,8 @@[m [mexport default function CertificateScreen() {[m
   const lessonsCompleted = useUserStore((s) => s.lessonsCompleted);[m
   const createdAt = useUserStore((s) => s.createdAt);[m
   const xp = useUserStore((s) => s.xp);[m
[32m+[m[32m  const certificateRef = useRef<ViewShot>(null);[m
[32m+[m[32m  const [isDownloading, setIsDownloading] = useState(false);[m
 [m
   const isUnlocked = lessonsCompleted >= LESSON_MODULES.length;[m
   const completedDate = new Date().toLocaleDateString("en-US", {[m
[36m@@ -36,13 +40,27 @@[m [mexport default function CertificateScreen() {[m
     return "Financial Novice";[m
   };[m
 [m
[31m-  co