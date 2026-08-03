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