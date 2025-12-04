import React from "react";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function Dot({
  index,
  x,
  screenWidth,
}: {
  index: number;
  x: SharedValue<number>;
  screenWidth: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const input = [
      (index - 1) * screenWidth,
      index * screenWidth,
      (index + 1) * screenWidth,
    ];

    return {
      width: interpolate(x.value, input, [35, 16, 35], "clamp"),
      backgroundColor: interpolateColor(
        x.value,
        input,
        ["#D0D0D0", "#304FFE", "#D0D0D0"]
      ),
    };
  });

  return <Animated.View className="h-2 rounded-full mx-1" style={animatedStyle} />;
}
