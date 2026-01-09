import React from "react";
import { View } from "react-native";

type Props = {
  current: number;
  total: number;
  className?: string;
};

export default function ProgressSegments({ current, total, className }: Props) {
  return (
    <View className={`flex-row gap-1 ${className || ""}`}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={`h-2 flex-1 rounded-full ${i < current ? "bg-primary" : "bg-muted"}`}
        />
      ))}
    </View>
  );
}
