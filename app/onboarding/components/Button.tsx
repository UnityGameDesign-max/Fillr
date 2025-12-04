import { Dimensions, Pressable, Text } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import React, { useCallback } from "react";

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

  const buttonStyle = useAnimatedStyle(() => ({
    width: SCREEN_WIDTH - 40,
    height: 60,
  }));

  const continueStyle = useAnimatedStyle(() => ({
    opacity: currentIndex.value === length - 1 ? withTiming(0) : withTiming(1),
    transform: [
      {
        translateY:
          currentIndex.value === length - 1 ? withTiming(20) : withTiming(0),
      },
    ],
  }));

  const getStartedStyle = useAnimatedStyle(() => ({
    opacity: currentIndex.value === length - 1 ? withTiming(1) : withTiming(0),
    transform: [
      {
        translateY:
          currentIndex.value === length - 1 ? withTiming(0) : withTiming(-20),
      },
    ],
  }));

  const onPress = useCallback(() => {
    if (currentIndex.value === length - 1) {
      console.log("Get Started → Navigate to your Login screen");
      return;
    }
    flatListRef?.current?.scrollToIndex({
      index: currentIndex.value + 1,
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
