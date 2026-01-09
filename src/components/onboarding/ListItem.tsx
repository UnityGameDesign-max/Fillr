import React from "react";
import { ImageURISource, useWindowDimensions, View } from "react-native";
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle,
} from "react-native-reanimated";

type Props = {
  item: { title: string; description: string; image: ImageURISource };
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
    <View className=" items-center justify-center" style={{ width: SCREEN_WIDTH }}>
      <Animated.Image source={item.image} resizeMode="contain" style={imageStyle} />
      <Animated.Text
        className="font-bold text-center text-[34px] leading-[41px] px-5 pb-5 text-foreground"
        style={textStyle}
      >
        {item.title}
      </Animated.Text>

      <Animated.Text
       className="text-center font-medium text-[16px] leading-[22px] text-muted-foreground py-3 px-7"
       style={textStyle}
      >{item.description}</Animated.Text>
    </View>
  );
}
