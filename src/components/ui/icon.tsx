import { icons, type LucideIcon } from "lucide-react-native";
import React from "react";

const iconMap = { ...icons }; 

type IconName = keyof typeof iconMap;

type Props = {
  name: IconName;
  color?: string;
  size?: number;
};

export default function Icon({ name, color, size }: Props) {
  const LucideIcon = iconMap[name] as LucideIcon;
  return <LucideIcon color={color} size={size} />;
}
