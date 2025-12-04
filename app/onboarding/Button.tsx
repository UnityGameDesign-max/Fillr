import { Pressable } from "react-native";
import Animated, {
    SharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import React, { useCallback } from "react";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Button({
  currentIndex,
  length,
  flatListRef,
}: {
  currentIndex: SharedValue<number>;
  length: number;
  flatListRef: any;
}) {
  const buttonStyle = useAnimatedStyle(() => ({
    width: currentIndex.value === length - 1 ? withSpring(140) : withSpring(60),
    height: 60,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: currentIndex.value === length - 1 ? withTiming(1) : withTiming(0),
    transform: [
      {
        translateX:
          currentIndex.value === length - 1 ? withTiming(0) : withTiming(100),
      },
    ],
  }));

  const arrowStyle = useAnimatedStyle(() => ({
    opacity: currentIndex.value !== length - 1 ? withTiming(1) : withTiming(0),
    transform: [
      {
        translateX:
          currentIndex.value !== length - 1 ? withTiming(0) : withTiming(100),
      },
    ],
  }));

  const onPress = useCallback(() => {
    if (currentIndex.value === length - 1) {
      console.log("Get Started");
      return;
    }
    flatListRef?.current?.scrollToIndex({
      index: currentIndex.value + 1,
    });
  }, []);

  return (
    <AnimatedPressable
      className="flex-row items-center justify-center rounded-full bg-primary overflow-hidden px-6"
      onPress={onPress}
      style={buttonStyle}
    >
      <Animated.Text
        className="text-white font-semibold text-base absolute"
        style={textStyle}
      >
        Get Started
      </Animated.Text>

      <Animated.Image
        source={require("../../assets/images/favicon.png")}
        className="w-6 h-6 absolute"
        style={arrowStyle}
      />
    </AnimatedPressable>
  );
}
