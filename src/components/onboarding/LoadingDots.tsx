import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from "react-native-reanimated";
import { useColorScheme } from "nativewind";

type Props = {
  color?: string;
  className?: string;
};

export default function LoadingDots({ color, className }: Props) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const defaultColor = isDark ? "#0A84FF" : "#007AFF";
  const finalColor = color || defaultColor;

  const dot1 = useSharedValue(0);
  const dot2 = useSharedValue(0);
  const dot3 = useSharedValue(0);

  useEffect(() => {
    dot1.value = withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 500 })), -1, false);
    setTimeout(() => {
      dot2.value = withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 500 })), -1, false);
    }, 200);
    setTimeout(() => {
      dot3.value = withRepeat(withSequence(withTiming(1, { duration: 500 }), withTiming(0, { duration: 500 })), -1, false);
    }, 400);
  }, [dot1, dot2, dot3]);

  const s1 = useAnimatedStyle(() => ({ opacity: dot1.value }));
  const s2 = useAnimatedStyle(() => ({ opacity: dot2.value }));
  const s3 = useAnimatedStyle(() => ({ opacity: dot3.value }));

  return (
    <View className={`flex-row gap-2 ${className || ""}`}>
      <Animated.View className="w-2 h-2 rounded-full" style={[s1, { backgroundColor: finalColor }]} />
      <Animated.View className="w-2 h-2 rounded-full" style={[s2, { backgroundColor: finalColor }]} />
      <Animated.View className="w-2 h-2 rounded-full" style={[s3, { backgroundColor: finalColor }]} />
    </View>
  );
}
