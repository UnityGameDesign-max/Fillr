import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/shared/components/AppText";


export const Role = [
  {
    id: "EHAILING",
    title: "Rideshare Driver",
    desc:
      "Best for drivers earning with e-hailing apps. Track income vs. fuel costs, route suggestions, and find the cheapest fuel.",
    icon: <Ionicons name="location" size={22} color="#F4B200" />,
    iconBg: "bg-yellow-100",
  },
  {
    id: "SOLO",
    title: "Regular Driver",
    desc:
      "Perfect for personal use. Monitor your daily commute, log fuel expenses, and gain driving insights to save money.",
    icon: <Ionicons name="car" size={22} color="#00AF54" />,
    iconBg: "bg-green-100",
  },
  {
    id: "FLEET",
    title: "Fleet Manager",
    desc:
      "Ideal for businesses. Oversee multiple vehicles, track fuel usage, and optimize routes for maximum efficiency.",
    icon: <Ionicons name="business" size={22} color="#007BFF" />,
    iconBg: "bg-blue-100",
  },
]


export default function SelectRole() {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <SafeAreaView className="flex-1 bg-[#F8F9FB] px-5">
            <AppText className="text-2xl font-semibold text-gray-900 mb-1">Choose Your Role</AppText>
        </SafeAreaView>
    )

}