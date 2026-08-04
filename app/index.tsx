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
      <Image
        source={require("../assets/images/finlit-logo.png")}
        className="w-40 h-40 mb-10"
        resizeMode="contain"
      />

      <View className="absolute bottom-20 w-64 items-center">
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