import { router } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";
import "@/types/navigation";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

const PRESET_ANSWERS: Record<string, string> = {
  "How do Ghana Treasury Bills work?": 
    "Ghana Treasury Bills (T-Bills) are short-term debt instruments issued by the Bank of Ghana on behalf of the government. They are sold at a discount: for example, you buy a GH₵ 1,000 bill for GH₵ 800, and at maturity (91, 182, or 364 days), the government pays you the full GH₵ 1,000. The interest is risk-free and they currently yield around 24% - 28% annually, making them a very popular way to save securely.",

  "What are the rules for E-levy on MoMo?": 
    "In Ghana, the Electronic Transfer Levy (E-levy) is a 1% tax on electronic transactions. Key rules:\n1. Transfers to other people under GH₵ 100 per day are exempt (no tax).\n2. Transfers between your own accounts (e.g., your bank account to your own MoMo wallet) are exempt.\n3. Cash withdrawals at agents do not attract E-levy (but agent withdrawal charges still apply).\n4. Transfers above GH₵ 100 per day attract the 1% charge on the amount exceeding the first 100 GHS.",

  "Can you explain the SSNIT 3-Tier pension system?": 
    "Ghana's pension system is regulated by the NPRA and has three parts (Tiers):\n- Tier 1 (Mandatory): Managed by SSNIT. It is a monthly pension paid to you when you retire.\n- Tier 2 (Mandatory): Occupational pension managed by private trustees. Paid as a one-time lump sum at retirement.\n- Tier 3 (Voluntary): Personal pensions or provident funds. Offers tax benefits and allows you to make voluntary savings toward retirement or early withdrawal.",

  "What is Databank Mfund and how do I start?": 
    "Databank Money Market Fund (Mfund) is a popular collective investment scheme in Ghana. It pools funds from many investors to invest in short-term T-bills and bank deposits. Advantages:\n1. Low starting amount (typically GH₵ 50).\n2. High liquidity (you can withdraw your funds in 2-3 business days).\n3. Yields are usually higher than traditional bank savings accounts. You can start by visiting a Databank branch or using their mobile app/USSD code.",
};

const SUGGESTED_QUESTIONS = [
  "How do Ghana Treasury Bills work?",
  "What are the rules for E-levy on MoMo?",
  "Can you explain the SSNIT 3-Tier pension system?",
  "What is Databank Mfund and how do I start?",
];

// Offline fallback: if the AI service can't be reached (no network, no API key
// configured yet), fall back to keyword-matched preset answers so the tutor
// still responds instead of failing silently.
function getFallbackAnswer(text: string): string {
  const trimmed = text.trim();
  if (PRESET_ANSWERS[trimmed]) return PRESET_ANSWERS[trimmed];

  const lower = trimmed.toLowerCase();
  if (lower.includes("momo") || lower.includes("e-levy") || lower.includes("levy")) {
    return PRESET_ANSWERS["What are the rules for E-levy on MoMo?"];
  }
  if (lower.includes("treasury") || lower.includes("t-bill") || lower.includes("tbill")) {
    return PRESET_ANSWERS["How do Ghana Treasury Bills work?"];
  }
  if (lower.includes("ssnit") || lower.includes("pension") || lower.includes("retire")) {
    return PRESET_ANSWERS["Can you explain the SSNIT 3-Tier pension system?"];
  }
  if (lower.includes("databank") || lower.includes("mfund") || lower.includes("mutual")) {
    return PRESET_ANSWERS["What is Databank Mfund and how do I start?"];
  }
  return "I'm having trouble reaching my AI brain right now. Please check your connection and try again — or ask me about T-Bills, MoMo E-levy, SSNIT pensions, or local mutual funds.";
}

