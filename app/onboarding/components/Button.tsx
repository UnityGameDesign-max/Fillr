import { router } from "expo-router";
import React, { useCallback } from "react";
import { Dimensions, Pressable, Text } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { onboardingStore } from "../store/onboardingStore";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function Button({
  currentIndex,
  length,
  flatListRef,
}: {
  currentIndex: SharedValue<number>;
  length: number;
  flatListRef: any;
}) {
  const SCREEN_WIDTH = Dimensions.get("window").width;

  const isLast = currentIndex.value === length - 1;

  const buttonStyle = useAnimatedStyle(() => ({
    width: SCREEN_WIDTH - 40,
    height: 60,
  }));

  const continueStyle = useAnimatedStyle(() => ({
    opacity: isLast ? withTiming(0) : withTiming(1),
    transform: [
      {
        translateY: isLast ? withTiming(20) : withTiming(0),
      },
    ],
  }));

  const getStartedStyle = useAnimatedStyle(() => ({
    opacity: isLast ? withTiming(1) : withTiming(0),
    transform: [
      {
        translateY: isLast ? withTiming(0) : withTiming(-20),
      },
    ],
  }));

  const onPress = useCallback(() => {
    const indexNow = currentIndex.value;
    const isLast = indexNow === length - 1;

    if (isLast) {
      onboardingStore.currentStep = 1;
      router.replace("/onboarding/select-province");
      return;
    }

    flatListRef?.current?.scrollToIndex({
      index: indexNow + 1,
      animated: true,
    });
  }, [currentIndex, length, flatListRef]);

  return (
    <AnimatedPressable
      className="flex-row items-center justify-center rounded-xl bg-[#1d4ed8] overflow-hidden mt-8"
      onPress={onPress}
      style={buttonStyle}
    >
      <AnimatedText
        className="text-white font-semibold text-base absolute"
        style={continueStyle}
      >
        Continue
      </AnimatedText>

      <AnimatedText
        className="text-white font-semibold text-base absolute"
        style={getStartedStyle}
      >
        Get Started
      </AnimatedText>
    </AnimatedPressable>
  );
}
