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
      const isAuthenticated = useUserStore.getState().isAuthenticated;
      if (isAuthenticated) {
        router.replace("/(tabs)/home");
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
    <View className="flex-1 bg-white items-center justify-center">
      <Image
        source={require("../assets/images/finlit-logo.jpeg")}
        className="w-56 h-56"
        resizeMode="contain"
      />

      <Text className="text-4xl font-bold text-green-700 mt-4">
        
      </Text>

      <View className="absolute bottom-20 w-64 items-center">
        <Text className="text-gray-500 text-lg mb-3">
          Loading...
        </Text>

        <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <Animated.View
            style={{
              width: widthInterpolated,
              height: "100%",
              backgroundColor: "#166534",
            }}
          />
        </View>
      </View>
    </View>
  );
}