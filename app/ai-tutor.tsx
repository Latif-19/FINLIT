import { router } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "../store/useUserStore";
import { tutorService } from "../services/tutor";
import { useThemeColors } from "../hooks/useThemeColors";
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

function getFallbackAnswer(text: string): string {
  const trimmed = text.trim();
  if (PRESET_ANSWERS[trimmed]) return PRESET_ANSWERS[trimmed];

  const lower = trimmed.toLowerCase();

  if (/^(hi|hello|hey|greetings|yoo|charley|good\s+morning|good\s+afternoon|good\s+evening)/i.test(lower)) {
    return "Hello! How can I help you today? I'm your FinLit AI Tutor, and I can answer questions about Ghanaian personal finance. You can ask me about Treasury Bills, MoMo E-levy rules, SSNIT pensions, or local mutual funds.";
  }
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
  return "I apologize, but I am currently offline and unable to connect to the online tutor database. Please check your network connection. In the meantime, I can assist you with pre-configured topics like Ghana Treasury Bills, MoMo E-levy rules, the SSNIT pension system, or local mutual funds. What would you like to know?";
}

export default function AiTutorScreen() {
  const colors = useThemeColors();
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

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return () => showSubscription.remove();
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    if (!isPremium && questionCount >= 2) {
      setMessages((prev) => [
        ...prev,
        { id: `limit-user-${Date.now()}`, sender: "user", text, timestamp: new Date() },
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

    // Prior conversation becomes context for the model.
    const history = messages.map((m) => ({
      role: (m.sender === "ai" ? "assistant" : "user") as "assistant" | "user",
      content: m.text,
    }));

    const userMsg: Message = { id: `user-${Date.now()}`, sender: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);
    setQuestionCount((q) => q + 1);
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      // Ask the backend (which proxies Gemini and unlocks the "Curious Mind" badge).
      const res = await tutorService.chat({ message: text, history });
      const aiMsg: Message = { id: `ai-${Date.now()}`, sender: "ai", text: res.data.reply, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      // Server down / tutor not configured — use the built-in canned answers.
      const aiMsg: Message = { id: `ai-${Date.now()}`, sender: "ai", text: getFallbackAnswer(text), timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">
      {/* ── HEADER ── */}
      <View className="flex-row items-center px-5 pt-2 pb-4 bg-white border-b border-slate-100">
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          className="w-10 h-10 bg-brand-slateBg rounded-full border border-slate-100 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={20} color={colors.navy} />
        </Pressable>

        <View className="flex-1 ml-4 flex-row items-center justify-center pr-10">
          <Text className="text-xl font-inter-bold text-brand-navy">AI Tutor</Text>
          <View
            className={`ml-2 px-2.5 py-0.5 rounded-full border ${
              isPremium
                ? "bg-brand-emerald/10 border-brand-emerald/20"
                : "bg-brand-gold/10 border-brand-gold/20"
            }`}
          >
            <Text
              className={`text-[9px] font-inter-bold uppercase tracking-wider ${
                isPremium ? "text-brand-emerald" : "text-brand-gold"
              }`}
            >
              {isPremium ? "Premium" : "Free"}
            </Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 100}
        className="flex-1"
      >
        {/* ── CHAT AREA ── */}
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
                  <View className="w-8 h-8 rounded-full bg-brand-emerald/10 items-center justify-center mr-2 mt-1">
                    <Text className="text-sm">🤖</Text>
                  </View>
                )}

                <View
                  className={`max-w-[78%] p-4 rounded-2xl ${
                    isAi
                      ? isLock
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-white border border-slate-100 shadow-sm"
                      : "bg-brand-emerald"
                  }`}
                >
                  <Text
                    className={`text-sm leading-5 font-inter-semibold ${
                      isAi
                        ? isLock
                          ? "text-amber-900 font-inter-bold"
                          : "text-brand-dark"
                        : "text-white"
                    }`}
                  >
                    {msg.text}
                  </Text>

                  {isLock && (
                    <Pressable
                      onPress={() => router.push("/paywall")}
                      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                      className="bg-amber-600 py-2 rounded-xl mt-3 items-center"
                    >
                      <Text className="text-white text-xs font-inter-bold">
                        Upgrade to Premium
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}

          {isTyping && (
            <View className="flex-row mt-4 justify-start">
              <View className="w-8 h-8 rounded-full bg-brand-emerald/10 items-center justify-center mr-2 mt-1">
                <Text className="text-sm">🤖</Text>
              </View>
              <View className="bg-white border border-slate-100 rounded-2xl p-4 flex-row items-center shadow-sm">
                <ActivityIndicator size="small" color={colors.emerald} />
                <Text className="text-brand-gray text-xs font-inter-semibold ml-2">
                  Tutor is thinking...
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* ── SUGGESTED QUESTIONS ── */}
        {messages.length === 1 && (
          <View className="px-4 pb-3">
            <Text className="text-brand-gray text-[10px] font-inter-bold uppercase tracking-widest mb-2 pl-1">
              Suggested Questions
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <Pressable
                  key={q}
                  onPress={() => handleSend(q)}
                  style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
                  className="bg-white border border-slate-200 rounded-full px-3.5 py-2 active:bg-brand-emerald/5 active:border-brand-emerald/30"
                >
                  <Text className="text-xs text-brand-navy font-inter-semibold">{q}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* ── INPUT BAR ── */}
        <View className="bg-white border-t border-slate-100 p-4 flex-row items-center gap-3">
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask a financial question..."
            placeholderTextColor="#94a3b8"
            className="flex-1 bg-brand-slateBg border border-slate-200 rounded-2xl px-4 py-3 text-base text-brand-dark font-inter"
            onSubmitEditing={() => handleSend(inputText)}
            onFocus={() => {
              setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
            }}
          />
          <Pressable
            onPress={() => handleSend(inputText)}
            disabled={!inputText.trim()}
            style={({ pressed }) => ({
              transform: [{ scale: pressed && inputText.trim() ? 0.95 : 1 }],
            })}
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              inputText.trim() ? "bg-brand-emerald" : "bg-slate-200"
            }`}
          >
            <Ionicons
              name="send"
              size={18}
              color={inputText.trim() ? "white" : "#94a3b8"}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
