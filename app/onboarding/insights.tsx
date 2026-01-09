import { AppText } from "@/components/shared/AppText";
import Icon from "@/components/ui/icon";
import { onboardingStore } from "@/store/onboardingStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSnapshot } from "valtio";

export default function Insights() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const snap = useSnapshot(onboardingStore);

  const roleLabel =
    snap.role === "EHAILING"
      ? "Rideshare Driver"
      : snap.role === "SOLO"
      ? "Regular Driver"
      : snap.role === "FLEET"
      ? "Fleet Manager"
      : null;

  const targetLabel =
    snap.targetProfit
      ? `${snap.targetProfit.period} target of R ${snap.targetProfit.amount.toLocaleString("en-ZA")}`
      : null;

  const vehicleLabel =
    snap.vehicle
      ? `${snap.vehicle.make} ${snap.vehicle.model} • ${snap.vehicle.year} • ${snap.vehicle.fuelType}`
      : null;

  const provinceLabel = snap.province || null;

  const handleContinue = () => {
    onboardingStore.currentStep = 4;
    router.replace("/auth/sign-up");
  };

  const handleBack = () => {
    if (snap.role === "EHAILING") {
      onboardingStore.currentStep = 4;
      router.replace("/onboarding/target-profit");
    } else {
      onboardingStore.currentStep = 3;
      router.replace("/onboarding/add-vehicle");
    }
  };

  const cards: { title: string; desc: string; icon: string }[] = [];

  if (roleLabel) {
    if (snap.role === "EHAILING") {
      cards.push({
        title: "Income vs Fuel",
        desc:
          "We’ll help you track shifts, fuel costs, and highlight peak hours to hit your target efficiently.",
        icon: "Wallet",
      });
      cards.push({
        title: "Cheapest Routes",
        desc:
          "We prioritize routes and stations that reduce your per‑ride fuel cost based on live data.",
        icon: "Route",
      });
    } else if (snap.role === "SOLO") {
      cards.push({
        title: "Commute Cost Insights",
        desc:
          "We’ll estimate your monthly commute cost and suggest savings from smarter refuels.",
        icon: "TrendingDown",
      });
      cards.push({
        title: "Fuel Log Reminders",
        desc:
          "Get gentle reminders to log refuels so your efficiency trends stay accurate.",
        icon: "Bell",
      });
    } else if (snap.role === "FLEET") {
      cards.push({
        title: "Multi‑Vehicle Oversight",
        desc:
          "Track per‑vehicle fuel consumption and identify drivers or routes that need optimization.",
        icon: "Car",
      });
      cards.push({
        title: "Cost Reports",
        desc:
          "Export summaries that show week‑over‑week changes in fleet fuel and route efficiency.",
        icon: "FileChartLine",
      });
    }
  }

  if (vehicleLabel) {
    cards.push({
      title: "Efficiency Baseline",
      desc:
        "We’ll estimate your baseline consumption from your vehicle details and refine it as you log refuels.",
      icon: "Fuel",
    });
  }

  if (provinceLabel) {
    cards.push({
      title: "Local Fuel Trends",
      desc:
        `We tailor price comparisons for ${provinceLabel}, surfacing cheaper stations along frequent routes.`,
      icon: "MapPin",
    });
  }

  if (targetLabel) {
    cards.push({
      title: "Budget Thresholds",
      desc:
        `We align tips and alerts around your ${targetLabel}, helping you stay on track and adjust as needed.`,
      icon: "Target",
    });
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-10">
          <Pressable
            onPress={handleBack}
            className="mb-4 w-10 h-10 rounded-full items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? "#FFFFFF" : "#000000"} />
          </Pressable>
          <View className="mb-4 items-center">
            <AppText className="text-3xl font-bold text-center mb-1 text-foreground">
              {"Your "}
              <AppText className="text-3xl font-extrabold text-primary">
                Fillr
              </AppText>
              {" insights"}
            </AppText>
            <AppText className="text-muted-foreground text-center">
              Based on your answers, we’ve created personalized insights to help you with fuel tracking and manage your profits.
            </AppText>
          </View>
        </View>

        <View className="px-5">
          <View
            className="bg-card rounded-2xl p-6 border border-border mb-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 2,
            }}
          >
            {roleLabel ? (
              <View className="mb-4">
                <AppText className="text-xs text-muted-foreground mb-1">Role</AppText>
                <AppText className="text-base font-semibold text-foreground">
                  {roleLabel}
                </AppText>
              </View>
            ) : null}

            {vehicleLabel ? (
              <View className="mb-4">
                <AppText className="text-xs text-muted-foreground mb-1">Vehicle</AppText>
                <AppText className="text-base font-semibold text-foreground">
                  {vehicleLabel}
                </AppText>
              </View>
            ) : null}

            {provinceLabel ? (
              <View className="mb-4">
                <AppText className="text-xs text-muted-foreground mb-1">Province</AppText>
                <AppText className="text-base font-semibold text-foreground">
                  {provinceLabel}
                </AppText>
              </View>
            ) : null}

            {targetLabel ? (
              <View className="mb-2">
                <AppText className="text-xs text-muted-foreground mb-1">Target</AppText>
                <AppText className="text-base font-semibold text-foreground">
                  {targetLabel}
                </AppText>
              </View>
            ) : null}
          </View>

          <View className="mt-2">
            {cards.map((c, i) => (
              <View
                key={`${c.title}-${i}`}
                className="w-full p-4 rounded-2xl mb-3 border border-border bg-card"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-start gap-3">
                  <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
                    <Icon name={c.icon as any} color={isDark ? "#60A5FA" : "#1D4ED8"} size={20} />
                  </View>
                  <View className="flex-1">
                    <AppText className="text-base font-semibold text-foreground mb-1">
                      {c.title}
                    </AppText>
                    <AppText className="text-muted-foreground">
                      {c.desc}
                    </AppText>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className="px-5 pb-8 pt-4 gap-3">
        <View className="bg-primary/10 border border-primary/20 rounded-xl p-3 items-center justify-center">
          <AppText className="text-primary text-center font-semibold">
            These insights + <AppText className="text-primary font-extrabold">Fillr</AppText> = an optimized way to know your spending and savings
          </AppText>
        </View>
        <Pressable
          onPress={handleContinue}
          className="h-14 rounded-xl items-center justify-center bg-primary"
        >
          <AppText className="text-primary-foreground text-base">
            Create Account
          </AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
