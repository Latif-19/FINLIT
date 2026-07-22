import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Linking,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    question: 'What is FinLit?',
    answer:
      'FinLit is a mobile-first financial literacy app designed to educate users on personal finance through structured lessons, quizzes, interactive simulations, and gamified learning. It does not manage money — it builds lasting financial knowledge.',
  },
  {
    question: 'Is FinLit free?',
    answer:
      'Yes! FinLit offers a free tier with access to foundational modules, basic simulations, and limited quizzes. A Premium tier unlocks the full library, advanced simulations, AI Tutor, and downloadable certificates.',
  },
  {
    question: 'How does the assessment work?',
    answer:
      'The financial assessment evaluates your current knowledge across budgeting, saving, and investing. Based on your score and goals, FinLit creates a personalized learning path just for you.',
  },
  {
    question: 'How do I earn badges and XP?',
    answer:
      'Complete lessons, pass quizzes, and maintain daily learning streaks to earn XP points and unlock achievement badges. Check the leaderboard to see how you compare!',
  },
  {
    question: 'What are financial simulations?',
    answer:
      'Interactive tools that let you run what-if scenarios — like seeing how a GHS 2,000 loan at 25% interest works out, or projecting investment growth over time.',
  },
  {
    question: 'Is my data safe?',
    answer:
      'Absolutely. FinLit stores data in compliance with Ghana Data Protection Act, 2012. All API communication is encrypted via HTTPS/TLS 1.2+.',
  },
];

export default function HelpSupportScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white justify-center items-center border border-slate-100 active:opacity-80"
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <View className="ml-3">
          <Text className="text-[22px] font-inter-bold text-brand-dark">
            Help {"&"} Support
          </Text>
          <Text className="text-sm font-inter text-brand-gray mt-0.5">
            Find answers and get in touch
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* FAQ Section */}
        <Text className="text-xs font-inter-semibold text-brand-gray tracking-wider mt-6 mb-2.5 ml-1">
          FREQUENTLY ASKED QUESTIONS
        </Text>
        <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {FAQ_DATA.map((item, index) => (
            <React.Fragment key={index}>
              <Pressable
                onPress={() => toggleFAQ(index)}
                className="flex-row items-center justify-between py-3.5 px-4 active:opacity-80"
              >
                <View className="flex-row items-center flex-1 mr-3">
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color="#16A34A"
                    style={{ marginRight: 10 }}
                  />
                  <Text className="text-[15px] font-inter-semibold text-brand-dark flex-1">
                    {item.question}
                  </Text>
                </View>
                <Ionicons
                  name={
                    expandedIndex === index
                      ? 'chevron-up'
                      : 'chevron-down'
                  }
                  size={20}
                  color="#9ca3af"
                />
              </Pressable>
              {expandedIndex === index && (
                <View className="px-4 pb-3.5 pl-[46px]">
                  <Text className="text-sm font-inter text-brand-gray leading-[21px]">
                    {item.answer}
                  </Text>
                </View>
              )}
              {index < FAQ_DATA.length - 1 && (
                <View className="h-px bg-slate-100 ml-[46px]" />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Contact Section */}
        <Text className="text-xs font-inter-semibold text-brand-gray tracking-wider mt-6 mb-2.5 ml-1">
          CONTACT US
        </Text>
        <View className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <Pressable
            onPress={() => Linking.openURL('mailto:support@finlit.app')}
            className="flex-row items-center py-3.5 px-4 active:opacity-80"
          >
            <View className="w-[38px] h-[38px] rounded-[10px] bg-brand-emerald/10 justify-center items-center mr-3">
              <Ionicons name="mail-outline" size={22} color="#16A34A" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-inter-semibold text-brand-dark">
                Email Support
              </Text>
              <Text className="text-[13px] font-inter text-brand-emerald mt-0.5">
                support@finlit.app
              </Text>
            </View>
            <Ionicons name="open-outline" size={18} color="#9ca3af" />
          </Pressable>
        </View>

        {/* Version Info */}
        <View className="flex-row items-center justify-center mt-8 gap-2">
          <Ionicons name="leaf-outline" size={18} color="#9ca3af" />
          <Text className="text-[13px] font-inter text-brand-gray">
            FinLit v2.0.0 — Built for CodeQuest 2026
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
