import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/shared/components/AppText";
import { onboardingStore } from "./store/onboardingStore";
import { Dimensions, Pressable, View } from "react-native";
import PaginationElement from "./components/PaginationElement";
import { pages } from "./data";
import { router } from "expo-router";
import { useSharedValue } from "react-native-reanimated";

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

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SelectRole() {
  const [selected, setSelected] = useState<string | null>(null);
  const x = useSharedValue(0);

  const handleContinue = async () => {
    onboardingStore.currentStep = 2;
    // await SecureStore.s
  };

  const handleBack = () => {
    onboardingStore.currentStep = 0;
    onboardingStore.slideIndex = 2;
    router.replace("/onboarding");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB] px-5 py-10">
      <Pressable
        onPress={handleBack}
        className="mb-4 w-10 h-10 rounded-full items-center justify-center"
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>
      <AppText className="text-3xl font-bold text-gray-900 mb-1">
        Choose Your Role
      </AppText>
      <AppText className="mb-3">
        Select one to tailor the app experience to your needs.
      </AppText>

      {Role.map((opt) => {
        const isSelected = selected === opt.id;
        return (
          <Pressable
            key={opt.id}
            onPress={() => setSelected(opt.id)}
            className={`w-full p-4 rounded-2xl mb-4 border
            ${
              isSelected
                ? "border-[#00AF54] bg-green-50"
                : "border-gray-300 bg-white"
            }`}
          >
            <View className="flex-row gap-3">
              <View
                className={`w-10 h-10 rounded-xl items-center justify-center ${opt.iconBg}`}
              >
                {opt.icon}
              </View>
              <View className="flex-1">
                <AppText className="text-lg font-bold text-gray-900">
                  {opt.title}
                </AppText>
                <AppText className="text-gray-600 mt-1">{opt.desc}</AppText>
              </View>
            </View>
          </Pressable>
        );
      })}
      <View className="mt-auto items-center">
        <PaginationElement  />
      </View>
      <Pressable
        disabled={!selected}
        onPress={handleContinue}
        className={`mt-auto mb-8 h-14 rounded-xl items-center justify-center 
          ${selected ? "bg-blue-600" : "bg-gray-300"}`}
      >
        <AppText className="text-white font-semibold text-base">
          Continue
        </AppText>
      </Pressable>
    </SafeAreaView>
  );
}
