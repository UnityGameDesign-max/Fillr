import { fontFamily } from "@/lib/fontFamily";
import React from "react";
import { Text, TextProps } from "react-native";

export const AppText = ({ style, ...props }: TextProps) => {
  const merged = Array.isArray(style)
    ? Object.assign({}, ...style)
    : style || {};

  const weight = merged.fontWeight;

  let fontFamilyName = fontFamily.regular;
  if (weight === "500" || weight === "medium") fontFamilyName = fontFamily.medium;
  if (weight === "600" || weight === "semibold") fontFamilyName = fontFamily.semiBold;
  if (weight === "700" || weight === "bold") fontFamilyName = fontFamily.bold;

  return (
    <Text
      {...props}
      style={[{ fontFamily: fontFamilyName }, style]}
    />
  );
};
