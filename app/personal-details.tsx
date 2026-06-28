import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, View, Pressable, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../store/useUserStore';

const AVATAR_OPTIONS = ['🦉', '🦊', '🐺', '🦁', '🐯', '🦅', '🐸', '🎓'];

export default function PersonalDetailsScreen() {
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
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    setName(storeName);
  }, [storeName]);

  useEffect(() => {
    setEmail(storeEmail);
  }, [storeEmail]);

  useEffect(() => {
    setAge(storeAge);
  }, [storeAge]);

  useEffect(() => {
    setPhone(storePhone);
  }, [storePhone]);

  const handleSelectAvatar = (emoji: string) => {
    useUserStore.getState().setAvatar(emoji);
  };

  const handleSave = () => {
    const store = useUserStore.getState();
    if (name.trim()) store.setName(name);
    store.setEmail(email);
    store.setAge(age);
    store.setPhone(phone);

    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Success Toast */}
      {showToast && (
        <View className="absolute top-14 left-6 right-6 z-50 bg-green-700 rounded-2xl px-5 py-3.5 flex-row items-center shadow-lg">
          <Ionicons name="checkmark-circle" size={22} color="white" />
          <Text className="text-white font-bold text-sm ml-2.5">Changes saved successfully!</Text>
        </View>
      )}

      {/* Header */}
      <View className="bg-white px-5 pt-14 pb-5 border-b border-gray-200 flex-row items-center">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <Ionicons name="arrow-back" size={20} color="#374151" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-xl font-bold text-gray-800">Personal Details</Text>
          <Text className="text-gray-400 text-xs mt-0.5">Manage your profile information</Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 48 }}>

        {/* ── PERSONAL INFORMATION ── */}
        <View className="px-5 mt-6">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Personal Information</Text>
          <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

            {/* Name */}
            <View className="p-4 border-b border-gray-100">
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Name</Text>
              <TextInput
                className="text-gray-800 text-base font-semibold bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-200"
                value={name}
                onChangeText={setName}
                onBlur={() => { if (name.trim()) useUserStore.getState().setName(name); }}
                placeholder="Your name"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Email */}
            <View className="p-4 border-b border-gray-100">
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Email</Text>
              <TextInput
                className="text-gray-800 text-base font-semibold bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-200"
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
            <View className="p-4 border-b border-gray-100">
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Age</Text>
              <TextInput
                className="text-gray-800 text-base font-semibold bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-200"
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
              <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Phone</Text>
              <TextInput
                className="text-gray-800 text-base font-semibold bg-gray-50 rounded-xl px-3.5 py-2.5 border border-gray-200"
                value={phone}
                onChangeText={setPhone}
                onBlur={() => useUserStore.getState().setPhone(phone)}
                placeholder="+1 (555) 000-0000"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* ── AVATAR ── */}
        <View className="px-5 mt-8">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Avatar</Text>
          <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm p-5">

            {/* Current avatar */}
            <View className="items-center mb-5">
              <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center border-4 border-green-700">
                <Text className="text-4xl">{avatar}</Text>
              </View>
              <Text className="text-gray-500 text-xs mt-2">Tap below to change</Text>
            </View>

            {/* Emoji grid */}
            <View className="flex-row flex-wrap justify-center gap-3">
              {AVATAR_OPTIONS.map((emoji) => (
                <Pressable
                  key={emoji}
                  onPress={() => handleSelectAvatar(emoji)}
                  style={({ pressed }) => ({
                    transform: [{ scale: pressed ? 0.9 : 1 }],
                  })}
                  className={`w-14 h-14 rounded-2xl items-center justify-center ${
                    avatar === emoji
                      ? 'bg-green-100 border-2 border-green-700'
                      : 'bg-gray-50 border border-gray-200'
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
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Financial Profile</Text>
          <View className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

            {/* Goal */}
            <View className="p-4 border-b border-gray-100 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Financial Goal</Text>
                {goal ? (
                  <View className="bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-full self-start mt-1">
                    <Text className="text-blue-800 text-xs font-extrabold uppercase tracking-wider">
                      🎯 {goal}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-gray-400 text-sm mt-1">No goal set yet</Text>
                )}
              </View>
              <Ionicons name="lock-closed-outline" size={16} color="#9CA3AF" />
            </View>

            {/* Subscription Tier */}
            <View className="p-4 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Subscription</Text>
                <View className={`px-3 py-1.5 rounded-full self-start mt-1 ${
                  isPremium ? 'bg-purple-100 border border-purple-200' : 'bg-gray-100 border border-gray-200'
                }`}>
                  <Text className={`text-xs font-extrabold uppercase tracking-wider ${
                    isPremium ? 'text-purple-800' : 'text-gray-600'
                  }`}>
                    {isPremium ? '💎 Premium' : '🆓 Free Tier'}
                  </Text>
                </View>
              </View>
              <Ionicons name="shield-checkmark-outline" size={16} color="#9CA3AF" />
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
            className="bg-green-700 rounded-2xl py-4 items-center shadow-sm"
          >
            <View className="flex-row items-center">
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text className="text-white font-bold text-base ml-2">Save Changes</Text>
            </View>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
