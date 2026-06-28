import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import "@/types/navigation";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("../assets/images/onboarding1.png"),
    title: "Set Financial Goals",
    description:
      "Define your savings and financial goals. Build a clear roadmap toward financial success.",
  },
  {
    id: "2",
    image: require("../assets/images/onboarding2.png"),
    title: "Track Your Progress",
    description:
      "Monitor your financial growth and stay motivated with real-time progress tracking.",
  },
  {
    id: "3",
    image: require("../assets/images/onboarding3.png"),
    title: "Celebrate Achievements",
    description:
      "Reach important milestones and celebrate every step toward financial freedom.",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.replace("/auth");
    }
  };

  const handleSkip = () => {
    router.replace("/auth");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-14">
        <Text></Text>

        <Pressable onPress={handleSkip}>
          <Text className="text-gray-500 font-semibold text-base">Skip</Text>
        </Pressable>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={{ width }} className="items-center px-8">
            <Image
              source={item.image}
              resizeMode="contain"
              className="w-80 h-80 mt-10"
            />

            <Text className="text-3xl font-bold text-center text-green-700 mt-6">
              {item.title}
            </Text>

            <Text className="text-center text-gray-500 text-base mt-4 leading-6">
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Dots */}
      <View className="flex-row justify-center mb-8">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full mx-1 ${
              currentIndex === index ? "bg-green-700 w-8" : "bg-gray-300 w-2"
            }`}
          />
        ))}
      </View>

      {/* Button */}
      <View className="px-6 pb-10">
        <Pressable
          onPress={handleNext}
          className="bg-green-700 rounded-xl py-4"
        >
          <Text className="text-white text-center font-bold text-lg">
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
