import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View, ActivityIndicator, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const questions = [
  {
    question: "How do you track your daily expenses, including Mobile Money (MoMo) fees and E-levy?",
    options: [
      { text: "I don't track them at all", score: 1 },
      { text: "I track sometimes, but often ignore MoMo/E-levy fees", score: 2 },
      { text: "I record all expenses, including MoMo transaction costs", score: 3 },
    ],
  },
  {
    question: "Do you regularly save money?",
    options: [
      { text: "No, it's hard to save anything left over", score: 1 },
      { text: "Yes, occasionally in my MoMo wallet or bank account", score: 2 },
      { text: "Yes, a set amount every month, using automated saves", score: 3 },
    ],
  },
  {
    question: "Are you familiar with local investments in Ghana (e.g. Treasury Bills, Mutual Funds, GSE)?",
    options: [
      { text: "Not at all, I only know normal savings accounts", score: 1 },
      { text: "I've heard of T-Bills/Mutual Funds but don't know how to start", score: 2 },
      { text: "I actively invest in T-Bills or local mutual funds/stocks", score: 3 },
    ],
  },
  {
    question: "How prepared are you for an emergency (e.g. medical bill, urgent travel, laptop repair)?",
    options: [
      { text: "I'd have to borrow from friends or take a quick mobile loan", score: 1 },
      { text: "I have some cash put aside, but inflation eats into it", score: 2 },
      { text: "I have a dedicated emergency fund kept in a high-yield account", score: 3 },
    ],
  },
  {
    question: "What is your approach to borrowing money or digital loans (like Qwikloan, Fido, etc.)?",
    options: [
      { text: "I use quick mobile loans frequently for personal expenses", score: 1 },
      { text: "I only borrow when necessary, but find interest rates very high", score: 2 },
      { text: "I avoid high-interest digital loans and pay off debts promptly", score: 3 },
    ],
  },
];

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

  const handleSubmit = () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);

    setTimeout(() => {
      setAnalysisStep(1);
    }, 600);

    setTimeout(() => {
      setAnalysisStep(2);
    }, 1200);

    setTimeout(() => {
      setAnalysisStep(3);
    }, 1800);

    setTimeout(() => {
      setAnalysisStep(4);
    }, 2400);

    setTimeout(() => {
      const totalScore = answers.reduce((a, b) => a + b, 0);
      setIsAnalyzing(false);
      router.push({
        pathname: "/assessment-result",
        params: {
          score: totalScore.toString(),
          goal: selectedGoal,
        },
      });
    }, 3200);
  };

  const totalQuestions = questions.length + 1; // 5 knowledge questions + 1 goal question
  const completedCount = answers.filter((answer) => answer > 0).length + (selectedGoal ? 1 : 0);
  const completed = completedCount === totalQuestions;
  const progressPercentage = (completedCount / totalQuestions) * 100;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Decorative Accent Background */}
      <View className="absolute top-0 left-0 right-0 h-64 bg-green-800/10 rounded-b-[100px] -z-10" />

      {/* Header Container */}
      <View className="flex-row items-center px-6 pt-14 pb-4">
        {/* Back Button */}
        <Pressable
          onPress={() => router.back()}
          className="p-2.5 bg-white rounded-full shadow-sm border border-gray-100 active:opacity-80"
        >
          <Ionicons name="arrow-back" size={22} color="#15803d" />
        </Pressable>
        <Text className="text-xl font-extrabold text-green-950 ml-4 flex-1 text-center pr-10">
          Assessment
        </Text>
      </View>

      {/* Progress Bar */}
      <View className="px-6 mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-500 font-semibold text-xs uppercase tracking-wider">
            Progress
          </Text>
          <Text className="text-green-700 font-bold text-xs">
            {completedCount} / {totalQuestions} Questions
          </Text>
        </View>
        <View className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <View
            style={{ width: `${progressPercentage}%` }}
            className="h-full bg-green-700 rounded-full"
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="px-6"
      >
        {/* Branding header */}
        <View className="items-center mb-6">
          <Text className="text-3xl font-extrabold text-green-950 text-center tracking-tight">
            Financial Literacy
          </Text>
          <Text className="text-gray-500 text-sm mt-1 text-center px-6">
            Help us personalize your roadmap and lessons to fit your knowledge base.
          </Text>
        </View>

        {/* Questions Map */}
        {questions.map((item, qIndex) => (
          <View
            key={qIndex}
            className="bg-white rounded-3xl p-5 border border-gray-100 mb-6 shadow-sm"
          >
            <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
              Question {qIndex + 1}
            </Text>
            <Text className="text-lg font-bold text-gray-800 mb-4">
              {item.question}
            </Text>

            {item.options.map((option, oIndex) => {
              const isSelected = answers[qIndex] === option.score;
              return (
                <Pressable
                  key={oIndex}
                  onPress={() => handleSelect(qIndex, option.score)}
                  className={`p-4 rounded-2xl border mb-3 flex-row items-center justify-between active:opacity-80 active:scale-[0.99] transition-all duration-100 ${
                    isSelected
                      ? "bg-green-50 border-green-700 shadow-sm"
                      : "border-gray-200 bg-gray-50/20"
                  }`}
                >
                  <Text
                    className={`text-base font-semibold flex-1 ${
                      isSelected ? "text-green-800" : "text-gray-700"
                    }`}
                  >
                    {option.text}
                  </Text>
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                      isSelected
                        ? "border-green-700 bg-green-700"
                        : "border-gray-300 bg-white"
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
          <Text className="text-2xl font-black text-green-950 tracking-tight uppercase">
            YOUR FINANCIAL GOALS
          </Text>
          <Text className="text-gray-500 text-sm mt-1 leading-5">
            Tell us what you want to achieve so we can personalize your learning journey.
          </Text>
        </View>

        {/* Question 6 Card */}
        <View className="bg-white rounded-3xl p-5 border border-gray-100 mb-6 shadow-sm">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
            Question 6
          </Text>
          <Text className="text-lg font-bold text-gray-800 mb-4">
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
                className={`p-4 rounded-2xl border mb-3 flex-row items-center justify-between active:opacity-80 active:scale-[0.99] transition-all duration-100 ${
                  isSelected
                    ? "bg-green-50 border-green-700 shadow-sm"
                    : "border-gray-200 bg-gray-50/20"
                }`}
              >
                <Text
                  className={`text-base font-semibold flex-1 ${
                    isSelected ? "text-green-800" : "text-gray-700"
                  }`}
                >
                  {goalOption}
                </Text>
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                    isSelected
                      ? "border-green-700 bg-green-700"
                      : "border-gray-300 bg-white"
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
          className={`py-4 rounded-xl mt-4 shadow-sm items-center justify-center active:opacity-90 active:scale-[0.98] transition-all duration-100 ${
            completed ? "bg-green-700 active:bg-green-800" : "bg-gray-300"
          }`}
        >
          <Text
            className={`font-bold text-base ${
              completed ? "text-white" : "text-gray-500"
            }`}
          >
            View Results
          </Text>
        </Pressable>
      </ScrollView>

      {/* Loading Personalization Modal */}
      <Modal visible={isAnalyzing} transparent animationType="fade">
        <View className="flex-1 bg-green-950/95 items-center justify-center px-8">
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-white/10 rounded-full items-center justify-center mb-4">
              <ActivityIndicator size="large" color="#4ade80" />
            </View>
            <Text className="text-white text-2xl font-black tracking-tight text-center">
              Personalizing Your Experience
            </Text>
          </View>

          <View className="w-full max-w-xs space-y-4">
            <View className={`flex-row items-center mt-3.5 ${analysisStep >= 0 ? "opacity-100" : "opacity-30"}`}>
              <Ionicons
                name={analysisStep >= 1 ? "checkmark-circle" : "sync-outline"}
                size={20}
                color={analysisStep >= 1 ? "#4ade80" : "#a3e635"}
              />
              <Text className="text-white font-semibold text-sm ml-3">
                Analyzing your responses...
              </Text>
            </View>

            <View className={`flex-row items-center mt-3.5 ${analysisStep >= 1 ? "opacity-100" : "opacity-0"}`}>
              <Ionicons
                name={analysisStep >= 2 ? "checkmark-circle" : "sync-outline"}
                size={20}
                color={analysisStep >= 2 ? "#4ade80" : "#a3e635"}
              />
              <Text className="text-white font-semibold text-sm ml-3">
                Measuring your financial knowledge
              </Text>
            </View>

            <View className={`flex-row items-center mt-3.5 ${analysisStep >= 2 ? "opacity-100" : "opacity-0"}`}>
              <Ionicons
                name={analysisStep >= 3 ? "checkmark-circle" : "sync-outline"}
                size={20}
                color={analysisStep >= 3 ? "#4ade80" : "#a3e635"}
              />
              <Text className="text-white font-semibold text-sm ml-3">
                Building your learning path
              </Text>
            </View>

            <View className={`flex-row items-center mt-3.5 ${analysisStep >= 3 ? "opacity-100" : "opacity-0"}`}>
              <Ionicons
                name={analysisStep >= 4 ? "checkmark-circle" : "sync-outline"}
                size={20}
                color={analysisStep >= 4 ? "#4ade80" : "#a3e635"}
              />
              <Text className="text-white font-semibold text-sm ml-3">
                Personalizing your dashboard
              </Text>
            </View>

            <View className={`flex-row items-center mt-3.5 ${analysisStep >= 4 ? "opacity-100" : "opacity-0"}`}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color="#4ade80"
              />
              <Text className="text-[#4ade80] font-black text-sm ml-3">
                Done!
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

