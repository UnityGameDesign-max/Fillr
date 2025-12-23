import ProgressSegments from "@/components/onboarding/ProgressSegments";
import { AppText } from "@/components/shared/AppText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onboardingStore } from "./store/onboardingStore";

export const Role = [
  {
    id: "EHAILING",
    title: "Rideshare Driver",
    desc: "Best for drivers earning with e-hailing apps. Track income vs. fuel costs, route suggestions, and find the cheapest fuel.",
    icon: <Ionicons name="location" size={22} color="#F4B200" />,
    iconBg: "bg-yellow-100",
  },
  {
    id: "SOLO",
    title: "Regular Driver",
    desc: "Perfect for personal use. Monitor your daily commute, log fuel expenses, and gain driving insights to save money.",
    icon: <Ionicons name="car" size={22} color="#00AF54" />,
    iconBg: "bg-green-100",
  },
  {
    id: "FLEET",
    title: "Fleet Manager",
    desc: "Ideal for businesses. Oversee multiple vehicles, track fuel usage, and optimize routes for maximum efficiency.",
    icon: <Ionicons name="business" size={22} color="#007BFF" />,
    iconBg: "bg-blue-100",
  },
];

export default function SelectRole() {
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selected) return;
    
    onboardingStore.role = selected;
    
    onboardingStore.currentStep = 3;
    router.replace("/onboarding/add-vehicle");
  };

  const handleBack = () => {
    onboardingStore.currentStep = 1;
    router.replace("/onboarding/select-province");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      <View className="px-5 pt-10">
        <Pressable
          onPress={handleBack}
          className="mb-4 w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <View className="mb-6">
          <ProgressSegments current={2} total={3} className="mb-3" />
          <AppText className="text-sm font-medium text-gray-500 mb-1">
            Question 2/3
          </AppText>
          <AppText className="text-3xl font-bold text-gray-900 mb-1">
            What type of role are you?
          </AppText>
          <AppText className="text-gray-600">
            Select one to tailor the app experience to your needs.
          </AppText>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {Role.map((opt) => {
          const isSelected = selected === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => setSelected(opt.id)}
              className={`w-full p-4 rounded-2xl mb-3 border-2
              ${
                isSelected
                  ? "border-[#00AF54] bg-green-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <View className="flex-row items-start gap-3">
                <View
                  className={`w-10 h-10 rounded-xl items-center justify-center ${opt.iconBg}`}
                >
                  {opt.icon}
                </View>
                <View className="flex-1">
                  <AppText className="text-lg font-semibold text-gray-900">
                    {opt.title}
                  </AppText>
                  <AppText className="text-gray-600 mt-1 text-sm">
                    {opt.desc}
                  </AppText>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color="#00AF54" />
                )}
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="px-5 pb-8 pt-4">
        <Pressable
          disabled={!selected}
          onPress={handleContinue}
          className={`h-14 rounded-xl items-center justify-center 
            ${selected ? "bg-blue-600" : "bg-gray-300"}`}
        >
          <AppText className="text-white font-semibold text-base">
            Continue
          </AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