export default function AiTutorScreen() {
  const isPremium = useUserStore((s) => s.isPremium);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Hello! I am your FinLit AI Tutor. I can explain complex Ghanaian financial concepts (like SSNIT tiers, Treasury Bills, MoMo E-levy, or local mutual funds) in simple terms. Ask me anything!",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    // Check if free user has reached limit
    if (!isPremium && questionCount >= 2) {
      // Limit reached - do not allow more questions
      setMessages((prev) => [
        ...prev,
        {
          id: `limit-user-${Date.now()}`,
          sender: "user",
          text: text,
          timestamp: new Date(),
        },
        {
          id: `limit-ai-${Date.now()}`,
          sender: "ai",
          text: "🔒 You've used your 2 free AI Tutor questions for today! Upgrade to FinLit Premium for unlimited queries and advanced personal financial guidance.",
          timestamp: new Date(),
        },
      ]);
      setInputText("");
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
      return;
    }

    // Add user message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: text,
      timestamp: new Date(),
    };

    // Build the history we'll send to the AI (existing messages + this new one).
    // We exclude the local welcome bubble so the model isn't primed by it.
    const history = [...messages, userMsg]
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ sender: m.sender, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    setQuestionCount((q) => q + 1);

    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    // Call our server route, which proxies to the AI provider (key stays server-side).
    let responseText: string;
    try {
      const res = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok) throw new Error(`Tutor responded ${res.status}`);

      const data = (await res.json()) as { text?: string };
      responseText = data.text?.trim() || getFallbackAnswer(text);
    } catch (err) {
      console.warn("AI tutor request failed, using offline fallback:", err);
      responseText = getFallbackAnswer(text);
    }

    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: "ai",
      text: responseText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setIsTyping(false);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-6 pt-14 pb-4 bg-white border-b border-gray-100 shadow-sm">
        <Pressable
          onPress={() => router.back()}
          className="p-2 bg-gray-50 rounded-full border border-gray-100 active:opacity-80"
        >
          <Ionicons name="arrow-back" size={20} color="#15803d" />
        </Pressable>
        <View className="ml-4 flex-row items-center flex-1 justify-center pr-8">
          <Text className="text-xl font-extrabold text-green-950">AI Tutor</Text>
          <View className={`ml-2 px-2 py-0.5 rounded-full border ${
            isPremium ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"
          }`}>
            <Text className={`text-[9px] font-extrabold uppercase ${
              isPremium ? "text-green-800" : "text-amber-800"
            }`}>
              {isPremium ? "Premium" : "Free"}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
        className="flex-1"
      >
        {/* Chat Area */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ paddingVertical: 20 }}
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isAi = msg.sender === "ai";
            const isLock = msg.text.startsWith("🔒");

            return (
              <View
                key={msg.id}
                className={`flex-row mt-4 ${isAi ? "justify-start" : "justify-end"}`}
              >
                {isAi && (
                  <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-2 mt-1">
                    <Text className="text-sm">🤖</Text>
                  </View>
                )}

                <View
                  className={`max-w-[78%] p-4 rounded-2xl ${
                    isAi
                      ? isLock
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-white border border-gray-100 shadow-xs"
                      : "bg-green-700 text-white"
                  }`}
                >
                  <Text
                    className={`text-sm leading-5 font-semibold ${
                      isAi
                        ? isLock
                          ? "text-amber-950 font-bold"
                          : "text-gray-800"
                        : "text-white"
                    }`}
                  >
                    {msg.text}
                  </Text>
                  {isLock && (
                    <Pressable
                      onPress={() => {
                        router.push("/paywall");
                      }}
                      className="bg-amber-600 py-2 rounded-xl mt-3 items-center active:bg-amber-700"
                    >
                      <Text className="text-white text-xs font-bold">Upgrade to Premium</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}

          {isTyping && (
            <View className="flex-row mt-4 justify-start">
              <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-2 mt-1">
                <Text className="text-sm">🤖</Text>
              </View>
              <View className="bg-white border border-gray-100 rounded-2xl p-4 flex-row items-center">
                <ActivityIndicator size="small" color="#15803d" />
                <Text className="text-gray-400 text-xs font-semibold ml-2">Tutor is thinking...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Preset suggestions for Free/Premium */}
        {messages.length === 1 && (
          <View className="px-4 pb-3">
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2 pl-2">
              Suggested Questions
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <Pressable
                  key={q}
                  onPress={() => handleSend(q)}
                  className="bg-white border border-gray-200/80 rounded-full px-3.5 py-2 active:bg-green-50 active:border-green-200"
                >
                  <Text className="text-xs text-green-800 font-bold">{q}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Input Bar */}
        <View className="bg-white border-t border-gray-100 p-4 flex-row items-center">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask a financial question..."
            placeholderTextColor="#9ca3af"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-base text-gray-800 focus:border-green-700 mr-3"
            onSubmitEditing={() => handleSend(inputText)}
          />
          <Pressable
            onPress={() => handleSend(inputText)}
            disabled={!inputText.trim()}
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              inputText.trim() ? "bg-green-700 active:bg-green-800" : "bg-gray-200"
            }`}
          >
            <Ionicons
              name="send"
              size={18}
              color={inputText.trim() ? "white" : "#9ca3af"}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
