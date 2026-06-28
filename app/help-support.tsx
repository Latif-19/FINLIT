import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Pressable,
  StyleSheet,
  Linking,
} from 'react-native';
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Help {"&"} Support</Text>
          <Text style={styles.headerSubtitle}>
            Find answers and get in touch
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* FAQ Section */}
        <Text style={styles.sectionLabel}>FREQUENTLY ASKED QUESTIONS</Text>
        <View style={styles.card}>
          {FAQ_DATA.map((item, index) => (
            <React.Fragment key={index}>
              <Pressable
                onPress={() => toggleFAQ(index)}
                style={styles.faqRow}
              >
                <View style={styles.faqQuestionContainer}>
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color="#15803d"
                    style={styles.faqIcon}
                  />
                  <Text style={styles.faqQuestion}>{item.question}</Text>
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
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswer}>{item.answer}</Text>
                </View>
              )}
              {index < FAQ_DATA.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Contact Section */}
        <Text style={styles.sectionLabel}>CONTACT US</Text>
        <View style={styles.card}>
          <Pressable
            onPress={() => Linking.openURL('mailto:support@finlit.app')}
            style={styles.contactRow}
          >
            <View style={styles.contactIconContainer}>
              <Ionicons name="mail-outline" size={22} color="#15803d" />
            </View>
            <View style={styles.contactTextContainer}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactValue}>support@finlit.app</Text>
            </View>
            <Ionicons name="open-outline" size={18} color="#9ca3af" />
          </Pressable>
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Ionicons name="leaf-outline" size={18} color="#9ca3af" />
          <Text style={styles.versionText}>
            FinLit v2.0.0 — Built for CodeQuest 2026
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  headerTextContainer: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    overflow: 'hidden',
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  faqQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  faqIcon: {
    marginRight: 10,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingLeft: 46,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 46,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  contactIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  contactValue: {
    fontSize: 13,
    color: '#15803d',
    marginTop: 2,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    gap: 8,
  },
  versionText: {
    fontSize: 13,
    color: '#9ca3af',
  },
});
