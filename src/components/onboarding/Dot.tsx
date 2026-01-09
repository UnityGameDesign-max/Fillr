import React from "react";
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";

export default function Dot({
  index,
  x,
  screenWidth,
}: {
  index: number;
  x: SharedValue<number>;
  screenWidth: number;
}) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  
  // Theme colors matching global.css
  const activeColor = isDark ? "#0A84FF" : "#007AFF"; // Primary
  const inactiveColor = isDark ? "#292929" : "#D9D9D9"; // Muted

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
        [inactiveColor, activeColor, inactiveColor]
      ),
    };
  });

  return <Animated.View className="h-2 rounded-full mx-1" style={animatedStyle} />;
}
