import { fontFamily } from "@/lib/fontFamily";
import { PortalHost } from '@rn-primitives/portal';
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback } from "react";
import { View } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import './global.css';

// Configure Reanimated Logger
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false, // Disable strict mode
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    [fontFamily.regular]: require("@/assets/fonts/OpenSans-Regular.ttf"),
    [fontFamily.bold]: require("@/assets/fonts/OpenSans-Bold.ttf"),
    [fontFamily.medium]: require('@/assets/fonts/OpenSans-Medium.ttf'),
    [fontFamily.semiBold]: require('@/assets/fonts/OpenSans-SemiBold.ttf')
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <PortalHost />
    </View>
  );
}
