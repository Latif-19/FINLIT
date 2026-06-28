import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  Pressable,
  Switch,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface NotificationItem {
  key: string;
  icon: IoniconsName;
  title: string;
  description: string;
  defaultValue: boolean;
}

const LEARNING_ITEMS: NotificationItem[] = [
  {
    key: 'dailyReminders',
    icon: 'notifications-outline',
    title: 'Daily Learning Reminders',
    description: 'Get reminded to complete your daily lesson',
    defaultValue: true,
  },
  {
    key: 'streakAlerts',
    icon: 'flame-outline',
    title: 'Streak Alerts',
    description: 'Receive alerts when your learning streak is at risk',
    defaultValue: true,
  },
  {
    key: 'quizReminders',
    icon: 'help-circle-outline',
    title: 'Quiz Reminders',
    description: 'Notification when new module quizzes are available',
    defaultValue: true,
  },
  {
    key: 'badgeAlerts',
    icon: 'trophy-outline',
    title: 'Badge & Achievement Alerts',
    description: 'Celebrate when you earn a new badge or milestone',
    defaultValue: true,
  },
];

const SOCIAL_ITEMS: NotificationItem[] = [
  {
    key: 'leaderboardUpdates',
    icon: 'podium-outline',
    title: 'Leaderboard Updates',
    description: 'Know when you climb or drop on the leaderboard',
    defaultValue: false,
  },
  {
    key: 'newsUpdates',
    icon: 'newspaper-outline',
    title: 'News & Market Updates',
    description: 'Get notified about new financial news articles',
    defaultValue: false,
  },
  {
    key: 'communityReplies',
    icon: 'chatbubbles-outline',
    title: 'Community Replies',
    description: 'Be notified when someone replies to your forum posts',
    defaultValue: false,
  },
];

export default function NotificationsScreen() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    [...LEARNING_ITEMS, ...SOCIAL_ITEMS].forEach((item) => {
      initial[item.key] = item.defaultValue;
    });
    return initial;
  });

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderToggleRow = (item: NotificationItem) => (
    <View key={item.key} style={styles.toggleRow}>
      <View style={styles.toggleIconContainer}>
        <Ionicons name={item.icon} size={22} color="#15803d" />
      </View>
      <View style={styles.toggleTextContainer}>
        <Text style={styles.toggleTitle}>{item.title}</Text>
        <Text style={styles.toggleDescription}>{item.description}</Text>
      </View>
      <Switch
        value={toggles[item.key]}
        onValueChange={() => handleToggle(item.key)}
        trackColor={{ false: '#d1d5db', true: '#15803d' }}
        thumbColor="#ffffff"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            Manage how FinLit keeps you on track
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Learning Section */}
        <Text style={styles.sectionLabel}>LEARNING</Text>
        <View style={styles.card}>
          {LEARNING_ITEMS.map((item, index) => (
            <React.Fragment key={item.key}>
              {renderToggleRow(item)}
              {index < LEARNING_ITEMS.length - 1 && (
                <View style={styles.divider} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Social & News Section */}
        <Text style={styles.sectionLabel}>SOCIAL {"&"} NEWS</Text>
        <View style={styles.card}>
          {SOCIAL_ITEMS.map((item, index) => (
            <React.Fragment key={item.key}>
              {renderToggleRow(item)}
              {index < SOCIAL_ITEMS.length - 1 && (
                <View style={styles.divider} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#6b7280"
          />
          <Text style={styles.infoBannerText}>
            Push notifications require app permissions. You can manage these in
            your device settings.
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
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  toggleIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  toggleDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginLeft: 66,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 14,
    marginTop: 24,
    gap: 10,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
});
