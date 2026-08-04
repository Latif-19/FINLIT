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

import { ONBOARDING_SLIDES } from "@/data/onboarding";

const { width } = Dimensions.get("window");

const slides = ONBOARDING_SLIDES;


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
    <View className="flex-1 bg-brand-bg">
      {/* Header */}
      <View className="flex-row justify-between items-center px-6 pt-14">
        <Text className="text-[20px] font-inter-semibold text-brand-textPrimary">FinLit</Text>

        <Pressable onPress={handleSkip} className="active:opacity-70 py-2">
          <Text className="text-brand-gray font-inter-semibold text-sm">Skip</Text>
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
          <View style={{ width }} className="items-center px-8 justify-center">
            <Image
              source={item.image}
              resizeMode="contain"
              className="w-72 h-72 mb-8"
            />

            <Text className="text-[32px] font-inter-bold text-center text-brand-textPrimary mt-4 leading-[38px]">
              {item.title}
            </Text>

            <Text className="text-center text-brand-gray font-inter text-base mt-4 leading-6 px-2">
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Dots */}
      <View className="flex-row justify-center items-center mb-8">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full mx-1 ${
              currentIndex === index ? "bg-brand-emerald w-6" : "bg-brand-slateBg w-2"
            }`}
          />
        ))}
      </View>

      {/* Button */}
      <View className="px-6 pb-10">
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => ({
            transform: [{ scale: pressed ? 0.98 : 1 }],
            opacity: pressed ? 0.95 : 1,
          })}
          className="bg-brand-navy h-14 rounded-2xl justify-center items-center shadow-lg shadow-brand-navy/10"
        >
          <Text className="text-brand-textOnDark text-center font-inter-semibold text-base">
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
