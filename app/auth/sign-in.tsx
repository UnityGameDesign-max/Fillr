import { AppText } from "@/components/shared/AppText";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Theme colors
  const primaryColor = isDark ? "#0A84FF" : "#007AFF";
  const foregroundColor = isDark ? "#FFFFFF" : "#1F2937";
  const mutedColor = isDark ? "#CCCCCC" : "#6B7280";

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResend, setShowResend] = useState(false);

  // Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    // TODO: Add your Client IDs from Google Cloud Console
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      if (id_token) {
        handleGoogleSignIn(id_token);
      }
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // On success
      await SecureStore.setItemAsync("hasSeenOnboarding", "true");
      setLoading(false);

      if (data.session) {
        router.replace("/(tabs)");
      }
    } catch (e) {
      setError("An unexpected error occurred during Google Sign-In");
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!emailOrPhone) return;
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: emailOrPhone,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setError(null);
      // Using a simple alert for now, could be a toast in production
      alert("Confirmation email resent! Please check your inbox.");
      setShowResend(false);
    }
  };

  const validateInputs = () => {
    if (!emailOrPhone) return "Email is required";
    
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailOrPhone)) {
      return "Please enter a valid email address";
    }

    if (!password) return "Password is required";
    
    return null;
  };

  const handleLogin = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (loading) return;
    setLoading(true);
    setError(null);

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: emailOrPhone,
      password: password,
    });

    if (signInError) {
      if (signInError.message.includes("Email not confirmed")) {
        setError("Please verify your email address before signing in.");
        setShowResend(true);
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }

    // On success
    await SecureStore.setItemAsync("hasSeenOnboarding", "true");
    setLoading(false);

    if (data.session) {
      router.replace("/(tabs)");
    }
  };

  const resetOnboarding = async () => {
    await SecureStore.deleteItemAsync("hasSeenOnboarding");
    router.replace("/onboarding");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Reset Onboarding (Dev Only) */}
      <View className="absolute top-12 right-6 z-50">
        <Pressable onPress={resetOnboarding}>
          <Ionicons name="refresh-circle" size={28} color={mutedColor} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View className="items-center mt-10 mb-8">
          <View className="w-16 h-16 rounded-2xl items-center justify-center mb-6">
            <Image
              source={require("../../assets/images/android-icon-monochrome.png")}
              style={{ width: 100, height: 100, tintColor: isDark ? "#FFFFFF" : undefined }}
              resizeMode="contain"
            />
          </View>
          <AppText className="text-2xl font-bold text-center text-foreground mb-2">
            Welcome Back!
          </AppText>
          <AppText className="text-center text-muted-foreground leading-6 px-4">
            Sign in to manage your fleet or create a new account.
          </AppText>
        </View>

        {/* Tab Switcher */}
        <View className="flex-row bg-muted p-1 rounded-xl mb-6">
          <Pressable
            className="flex-1 py-3 items-center justify-center bg-card shadow-sm rounded-lg"
          >
            <AppText className="text-foreground font-semibold">Sign In</AppText>
          </Pressable>
          <Pressable
            onPress={() => router.replace("/auth/sign-up")}
            className="flex-1 py-3 items-center justify-center rounded-lg"
          >
            <AppText className="text-muted-foreground font-medium">Create Account</AppText>
          </Pressable>
        </View>

        <View className="gap-5">
          <View>
            <AppText className="text-sm font-semibold text-foreground mb-2">
              Email Address
            </AppText>
            <TextInput
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              placeholder="e.g. name@example.com"
              className="w-full h-14 px-4 rounded-xl border border-input bg-card text-base text-foreground"
              placeholderTextColor={mutedColor}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <View className="flex-row justify-between items-center mb-2">
                <AppText className="text-sm font-semibold text-foreground">
                Password
                </AppText>
                <Pressable onPress={() => router.push("/auth/forgot-password")}>
                    <AppText className="text-primary text-sm font-medium">Forgot Password?</AppText>
                </Pressable>
            </View>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={!showPass}
                className="w-full h-14 px-4 pr-12 rounded-xl border border-input bg-card text-base text-foreground"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowPass(!showPass)}
                className="absolute right-4 top-0 bottom-0 justify-center"
              >
                <Ionicons
                  name={showPass ? "eye-off" : "eye"}
                  size={20}
                  color={isDark ? "#9CA3AF" : "#6B7280"}
                />
              </Pressable>
            </View>
            
          </View>

          {error && (
            <View className="bg-destructive/10 p-3 rounded-xl">
              <AppText className="text-destructive text-sm text-center">
                {error}
              </AppText>
              {showResend && (
                <View className="flex-row justify-center gap-6 mt-3">
                    <Pressable onPress={handleResendConfirmation}>
                      <AppText className="text-primary text-sm font-bold text-center underline">
                        Resend Email
                      </AppText>
                    </Pressable>
                    <Pressable onPress={() => router.push({ pathname: "/auth/verify-email", params: { email: emailOrPhone } })}>
                      <AppText className="text-primary text-sm font-bold text-center underline">
                        Enter Code
                      </AppText>
                    </Pressable>
                </View>
              )}
            </View>
          )}

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className={`h-14 rounded-xl items-center justify-center mt-2 ${
              loading ? "bg-primary/70" : "bg-primary"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <AppText className="text-primary-foreground font-semibold text-base">
                Sign In
              </AppText>
            )}
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-2">
            <View className="flex-1 h-[1px] bg-border" />
            <AppText className="mx-4 text-muted-foreground text-sm">
              or
            </AppText>
            <View className="flex-1 h-[1px] bg-border" />
          </View>

          {/* Social Buttons */}
          <View className="gap-3">
            <Pressable
              onPress={() => promptAsync()}
              disabled={!request || loading}
              className="h-14 rounded-xl border border-input bg-card flex-row items-center justify-center gap-3"
            >
               <Ionicons name="logo-google" size={20} color={isDark ? "#FFFFFF" : "#1F2937"} />
              <AppText className="text-foreground font-semibold text-base">
                Sign In with Google
              </AppText>
            </Pressable>
          </View>

           {/* Footer */}
           <View className="mt-4 mb-6">
            <AppText className="text-center text-muted-foreground text-xs leading-5">
              By continuing, you agree to our{" "}
              <AppText className="text-primary font-medium">Terms of Service</AppText>
              {" and "}
              <AppText className="text-primary font-medium">Privacy Policy</AppText>.
            </AppText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
