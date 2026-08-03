import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from "@/hooks/useThemeColors";
import { AVATAR_CHARACTERS } from '@/data/avatars';
import { useUserStore } from '@/store/useUserStore';
import { profileService } from '../services/profile';

const AVATAR_OPTIONS = AVATAR_CHARACTERS;

const GOAL_OPTIONS = [
  "Build an Emergency Fund",
  "Improve Budgeting",
  "Learn Investing",
  "Become Debt Free",
  "Start a Business",
  "Save for Education",
];

export default function PersonalDetailsScreen() {
  const colors = useThemeColors();
  const storeName = useUserStore((s) => s.name);
  const storeEmail = useUserStore((s) => s.email);
  const storeAge = useUserStore((s) => s.age);
  const storePhone = useUserStore((s) => s.phone);
  const avatar = useUserStore((s) => s.avatar);
  const goal = useUserStore((s) => s.goal);
  const isPremium = useUserStore((s) => s.isPremium);

  const [name, setName] = useState(storeName);
  const [email, setEmail] = useState(storeEmail);
  const [age, setAge] = useState(storeAge);
  const [phone, setPhone] = useState(storePhone);
  const [selectedGoal, setSelectedGoal] = useState(goal);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => { setName(storeName); }, [storeName]);
  useEffect(() => { setEmail(storeEmail); }, [storeEmail]);
  useEffect(() => { setAge(storeAge); }, [storeAge]);
  useEffect(() => { setPhone(storePhone); }, [storePhone]);
  useEffect(() => { setSelectedGoal(goal); }, [goal]);

  const handleSelectAvatar = (emoji: string) => {
    useUserStore.getState().setAvatar(emoji);
  };

  const handleSave = async () => {
    const store = useUserStore.getState();
    // Optimistic local update for instant feedback.
    if (name.trim()) store.setName(name);
    store.setEmail(email);
    store.setAge(age);
    store.setPhone(phone);
    if (selectedGoal) store.setGoal(selectedGoal);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);

    // Persist name / avatar / age / phone to the backend.
    try {
      const res = await profileService.updateProfile({
        name: name.trim() || store.name,
        avatar: useUserStore.getState().avatar,
        age,
        phone,
        goal: selectedGoal || undefined,
      });
      useUserStore.getState().setAuthenticatedUser(res.data);
    } catch {
      // Offline — the optimistic local update already applied.
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-brand-slateBg">
      {/* Success Toast */}
      {showToast && (
        <View className="absolute top-14 left-6 right-6 z-50 bg-brand-emerald rounded-2xl px-5 py-3.5 flex-row items-center shadow-lg">
          <Ionicons name="checkmark-circle" size={22} color="white" />
          <Text className="text-white font-inter-bold text-sm ml-2.5">Changes saved successfully!</Text>
        </View>
      )}

      {/* Header */}
      <View className="bg-brand-bg px-5 pt-14 pb-5 border-b border-brand-border flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 bg-brand-slateBg rounded-full items-center justify-center mr-3 border border-brand-border"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Ionicons name="arrow-back" size={20} color={colors.navy} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-xl font-inter-bold text-brand-navy">Personal Details</Text>
          <Text className="text-brand-gray text-xs font-inter mt-0.5">Manage your profile information</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>

        {/* ── PERSONAL INFORMATION ── */}
        <View className="px-5 mt-6">
          <Text className="text-brand-gray text-[10px] font-inter-bold uppercase tracking-widest mb-3">Personal Information</Text>
          <View className="bg-brand-bg rounded-2xl border border-brand-border overflow-hidden shadow-sm">

            {/* Name */}
            <View className="p-4 border-b border-brand-border">
              <Text className="text-brand-gray text-xs font-inter-semibold uppercase tracking-wider mb-1.5">Name</Text>
              <TextInput
                className="text-brand-dark text-base font-inter-semibold bg-brand-slateBg/40 rounded-xl px-3.5 py-2.5 border border-brand-border"
                value={name}
                onChangeText={setName}
                onBlur={() => { if (name.trim()) useUserStore.getState().setName(name); }}
                placeholder="Your name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Email */}
            <View className="p-4 border-b border-brand-border">
              <Text className="text-brand-gray text-xs font-inter-semibold uppercase tracking-wider mb-1.5">Email</Text>
              <TextInput
                className="text-brand-dark text-base font-inter-semibold bg-brand-slateBg/40 rounded-xl px-3.5 py-2.5 border border-brand-border"
                value={email}
                onChangeText={setEmail}
                onBlur={() => useUserStore.getState().setEmail(email)}
                placeholder="you@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Age */}
            <View className="p-4 border-b border-brand-border">
              <Text className="text-brand-gray text-xs font-inter-semibold uppercase tracking-wider mb-1.5">Age</Text>
              <TextInput
                className="text-brand-dark text-base font-inter-semibold bg-brand-slateBg/40 rounded-xl px-3.5 py-2.5 border border-brand-border"
                value={age}
                onChangeText={setAge}
                onBlur={() => useUserStore.getState().setAge(age)}
                placeholder="e.g. 25"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
              />
            </View>

            {/* Phone */}
            <View className="p-4">
              <Text className="text-brand-gray text-xs font-inter-semibold uppercase tracking-wider mb-1.5">Phone</Text>
              <TextInput
                className="text-brand-dark text-base font-inter-semibold bg-brand-slateBg/40 rounded-xl px-3.5 py-2.5 border border-brand-border"
                value={phone}
                onChangeText={setPhone}
                onBlur={() => useUserStore.getState().setPhone(phone)}
                placeholder="+233 XX XXX XXXX"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* ── AVATAR ── */}
        <View className="px-5 mt-8">
          <Text className="text-brand-gray text-[10px] font-inter-bold uppercase tracking-widest mb-3">Avatar</Text>
          <View className="bg-brand-bg rounded-2xl border border-brand-border overflow-hidden shadow-sm p-5">

            {/* Current avatar */}
            <View className="items-center mb-5">
              <View className="w-20 h-20 bg-brand-emerald/10 rounded-full items-center justify-center border-4 border-brand-emerald">
                <Text className="text-4xl">{avatar}</Text>
              </View>
              <Text className="text-brand-gray text-xs font-inter mt-2">Tap below to change</Text>
            </View>

            {/* Emoji grid */}
            <View className="flex-row flex-wrap justify-center gap-3">
              {AVATAR_OPTIONS.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => handleSelectAvatar(emoji)}
                  style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.9 : 1 }] })}
                  className={`w-14 h-14 rounded-2xl items-center justify-center ${
                    avatar === emoji
                      ? 'bg-brand-emerald/10 border-2 border-brand-emerald'
                      : 'bg-brand-slateBg border border-brand-border'
                  }`}
                >
                  <Text className="text-2xl">{emoji}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* ── FINANCIAL PROFILE ── */}
        <View className="px-5 mt-8">
          <Text className="text-brand-gray text-[10px] font-inter-bold uppercase tracking-widest mb-3">Financial Profile</Text>
          <View className="bg-brand-bg rounded-2xl border border-brand-border overflow-hidden shadow-sm">

            {/* Goal */}
            <View className="p-4">
              <Text className="text-brand-gray text-xs font-inter-semibold uppercase tracking-wider mb-2">Financial Goal</Text>
              <View className="flex-row flex-wrap gap-2">
                {GOAL_OPTIONS.map((goalOption) => {
                  const isSelected = selectedGoal === goalOption;
                  return (
                    <Pressable
                      key={goalOption}
                      onPress={() => setSelectedGoal(goalOption)}
                      className={`px-3 py-2 rounded-full border ${
                        isSelected
                          ? 'bg-brand-emerald/10 border-brand-emerald'
                          : 'bg-brand-slateBg border-brand-border'
                      }`}
                    >
                      <Text className={`text-xs font-inter-semibold ${
                        isSelected ? 'text-brand-emerald' : 'text-brand-gray'
                      }`}>
                        🎯 {goalOption}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Subscription Tier */}
            <View className="p-4 flex-row items-center justify-between border-t border-brand-border">
              <View className="flex-1">
                <Text className="text-brand-gray text-xs font-inter-semibold uppercase tracking-wider mb-1">Subscription</Text>
                <View className={`px-3 py-1.5 rounded-full self-start mt-1 ${
                  isPremium ? 'bg-purple-100 border border-purple-200' : 'bg-brand-slateBg border border-brand-border'
                }`}>
                  <Text className={`text-xs font-inter-bold uppercase tracking-wider ${
                    isPremium ? 'text-purple-800' : 'text-brand-gray'
                  }`}>
                    {isPremium ? '💎 Premium' : '🆓 Free Tier'}
                  </Text>
                </View>
              </View>
              <Ionicons name="shield-checkmark-outline" size={16} color={colors.gray} />
            </View>
          </View>
        </View>

        {/* ── SAVE BUTTON ── */}
        <View className="px-5 mt-10">
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.98 : 1 }],
              opacity: pressed ? 0.9 : 1,
            })}
            className="bg-brand-emerald rounded-2xl py-4 items-center shadow-sm"
          >
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-inter-bold text-base ml-2">Save Changes</Text>
            </View>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
