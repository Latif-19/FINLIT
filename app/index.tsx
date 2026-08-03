<<<<<<< HEAD
import { useEffect, useRef } from "react";
import { View, Image, Animated } from "react-native";
import { router } from "expo-router";
import { useUserStore } from "../store/useUserStore";
import "@/types/navigation";

export default function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 100,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      const isAuthenticated = useUserStore.getState().isAuthenticated;
      if (isAuthenticated) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/onboarding");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [progress]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="flex-1 bg-white items-center justify-center px-6 dark:bg-slate-950">
      <View className="items-center">
        <Image
          source={require("../assets/images/finlit-logo.png")}
          className="w-64 h-64"
          resizeMode="contain"
        />
      </View>

      <View className="absolute bottom-16 w-56 items-center">
        <View className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
          <Animated.View
            style={{
              width: widthInterpolated,
              height: "100%",
              backgroundColor: "#16A34A",
            }}
          />
        </View>
      </View>
    </View>
  );
}
=======
import { useEffect, useRef } from "react";
import { View, Text, Image, Animated } from "react-native";
import { router } from "expo-router";
import { useUserStore } from "../store/useUserStore";
import "@/types/navigation";

export default function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 100,
      duration: 4000,
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      const { isAuthenticated, lastAssessedAt } = useUserStore.getState();
      if (isAuthenticated) {
        router.replace(lastAssessedAt ? "/(tabs)/home" : "/assessment");
      } else {
        router.replace("/onboarding");
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [progress]);

  const widthInterpolated = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="flex-1 bg-brand-bg items-center justify-center px-6">
      <View className="items-center mb-8">
        <View className="w-32 h-32 bg-brand-bg rounded-3xl items-center justify-center shadow-md border border-brand-border overflow-hidden">
          <Image
            source={require("../assets/images/finlit-logo.jpeg")}
            className="w-28 h-28"
            resizeMode="contain"
          />
        </View>
        
        <Text className="text-[40px] font-inter-bold text-brand-navy mt-6 tracking-tight">
          FinLit
        </Text>
        <Text className="text-sm font-inter-semibold text-brand-gold uppercase tracking-widest mt-1">
          Financial Freedom Guide
        </Text>
      </View>

      <View className="absolute bottom-20 w-64 items-center">
        <Text className="text-brand-gray font-inter-medium text-sm mb-3">
          Loading your financial growth...
        </Text>

        <View className="w-full h-2 bg-brand-slateBg rounded-full overflow-hidden border border-brand-border">
          <Animated.View
            style={{
              width: widthInterpolated,
              height: "100%",
              backgroundColor: "#16A34A", // brand-emerald
            }}
          />
        </View>
      </View>
    </View>
  );
}
>>>>>>> f1861be95c2b5852f5a8ef673e00e9d0bec02c77
