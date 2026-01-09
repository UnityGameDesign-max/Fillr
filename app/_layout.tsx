import { fontFamily } from "@/lib/fontFamily";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, useFonts } from "@expo-google-fonts/inter";
import { PortalHost } from '@rn-primitives/portal';
import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import React, { useCallback, useEffect } from "react";
import { Platform, View } from "react-native";
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
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [fontsLoaded] = useFonts({
    [fontFamily.regular]: Inter_400Regular,
    [fontFamily.medium]: Inter_500Medium,
    [fontFamily.semiBold]: Inter_600SemiBold,
    [fontFamily.bold]: Inter_700Bold,
    [fontFamily.extraBold]: Inter_800ExtraBold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const backgroundColor = isDark ? "#121212" : "#FFFFFF";
    const buttonStyle = isDark ? "light" : "dark";

    // NavigationBar.setBackgroundColorAsync(backgroundColor);
    NavigationBar.setButtonStyleAsync(buttonStyle);
  }, [isDark]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="trip-details" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      </Stack>
      <PortalHost />
    </View>
  );
}
