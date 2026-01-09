import { onboardingStore } from "@/store/onboardingStore";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Dimensions, Pressable } from "react-native";
import Animated, {
    SharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";

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
  const isFirst = currentIndex.value === 0;
  const showGetStarted = isLast || isFirst;

  const buttonStyle = useAnimatedStyle(() => ({
    width: SCREEN_WIDTH - 40,
    height: 60,
  }));

  const continueStyle = useAnimatedStyle(() => ({
    opacity: showGetStarted ? withTiming(0) : withTiming(1),
    transform: [
      {
        translateY: showGetStarted ? withTiming(20) : withTiming(0),
      },
    ],
  }));

  const getStartedStyle = useAnimatedStyle(() => ({
    opacity: showGetStarted ? withTiming(1) : withTiming(0),
    transform: [
      {
        translateY: showGetStarted ? withTiming(0) : withTiming(-20),
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
    <Animated.View
      className="mt-8 rounded-xl bg-primary overflow-hidden"
      style={buttonStyle}
    >
      <Pressable
        className="flex-1 flex-row items-center justify-center w-full h-full"
        onPress={onPress}
      >
        <Animated.Text
          className="text-primary-foreground font-semibold text-base absolute"
          style={continueStyle}
        >
          Continue
        </Animated.Text>

        <Animated.Text
          className="text-primary-foreground font-semibold text-base absolute"
          style={getStartedStyle}
        >
          Get Started
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
}
