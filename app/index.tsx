import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFirstOpen = async () => {
      const role = await SecureStore.getItemAsync("userRole");

      if (role) {
        router.replace("/");
      } else {
        router.replace("/onboarding");
      }
      setLoading(false);
    };

    checkFirstOpen();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return null;
}
