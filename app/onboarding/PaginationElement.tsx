import { View, useWindowDimensions } from "react-native";
import React from "react";
import { SharedValue } from "react-native-reanimated";
import Dot from "./Dot";

export default function PaginationElement({
  length,
  x,
}: {
  length: number;
  x: SharedValue<number>;
}) {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  return (
    <View className="flex-row">
      {Array.from({ length }).map((_, index) => (
        <Dot key={index} index={index} x={x} screenWidth={SCREEN_WIDTH} />
      ))}
    </View>
  );
}
