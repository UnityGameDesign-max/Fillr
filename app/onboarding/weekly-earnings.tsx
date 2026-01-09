import ProgressSegments from "@/components/onboarding/ProgressSegments";
import { AppText } from "@/components/shared/AppText";
import { fontFamily } from "@/lib/fontFamily";
import { onboardingStore } from "@/store/onboardingStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WeeklyEarnings() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [earnings, setEarnings] = useState("");
  const [includeCashAndCard, setIncludeCashAndCard] = useState(false);

  // Theme colors
  const primaryColor = isDark ? "#0A84FF" : "#007AFF";
  const foregroundColor = isDark ? "#FFFFFF" : "#1F2937";

  const handleContinue = async () => {
    const earningsValue = parseFloat(earnings.replace(/[^0-9.]/g, ""));
    if (isNaN(earningsValue)) return;

    onboardingStore.weeklyEarnings = earningsValue;
    onboardingStore.earningsIncludesCashAndCard = includeCashAndCard;
    onboardingStore.currentStep = 5; // Move to next step index
    router.replace("/onboarding/target-profit");
  };

  const handleSkip = async () => {
    onboardingStore.weeklyEarnings = null;
    onboardingStore.earningsIncludesCashAndCard = false;
    onboardingStore.currentStep = 5;
    router.replace("/onboarding/target-profit");
  };

  const handleBack = () => {
    onboardingStore.currentStep = 3; // Go back to add-vehicle
    router.replace("/onboarding/add-vehicle");
  };

  const showTooltip = () => {
    // No-op for now, visual only
  };

  const isValid = earnings.trim().length > 0;

  const handleEarningsChange = (text: string) => {
    // Remove non-numeric chars except for decimal point (optional, but let's keep it simple integers for now or basic format)
    const cleaned = text.replace(/[^0-9]/g, "");
    // Format with commas
    if (!cleaned) {
        setEarnings("");
        return;
    }
    const formatted = parseInt(cleaned).toLocaleString("en-ZA");
    setEarnings(formatted);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 pt-10">
        <Pressable
          onPress={handleBack}
          className="mb-4 w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color={foregroundColor} />
        </Pressable>
        <View className="mb-6">
          <ProgressSegments current={4} total={5} className="mb-3" />
          <AppText className="text-sm font-medium text-muted-foreground mb-1">
            Question 4/5
          </AppText>
          <AppText className="text-3xl font-bold text-foreground mb-1">
            Total Earnings
          </AppText>
          <AppText className="text-muted-foreground">
            Enter your average weekly earnings to track your baseline.
          </AppText>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="bg-card rounded-3xl border border-blue-200 overflow-hidden mb-6" style={{ borderColor: isDark ? '#1e3a8a' : '#bfdbfe' }}>
            <View className="p-6 pb-10 bg-card">
                <AppText className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                AMOUNT (ZAR)
                </AppText>

                <View className="flex-row items-center">
                    <AppText 
                        className={`text-4xl font-extrabold mr-1 ${earnings ? 'text-foreground' : 'text-muted-foreground/50'}`}
                        style={{ lineHeight: 40 }}
                    >
                        R
                    </AppText>
                    <TextInput
                        value={earnings}
                        onChangeText={handleEarningsChange}
                        placeholder="0"
                        keyboardType="numeric"
                        className="flex-1 text-4xl font-medium  text-foreground"
                        style={{ 
                            paddingVertical: 0,
                            fontFamily: fontFamily.extraBold,
                            lineHeight: 40,
                            height: 40
                        }}
                        placeholderTextColor={isDark ? "#374151" : "#E5E7EB"}
                        placeholderClassName="mt-2"
                    />
                </View>
            </View>

            <Pressable
              onPress={() => setIncludeCashAndCard(!includeCashAndCard)}
              className="flex-row items-center px-6 py-4 bg-muted/30 border-t border-border/50"
            >
              <View
                className={`w-6 h-6 rounded-full border mr-3 items-center justify-center ${
                  includeCashAndCard
                    ? "bg-green-500 border-green-500"
                    : "border-muted-foreground bg-transparent"
                }`}
              >
                {includeCashAndCard && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <AppText className="text-foreground flex-1 font-medium">
                Include cash and card trips
              </AppText>
            </Pressable>
          </View>

          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex-row gap-3 items-start border border-blue-100 dark:border-blue-800">
            <View className="mt-1">
                 <Ionicons name="bulb" size={20} color={isDark ? "#60A5FA" : "#2563EB"} />
            </View>
            <View className="flex-1">
                <AppText className="text-base font-bold text-blue-600 dark:text-blue-400 mb-1">
                    Why do we need this?
                </AppText>
                <AppText className="text-sm text-foreground/80 leading-5">
                    Setting a baseline helps Fillr calculate your <AppText className="font-bold">Net Profit</AppText> accurately as you add fuel expenses later.
                </AppText>
            </View>
          </View>
        </ScrollView>

        <View className="px-5 pb-5">
          <Pressable
            onPress={handleContinue}
            disabled={!isValid}
            className={`w-full py-4 rounded-xl items-center justify-center mb-3 ${
              isValid ? "bg-primary" : "bg-muted"
            }`}
          >
            <AppText
              className={`text-lg font-bold ${
                isValid ? "text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Continue
            </AppText>
          </Pressable>

          <Pressable
            onPress={handleSkip}
            className="w-full py-4 rounded-xl items-center justify-center"
          >
            <AppText className="text-lg font-medium text-muted-foreground">
              Skip
            </AppText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
