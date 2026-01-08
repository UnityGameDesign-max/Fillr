import { fontFamily } from "@/lib/fontFamily";
import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";

export const AppText = ({ style, ...props }: TextProps) => {
  const merged = StyleSheet.flatten(style || {});

  const weight = merged.fontWeight;
  const cls = (props as any)?.className as string | undefined;

  let fontFamilyName = fontFamily.regular;
  if (
    weight === "500" ||
    weight === 500 ||
    (cls && cls.includes("font-medium"))
  )
    fontFamilyName = fontFamily.medium;
  if (
    weight === "600" ||
    weight === 600 ||
    weight === "semibold" ||
    (cls && cls.includes("font-semibold"))
  )
    fontFamilyName = fontFamily.semiBold;
  if (
    weight === "700" ||
    weight === 700 ||
    weight === "bold" ||
    (cls && cls.includes("font-bold"))
  )
    fontFamilyName = fontFamily.bold;
  if (
    weight === "800" ||
    weight === 800 ||
    weight === "900" ||
    weight === 900 ||
    weight === "black" ||
    (cls && (cls.includes("font-extrabold") || cls.includes("font-black")))
  )
    fontFamilyName = fontFamily.extraBold;

  return (
    <Text
      {...props}
      style={[style, { fontFamily: fontFamilyName, fontWeight: undefined }]}
    />
  );
};
