import ProgressSegments from "@/components/onboarding/ProgressSegments";
import { AppText } from "@/components/shared/AppText";
import { ROLES } from "@/data/onboarding";
import { onboardingStore } from "@/store/onboardingStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SelectRole() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
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
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-10">
        <Pressable
          onPress={handleBack}
          className="mb-4 w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#FFFFFF" : "#000000"} />
        </Pressable>
        <View className="mb-6">
          <ProgressSegments current={2} total={3} className="mb-3" />
          <AppText className="text-sm font-medium text-muted-foreground mb-1">
            Question 2/3
          </AppText>
          <AppText className="text-3xl font-bold text-foreground mb-1">
            What type of role are you?
          </AppText>
          <AppText className="text-muted-foreground">
            Select one to tailor the app experience to your needs.
          </AppText>
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {ROLES.map((opt) => {
          const isSelected = selected === opt.id;
          const isDisabled = opt.disabled;
          return (
            <Pressable
              key={opt.id}
              disabled={isDisabled}
              onPress={() => setSelected(opt.id)}
              className={`w-full p-4 rounded-2xl mb-3 border-2 relative
              ${
                isSelected
                  ? "border-green-500 bg-green-500/10"
                  : isDisabled
                  ? "border-border/50 bg-card/50 opacity-60"
                  : "border-border bg-card"
              }`}
            >
              <View className="flex-row items-start gap-3">
                <View
                  className={`w-10 h-10 rounded-xl items-center justify-center ${opt.iconBg}`}
                >
                  <Ionicons name={opt.iconName} size={22} color={opt.iconColor} />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <AppText className="text-lg font-semibold text-foreground">
                        {opt.title}
                    </AppText>
                    {isDisabled && (
                        <View className="bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                            <AppText className="text-[10px] font-bold text-primary uppercase">Coming Soon</AppText>
                        </View>
                    )}
                  </View>
                  <AppText className="text-muted-foreground mt-1 text-sm">
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
            ${selected ? "bg-primary" : "bg-muted"}`}
        >
          <AppText className="text-primary-foreground font-semibold text-base">
            Continue
          </AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
