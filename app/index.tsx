import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const primaryColor = isDark ? "#0A84FF" : "#007AFF";

  useEffect(() => {
    const checkSession = async () => {
      // 1. Check for active Supabase session
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        // User is logged in -> Go to Home
        router.replace("/(tabs)"); // Assuming /(tabs) is the home route
      } else {
        // User is NOT logged in
        // 2. Check if they have seen onboarding before
        const hasSeenOnboarding = await SecureStore.getItemAsync("hasSeenOnboarding");

        if (hasSeenOnboarding === "true") {
          // If they've seen onboarding, they likely want to Log In or Create Account.
          // Since the prompt asks to "not show onboarding again unless account is deleted",
          // we send them to the Auth/Create Account screen.
          // I'll send them to register (Create Account) as per the design request flow,
          // or maybe Sign In. Usually Sign In is better for returning users.
          // But the user emphasized "land on creating an account after onboarding".
          // If they restart app and are logged out, Sign In is safer.
          // But for now, let's route to Register to match the flow requested.
          // Or better, route to a landing that allows both.
          // I'll route to Register as it's the screen I just built.
          router.replace("/auth/sign-up"); 
        } else {
          // New user -> Onboarding
          router.replace("/onboarding");
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return null;
}
