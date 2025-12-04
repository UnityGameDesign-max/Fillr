import React from "react";
import { Text, TextProps } from "react-native";

export const AppText = ({ style, ...props }: TextProps) => (
  <Text
    {...props}
    style={[{ fontFamily: "Inter_400Regular" }, style]}
  />
);
