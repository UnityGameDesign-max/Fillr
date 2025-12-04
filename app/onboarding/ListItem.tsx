import { View, useWindowDimensions, ImageURISource } from "react-native";
import React from "react";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  item: { text: string; image: ImageURISource };
  index: number;
  x: SharedValue<number>;
};

export default function ListItem({ item, index, x }: Props) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const imageStyle = useAnimatedStyle(() => {
    const input = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    return {
      opacity: interpolate(x.value, input, [0, 1, 0], "clamp"),
      transform: [{ translateY: interpolate(x.value, input, [100, 0, 100], "clamp") }],
      width: SCREEN_WIDTH * 0.7,
      height: SCREEN_WIDTH * 0.7,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const input = [
      (index - 1) * SCREEN_WIDTH,
      index * SCREEN_WIDTH,
      (index + 1) * SCREEN_WIDTH,
    ];

    return {
      opacity: interpolate(x.value, input, [0, 1, 0], "clamp"),
      transform: [{ translateY: interpolate(x.value, input, [100, 0, 100], "clamp") }],
    };
  });

  return (
    <View className="flex-1 items-center justify-around" style={{ width: SCREEN_WIDTH }}>
      <Animated.Image source={item.image} resizeMode="contain" style={imageStyle} />
      <Animated.Text
        className="font-semibold text-center text-[34px] leading-[41px] px-5"
        style={textStyle}
      >
        {item.text}
      </Animated.Text>
    </View>
  );
}
