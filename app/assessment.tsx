import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View, ActivityIndicator, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";
import { progressService } from "../services/progress";
import { ASSESSMENT_QUESTIONS } from "@/data/assessment";

const questions = ASSESSMENT_QUESTIONS;

export default function AssessmentScreen() {
  const [answers, setAnswers] = useState<number[]>(
    Array(questions.length).fill(0),
  );
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  const handleSelect = (questionIndex: number, score: number) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[questionIndex] = score;
      return updated;
    });
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Staged "analysing" animation (purely visual).
    setTimeout(() => setAnalysisStep(1), 600);
    setTimeout(() => setAnalysisStep(2), 1200);
    setTimeout(() => setAnalysisStep(3), 1800);
    setTimeout(() => setAnalysisStep(4), 2400);

    // Submit to the backend: it scores the answers, saves score/goal on the
    // user, and returns the tier + syllabus. Fall back to local scoring offline.
    let score = answers.reduce((a, b) => a + b, 0);
    let goal = selectedGoal;
    try {
      const res = await progressService.submitAssessment(answers, selectedGoal);
      score = res.data.score;
      goal = res.data.goal;
    } catch {
      // keep the locally-computed score/goal
    }

    const store = useUserStore.getState();
    store.setScore(score);
    store.setGoal(goal);
    store.setLastAssessedAt(new Date().toISOString());

    // Keep the analysis screen visible for a pleasant minimum duration.
    setTimeout(() => {
      setIsAnalyzing(false);
      router.push({
        pathname: "/assessment-result",
        params: {
          score: score.toString(),
          goal,
        },
      });
    }, 2600);
  };

  const totalQuestions = questions.length + 1; // 5 knowledge questions + 1 goal question
  const completedCount = answers.filter((answer) => answer !== 0).length + (selectedGoal ? 1 : 0);
  const completed = completedCount === totalQuestions;
  const progressPercentage = (completedCount / totalQuestions) * 100;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">
      {/* Decorative Accent Background */}
      <View className="absolute top-0 left-0 right-0 h-64 bg-brand-navy/5 rounded-b-[100px] -z-10" />

      {/* Header Container */}
      <View className="flex-row items-center px-6 pt-14 pb-4">
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="p-2.5 bg-white rounded-full shadow-md border border-slate-100 active:opacity-80"
        >
          <Ionicons name="arrow-back" size={22} color="#0A2540" />
        </Pressable>
        <Text className="text-lg font-inter-semibold text-brand-navy ml-4 flex-1 text-center pr-10">
          Assessment
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="px-6 mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-brand-gray font-inter-semibold text-xs uppercase tracking-wider">
            Progress
          </Text>
          <Text className="text-brand-emerald font-inter-bold text-xs">
            {completedCount} / {totalQuestions} Questions
          </Text>
        </View>
        <View className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <View
            style={{ width: `${progressPercentage}%` }}
            className="h-full bg-brand-emerald rounded-full"
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Branding header */}
        <View className="items-center mb-6">
          <Text className="text-[32px] font-inter-bold text-brand-navy text-center tracking-tight leading-10">
            Financial Literacy
          </Text>
          <Text className="text-brand-gray font-inter text-sm mt-1.5 text-center px-6 leading-5">
            Help us personalize your roadmap and lessons to fit your knowledge base.
          </Text>
        </View>

        {/* Questions Map */}
        {questions.map((item, qIndex) => (
          <View
            key={qIndex}
            className="bg-white rounded-2xl p-5 border border-slate-100 mb-6 shadow-md shadow-slate-100/40"
          >
            <Text className="text-brand-gray font-inter-semibold text-xs uppercase tracking-wider mb-2">
              Question {qIndex + 1}
            </Text>
            <Text className="text-lg font-inter-semibold text-brand-navy mb-4">
              {item.question}
            </Text>

            {item.options.map((option, oIndex) => {
              const isSelected = answers[qIndex] === option.score;
              return (
                <Pressable
                  key={oIndex}
                  onPress={() => handleSelect(qIndex, option.score)}
                  style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.99 : 1 }] })}
                  className={`p-4 rounded-2xl border mb-3 flex-row items-center justify-between active:opacity-80 ${
                    isSelected
                      ? "bg-brand-emerald/10 border-brand-emerald shadow-sm"
                      : "border-slate-200 bg-slate-50/20"
                  }`}
                >
                  <Text
                    className={`text-base font-inter-medium flex-1 ${
                      isSelected ? "text-brand-emerald" : "text-brand-dark"
                    }`}
                  >
                    {option.text}
                  </Text>
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      isSelected
                        ? "border-brand-emerald bg-brand-emerald"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="white" />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        ))}

        {/* YOUR FINANCIAL GOALS SECTION */}
        <View className="mt-4 mb-6">
          <Text className="text-[24px] font-inter-semibold text-brand-navy tracking-tight uppercase">
            YOUR FINANCIAL GOALS
          </Text>
          <Text className="text-brand-gray font-inter text-sm mt-1 leading-5">
            Tell us what you want to achieve so we can personalize your learning journey.
          </Text>
        </View>

        {/* Question 6 Card */}
        <View className="bg-white rounded-2xl p-5 border border-slate-100 mb-6 shadow-md shadow-slate-100/40">
          <Text className="text-brand-gray font-inter-semibold text-xs uppercase tracking-wider mb-2">
            Question 6
          </Text>
          <Text className="text-lg font-inter-semibold text-brand-navy mb-4">
            What is your primary financial goal?
          </Text>

          {[
            
            "Build an Emergency Fund",
            "Improve Budgeting",
            "Learn Investing",
            "Become Debt Free",
            "Start a Business",
            "Save for Education"
          ].map((goalOption, idx) => {
            const isSelected = selectedGoal === goalOption;
            return (
              <Pressable
                key={idx}
                onPress={() => setSelectedGoal(goalOption)}
                style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.99 : 1 }] })}
                className={`p-4 rounded-2xl border mb-3 flex-row items-center justify-between active:opacity-80 ${
                  isSelected
                    ? "bg-brand-emerald/10 border-brand-emerald shadow-sm"
                    : "border-slate-200 bg-slate-50/20"
                }`}
              >
                <Text
                  className={`text-base font-inter-medium flex-1 ${
                    isSelected ? "text-brand-emerald" : "text-brand-dark"
                  }`}
                >
                  {goalOption}
                </Text>
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    isSelected
                      ? "border-brand-emerald bg-brand-emerald"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Submit Button */}
        <Pressable
          disabled={!completed}
          onPress={handleSubmit}
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
          className={`h-14 rounded-2xl mt-4 shadow-md items-center justify-center ${
            completed ? "bg-brand-navy shadow-brand-navy/10" : "bg-slate-200"
          }`}
        >
          <Text
            className={`font-inter-semibold text-base ${
              completed ? "text-white" : "text-slate-400"
            }`}
          >
            View Results
          </Text>
        </Pressable>
      </ScrollView>

      {/* Loading Personalization Modal */}
      <Modal visible={isAnalyzing} transparent animationType="fade">
        <View className="flex-1 bg-brand-navy/95 items-center justify-center px-8">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-white/10 rounded-full items-center justify-center mb-4">
              <ActivityIndicator size="large" color="#16A34A" />
            </View>
            <Text className="text-white text-2xl font-inter-bold tracking-tight text-center">
              Personalizing Your Experience
            </Text>
          </View>

          <View className="w-full max-w-xs">
            <View className={`flex-row items-center mt-3.5 ${analysisStep >= 0 ? "opacity-100" : "opacity-30"}`}>
              <Ionicons
                name={analysisStep >= 1 ? "checkmark-circle" : "sync-outline"}
                size={20}
                color={analysisStep >= 1 ? "#16A34A" : "#D4AF37"}
              />
              <Text className="text-white font-inter-semibold text-sm ml-3">
                Analyzing your responses...
              </Text>
            </View>

            <View className={`flex-row items-center mt-3.5 ${analysisStep >= 1 ? "opacity-100" : "opacity-0"}`}>
              <Ionicons
                name={analysisStep >= 2 ? "checkmark-circle" : "sync-outline"}
                size={20}
                color={analysisStep >= 2 ? "#16A34A" : "#D4AF37"}
              />
              <Text className="text-white font-inter-semibold text-sm ml-3">
                Measuring your financial knowledge
              </Text>
            </View>

            <View className={`flex-row items-center mt-3.5 ${analysisStep >= 2 ? "opacity-100" : "opacity-0"}`}>
              <Ionicons
                name={analysisStep >= 3 ? "checkmark-circle" : "sync-outline"}
                size={20}
                color={analysisStep >= 3 ? "#16A34A" : "#D4AF37"}
              />
              <Text className="text-white font-inter-semibold text-sm ml-3">
                Building your learning path
              </Text>
            </View>

            <View className={`flex-row items-center mt-3.5 ${analysisStep >= 3 ? "opacity-100" : "opacity-0"}`}>
              <Ionicons
                name={analysisStep >= 4 ? "checkmark-circle" : "sync-outline"}
                size={20}
                color={analysisStep >= 4 ? "#16A34A" : "#D4AF37"}
              />
              <Text className="text-white font-inter-semibold text-sm ml-3">
                Personalizing your dashboard
              </Text>
            </View>

            <View className={`flex-row items-center mt-3.5 ${analysisStep >= 4 ? "opacity-100" : "opacity-0"}`}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#16A34A"
              />
              <Text className="text-brand-emerald font-inter-bold text-sm ml-3">
                Done!
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

