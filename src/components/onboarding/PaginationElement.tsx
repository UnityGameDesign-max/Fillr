import { View, useWindowDimensions } from "react-native";
import React from "react";
import { SharedValue } from "react-native-reanimated";
import Dot from "./Dot";
import { useSnapshot } from "valtio";
import { onboardingStore } from "@/store/onboardingStore";

export default function PaginationElement({
  length,
  x,
  totalSteps,
}: {
  length?: number;
  x?: SharedValue<number>;
  totalSteps?: number;
}) {
  const snap = useSnapshot(onboardingStore);

  const isSlides = snap.currentStep === 0;

  const { width: SCREEN_WIDTH } = useWindowDimensions();

  if (isSlides && x && length) {
    return (
      <View className="flex-row">
        {Array.from({ length }).map((_, index) => (
          <Dot key={index} index={index} x={x} screenWidth={SCREEN_WIDTH} />
        ))}
      </View>
    );
  }

  return (
    <View className="flex-row">
      {[...Array(snap.totalSteps)].map((_, i) => (
        <View
          key={i}
          className={`h-2 w-2 rounded-full mx-1 ${
            snap.currentStep === i ? "bg-blue-600" : "bg-gray-300"
          }`}
        />
      ))}
    </View>
  );
}
