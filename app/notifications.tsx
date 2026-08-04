import { router, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  Text,
  View,
  Pressable,
  Switch,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from "@/hooks/useThemeColors";
import { notificationService } from '../services/notifications';
import { AppNotification } from '../types/api';
import { useUserStore } from '../store/useUserStore';

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

const NOTIFICATION_ICONS: Record<AppNotification["type"], { icon: IoniconsName; color: string; bg: string }> = {
  lesson_reminder: { icon: "book-outline", color: "#16A34A", bg: "bg-green-50" },
  streak_reminder: { icon: "flame-outline", color: "#F59E0B", bg: "bg-amber-50" },
  badge_earned: { icon: "trophy-outline", color: "#7C3AED", bg: "bg-purple-50" },
  leaderboard_milestone: { icon: "podium-outline", color: "#2563EB", bg: "bg-blue-50" },
};

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function NotificationCard({ notification }: { notification: AppNotification }) {
  const style = NOTIFICATION_ICONS[notification.type];
  return (
    <View className={`flex-row items-start p-4 ${notification.read ? "opacity-60" : ""}`}>
      <View className={`w-10 h-10 rounded-xl ${style.bg} justify-center items-center mr-3`}>
        <Ionicons name={style.icon} size={20} color={style.color} />
      </View>
      <View className="flex-1 mr-2">
        <View className="flex-row items-center gap-2">
          <Text className="text-[14px] font-inter-semibold text-brand-textPrimary flex-1" numberOfLines={1}>
            {notification.title}
          </Text>
          {!notification.read && (
            <View className="w-2 h-2 rounded-full bg-brand-emerald" />
          )}
        </View>
        <Text className="text-[12px] text-brand-gray mt-0.5 leading-[16px]" numberOfLines={2}>
          {notification.body}
        </Text>
        <Text className="text-[10px] text-brand-gray mt-1 font-inter-medium">
          {getTimeAgo(notification.createdAt)}
        </Text>
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  const colors = useThemeColors();
  const notificationPrefs = useUserStore((s) => s.notificationPrefs);
  const setNotificationPref = useUserStore((s) => s.setNotificationPref);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await notificationService.getNotifications();
      setNotifications(res.data);
    } catch {
      // Offline — keep whatever is already shown.
    }
  }, []);

  // Fetch the latest notifications each time the screen is focused.
  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [loadNotifications])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  }, [loadNotifications]);

  const handleToggle = (key: string) => {
    setNotificationPref(key, !notificationPrefs[key]);
  };

  const markAllRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    // Optimistic: mark everything read locally right away.
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await Promise.all(unread.map((n) => notificationService.markAsRead(n.id)));
    } catch {
      // Offline — optimistic state stays; will re-sync on next focus.
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderToggleRow = (item: NotificationItem) => (
    <View key={item.key} className="flex-row items-center py-3.5 px-4">
      <View className="w-[38px] h-[38px] rounded-[10px] bg-brand-emerald/10 justify-center items-center mr-3">
        <Ionicons name={item.icon} size={22} color={colors.emerald} />
      </View>
      <View className="flex-1 mr-3">
        <Text className="text-[15px] font-inter-semibold text-brand-textPrimary">{item.title}</Text>
        <Text className="text-xs text-brand-gray mt-0.5">{item.description}</Text>
      </View>
      <Switch
        value={notificationPrefs[item.key] ?? item.defaultValue}
        onValueChange={() => handleToggle(item.key)}
        trackColor={{ false: '#e2e8f0', true: '#16A34A' }}
        thumbColor="#ffffff"
      />
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-4 pb-3">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-brand-bg justify-center items-center border border-brand-border">
          <Ionicons name="arrow-back" size={24} color={colors.dark} />
        </Pressable>
        <View className="ml-3 flex-1">
          <Text className="text-[22px] font-inter-bold text-brand-textPrimary">Notifications</Text>
          <Text className="text-sm text-brand-gray mt-0.5">
            Manage how FinLit keeps you on track
          </Text>
        </View>
        {unreadCount > 0 && (
          <Pressable
            onPress={markAllRead}
            className="px-3 py-1.5 bg-brand-emerald/10 rounded-lg border border-brand-emerald/20"
          >
            <Text className="text-brand-emerald text-[10px] font-inter-bold uppercase tracking-wider">
              Mark All Read
            </Text>
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#16A34A" />}
      >
        {/* Recent Notifications */}
        <Text className="text-xs font-inter-semibold text-brand-gray tracking-wider mt-4 mb-2.5 ml-1">
          RECENT {unreadCount > 0 ? `(${unreadCount} UNREAD)` : ""}
        </Text>
        <View className="bg-brand-bg rounded-2xl border border-brand-border overflow-hidden mb-4">
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <NotificationCard notification={notification} />
                {index < notifications.length - 1 && (
                  <View className="h-px bg-brand-slateBg ml-[72px]" />
                )}
              </React.Fragment>
            ))
          ) : (
            <View className="py-10 items-center">
              <Ionicons name="notifications-off-outline" size={32} color={colors.gray} />
              <Text className="text-brand-gray text-sm mt-3 font-inter-medium">No notifications yet</Text>
            </View>
          )}
        </View>

        {/* Learning Section */}
        <Text className="text-xs font-inter-semibold text-brand-gray tracking-wider mt-4 mb-2.5 ml-1">LEARNING</Text>
        <View className="bg-brand-bg rounded-2xl border border-brand-border overflow-hidden">
          {LEARNING_ITEMS.map((item, index) => (
            <React.Fragment key={item.key}>
              {renderToggleRow(item)}
              {index < LEARNING_ITEMS.length - 1 && (
                <View className="h-px bg-brand-slateBg ml-[66px]" />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Social & News Section */}
        <Text className="text-xs font-inter-semibold text-brand-gray tracking-wider mt-6 mb-2.5 ml-1">SOCIAL {"&"} NEWS</Text>
        <View className="bg-brand-bg rounded-2xl border border-brand-border overflow-hidden">
          {SOCIAL_ITEMS.map((item, index) => (
            <React.Fragment key={item.key}>
              {renderToggleRow(item)}
              {index < SOCIAL_ITEMS.length - 1 && (
                <View className="h-px bg-brand-slateBg ml-[66px]" />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Info Banner */}
        <View className="flex-row items-start bg-brand-slateBg rounded-xl p-3.5 mt-6 gap-2.5">
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.gray}
          />
          <Text className="flex-1 text-[13px] text-brand-gray leading-[18px]">
            Push notifications require app permissions. You can manage these in
            your device settings.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
