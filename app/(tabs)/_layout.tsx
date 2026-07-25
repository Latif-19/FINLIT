import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useUserStore } from "../../store/useUserStore";
import { getThemeVars } from "../../constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  const colorBlindMode = useUserStore((s) => s.colorBlindMode);
  const appThemeColor = useUserStore((s) => s.appThemeColor);
  const themeVars = getThemeVars(colorBlindMode, appThemeColor);
  const insets = useSafeAreaInsets();

  const activeColor = themeVars["--color-brand-emerald"];
  const inactiveColor = themeVars["--color-brand-gray"];
  const tabBgColor = themeVars["--color-brand-bg"];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 6,
        },
        tabBarStyle: {
          backgroundColor: tabBgColor,
          borderTopColor: colorBlindMode === 'high-contrast' ? '#000000' : '#E2E8F0',
          borderTopWidth: colorBlindMode === 'high-contrast' ? 2 : 1,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 10),
          paddingBottom: insets.bottom > 0 ? insets.bottom + 2 : 12,
          paddingTop: 8,
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="news"
        options={{
          title: "News",
          tabBarIcon: ({ color }) => (
            <Ionicons name="newspaper" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={20} color={color} />
          ),
        }}
      />

      {/* Leaderboard accessible via Home screen Ranks button */}
      <Tabs.Screen
        name="leaderboard"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
