import { AppText } from "@/components/shared/AppText";
import { PROFIT_RANGES } from "@/data/onboarding";
import { onboardingStore } from "@/store/onboardingStore";
import { ProfitPeriod } from "@/types/onboarding";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;



export default function TargetProfit() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Theme colors
  const primaryColor = isDark ? "#0A84FF" : "#007AFF";
  const foregroundColor = isDark ? "#FFFFFF" : "#1F2937";
  const mutedColor = isDark ? "#292929" : "#E5E7EB"; // Slider max track color
  
  const [selectedPeriod, setSelectedPeriod] = useState<ProfitPeriod>("daily");
  const [profit, setProfit] = useState(PROFIT_RANGES.daily.min);
  
  const range = PROFIT_RANGES[selectedPeriod];

  // Update profit when range changes (period switch)
  useEffect(() => {
    setProfit(range.min);
  }, [selectedPeriod]);

  const handleContinue = async () => {
    onboardingStore.targetProfit = {
      period: selectedPeriod,
      amount: profit,
    };
    onboardingStore.currentStep = 4;
    router.replace("/onboarding/insights-loading");
  };

  const handleSkip = async () => {
    onboardingStore.currentStep = 4;
    router.replace("/onboarding/insights-loading");
  };

  const handleBack = () => {
    onboardingStore.currentStep = 3;
    router.replace("/onboarding/add-vehicle");
  };

  const formatCurrency = (amount: number) => {
    return `R ${amount.toLocaleString("en-ZA")}`;
  };

  const handlePeriodChange = (period: ProfitPeriod) => {
    if (period !== selectedPeriod) {
      setSelectedPeriod(period);
    }
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
          <AppText className="text-3xl font-bold text-foreground mb-1">
            Set Your Target Profit
          </AppText>
          <AppText className="text-muted-foreground">
            Choose your profit goal to help us personalize your experience. You can skip this step.
          </AppText>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View 
          className="bg-card rounded-2xl p-6 border border-border"
          style={{
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View className="mb-6">
            <View className="flex-row bg-muted rounded-xl p-1">
              {(["daily", "weekly", "monthly"] as ProfitPeriod[]).map((period) => {
                const isSelected = selectedPeriod === period;
                const labels = {
                  daily: "Daily",
                  weekly: "Weekly",
                  monthly: "Monthly",
                };
                return (
                  <Pressable
                    key={period}
                    onPress={() => handlePeriodChange(period)}
                    className={`flex-1 py-3 rounded-lg items-center ${
                      isSelected ? "bg-card" : ""
                    }`}
                    style={isSelected ? {
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 1,
                      },
                      shadowOpacity: 0.05,
                      shadowRadius: 2,
                      elevation: 2,
                    } : undefined}
                  >
                    <AppText
                      className={`text-sm font-semibold ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {labels[period]}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="mb-2 items-center">
             <AppText className="text-sm text-primary font-bold capitalize">
              {selectedPeriod} target
            </AppText>
            <AppText className="text-6xl font-extrabold text-foreground mb-1">
              {formatCurrency(profit)}
            </AppText>
            <AppText className="text-xs text-muted-foreground mt-2 font-medium">
              Use the slider to set your target
            </AppText>
          </View>

          {/* Slider */}
          <View className="mb-4">
            <View style={{ alignItems: 'center' }}>
              <Slider
                key={selectedPeriod} // Force re-render when period changes to reset min/max correctly
                style={{ width: SCREEN_WIDTH - 88, height: 40 }}
                minimumValue={range.min}
                maximumValue={range.max}
                step={range.step}
                value={profit}
                onValueChange={(val) => setProfit(Math.round(val))}
                minimumTrackTintColor={isDark ? "#60A5FA" : "#2563EB"}
                maximumTrackTintColor={isDark ? "#374151" : "#E5E7EB"}
                thumbTintColor={isDark ? "#60A5FA" : "#2563EB"}
              />
            </View>
          </View>
        </View>

        <View className="mt-2 bg-primary/10 p-4 rounded-xl flex-row gap-3 items-start">
          <Ionicons name="information-circle" size={20} color={primaryColor} style={{ marginTop: 2 }} />
          <AppText className="flex-1 text-sm text-primary leading-5">
            Setting a target helps you track real earnings after fuel costs, ensuring you hit your goals every shift.
          </AppText>
        </View>
      </ScrollView>

      <View className="px-5 pb-8 pt-4 gap-3">
        <Pressable
          onPress={handleContinue}
          className="h-14 rounded-xl items-center justify-center bg-primary"
        >
          <AppText className="text-primary-foreground font-semibold text-base">
            Set Goal & Continue
          </AppText>
        </Pressable>
        <Pressable
          onPress={handleSkip}
          className="h-14 rounded-xl items-center justify-center"
        >
          <AppText className="text-primary font-semibold text-base">
            I'll do this later
          </AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
