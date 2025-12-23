import ProgressSegments from "@/components/onboarding/ProgressSegments";
import { AppText } from "@/components/shared/AppText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onboardingStore } from "./store/onboardingStore";

export const Provinces = [
  {
    id: "GAUTENG",
    name: "Gauteng",
    pricing: "Inland (Reef)",
    emoji: "🏔️",
  },
  {
    id: "WESTERN_CAPE",
    name: "Western Cape",
    pricing: "Coastal",
    emoji: "🌊",
  },
  {
    id: "KWAZULU_NATAL",
    name: "KwaZulu-Natal",
    pricing: "Coastal",
    emoji: "🌊",
  },
  {
    id: "EASTERN_CAPE",
    name: "Eastern Cape",
    pricing: "Coastal",
    emoji: "🌊",
  },
  {
    id: "LIMPOPO",
    name: "Limpopo",
    pricing: "Inland (Reef)",
    emoji: "🏔️",
  },
  {
    id: "MPUMALANGA",
    name: "Mpumalanga",
    pricing: "Inland (Reef)",
    emoji: "🏔️",
  },
  {
    id: "NORTH_WEST",
    name: "North West",
    pricing: "Inland (Reef)",
    emoji: "🏔️",
  },
  {
    id: "FREE_STATE",
    name: "Free State",
    pricing: "Inland (Reef)",
    emoji: "🏔️",
  },
  {
    id: "NORTHERN_CAPE",
    name: "Northern Cape",
    pricing: "Inland (Reef)",
    emoji: "🏔️",
  },
];

export default function SelectProvince() {
  const [selected, setSelected] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!selected) return;
    
    onboardingStore.province = selected;
    onboardingStore.currentStep = 2;
    router.replace("/onboarding/select-role");
  };

  const handleBack = () => {
    onboardingStore.currentStep = 0;
    // slideIndex is already saved from when user was on the last slide
    // If it's not set, default to the last slide (index 3)
    if (onboardingStore.slideIndex === 0) {
      onboardingStore.slideIndex = 3;
    }
    router.replace("/onboarding");
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
        <View className="mb-4">
          <ProgressSegments current={1} total={3} className="mb-3" />
          <AppText className="text-sm font-medium text-gray-500 mb-1">
            Question 1/3
          </AppText>
          <AppText className="text-3xl font-bold text-gray-900 mb-1">
            Where are you located?
          </AppText>
          <AppText className="text-gray-600 mb-3">
            Select your province to help us personalize your experience.
          </AppText>
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <AppText className="text-sm text-blue-900 font-medium mb-1">
              Why do we need this?
            </AppText>
            <AppText className="text-xs text-blue-800">
              Fuel prices in South Africa differ between inland (Reef) and coastal areas. Your province determines which pricing applies to you.
            </AppText>
          </View>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {Provinces.map((province) => {
          const isSelected = selected === province.id;
          return (
            <Pressable
              key={province.id}
              onPress={() => setSelected(province.id)}
              className={`w-full p-4 rounded-2xl mb-3 border-2
              ${
                isSelected
                  ? "border-[#00AF54] bg-green-50"
                  : "border-gray-300 bg-white"
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3 flex-1">
                  <AppText className="text-2xl">{province.emoji}</AppText>
                  <View className="flex-1">
                    <AppText className="text-lg font-semibold text-gray-900">
                      {province.name}
                    </AppText>
                    <AppText className="text-xs text-gray-500 mt-0.5">
                      {province.pricing}
                    </AppText>
                  </View>
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
