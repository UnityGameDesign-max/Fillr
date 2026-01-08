import LoadingDots from "@/components/onboarding/LoadingDots";
import { AppText } from "@/components/shared/AppText";
import { onboardingStore } from "@/store/onboardingStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, View } from "react-native";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSnapshot } from "valtio";

export default function InsightsLoading() {
  const snap = useSnapshot(onboardingStore);
  const pulse = useSharedValue(1);
  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);
  const textOpacity = useSharedValue(1);
  const [msgIndex, setMsgIndex] = useState(0);

  const messages = [
    "Processing answers...",
    "Personalizing your Fillr",
    snap.role === "EHAILING"
      ? "Aligning fuel tracking to your profit goals"
      : "Tailoring insights to your driving",
  ];

  useEffect(() => {
    pulse.value = withRepeat(withSequence(withTiming(1.1, { duration: 700 }), withTiming(1, { duration: 700 })), -1, true);

    setTimeout(() => {
      dot1.value = withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 500 })), -1, false);
    }, 0);
    setTimeout(() => {
      dot2.value = withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 500 })), -1, false);
    }, 200);
    setTimeout(() => {
      dot3.value = withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 500 })), -1, false);
    }, 400);

    setTimeout(() => {
      textOpacity.value = withTiming(0, { duration: 250 }, () => {
        runOnJS(setMsgIndex)(1);
        textOpacity.value = withTiming(1, { duration: 250 });
      });
    }, 1400);

    setTimeout(() => {
      textOpacity.value = withTiming(0, { duration: 250 }, () => {
        runOnJS(setMsgIndex)(2);
        textOpacity.value = withTiming(1, { duration: 250 });
      });
    }, 2800);

    const t = setTimeout(() => {
      router.replace("/onboarding/insights");
    }, 4000);
    return () => clearTimeout(t);
  }, [pulse, dot1, dot2, dot3, textOpacity]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));
  const animatedTextStyle = useAnimatedStyle(() => ({ opacity: textOpacity.value }));

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      <View className="flex-1 items-center justify-center px-5">
        <Animated.View className="w-40 h-40 rounded-2xl items-center justify-center" style={pulseStyle}>
          <Image
            source={require("../../assets/images/android-icon-monochrome.png")}
            style={{ width: 100, height: 100 }}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View className="mt-6 items-center" style={animatedTextStyle}>
          <AppText className="text-3xl text-blue-600 font-bold text-center">
            {messages[msgIndex]}
          </AppText>
        </Animated.View>
        <LoadingDots className="mt-8" />
      </View>
    </SafeAreaView>
  );
}
