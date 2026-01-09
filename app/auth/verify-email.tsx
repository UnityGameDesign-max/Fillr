import { AppText } from "@/components/shared/AppText";
import { supabase } from "@/lib/supabase";
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyEmail() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Theme colors
  const primaryColor = isDark ? "#0A84FF" : "#007AFF";
  const mutedColor = isDark ? "#CCCCCC" : "#6B7280";

  const { email } = useLocalSearchParams<{ email: string }>();
  // Ensure email is a string
  const emailStr = Array.isArray(email) ? email[0] : email;

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle the deep link if the session isn't automatically established
    const handleDeepLink = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        handleUrl(url);
      }
      
      const sub = Linking.addEventListener('url', ({ url }) => {
        handleUrl(url);
      });

      return () => {
        sub.remove();
      };
    };

    handleDeepLink();
  }, []);

  const handleUrl = async (url: string) => {
    // Check if the URL contains access_token and refresh_token (hash fragment)
    if (url.includes('access_token') && url.includes('refresh_token')) {
        const hashIndex = url.indexOf('#');
        if (hashIndex !== -1) {
            const hash = url.substring(hashIndex + 1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken && refreshToken) {
                setLoading(true);
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });
                
                if (error) {
                    console.error("Error setting session", error);
                    setError("Failed to verify email from link.");
                    setLoading(false);
                } else {
                    // Success
                    await supabase.auth.refreshSession(); // Ensure session is fresh
                    router.replace("/(tabs)");
                }
            }
        }
    }
  };

  const handleVerify = async () => {
    if (!code || code.length < 6) {
      setError("Please enter a valid verification code.");
      return;
    }

    if (!emailStr) {
      setError("Email address is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: emailStr,
        token: code,
        type: "signup",
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Verification successful, session should be established
      if (data.session) {
        router.replace("/(tabs)");
      } else {
        // Fallback if no session (shouldn't happen with verifyOtp usually)
        router.replace("/auth/sign-in");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!emailStr) return;
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: emailStr,
      });
      if (error) throw error;
      alert("Verification code resent! Please check your email (and spam folder).");
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to resend code.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Icon */}
          <View className="items-center mt-10 mb-8">
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
              <Image
                source={require("../../assets/icons/adaptive-icon.png")} // Fallback icon or use a mail icon if available
                style={{ width: 50, height: 50, tintColor: primaryColor }}
                resizeMode="contain"
              />
            </View>
            <AppText className="text-2xl font-bold text-center text-foreground mb-2">
              Verify Your Email
            </AppText>
            <AppText className="text-center text-muted-foreground leading-6">
              We've sent a verification code to{"\n"}
              <AppText className="font-bold text-foreground">{email}</AppText>
            </AppText>
          </View>

          {/* Input */}
          <View className="bg-card p-4 rounded-xl shadow-sm border border-border mb-6">
            <AppText className="text-xs font-bold text-muted-foreground uppercase mb-2">
              Verification Code
            </AppText>
            <TextInput
              className="text-foreground text-lg font-medium h-12"
              placeholder="123456"
              placeholderTextColor={mutedColor}
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              maxLength={10}
              autoFocus
            />
          </View>

          {error && (
            <View className="bg-destructive/10 p-3 rounded-xl mb-6">
              <AppText className="text-destructive text-sm text-center">
                {error}
              </AppText>
            </View>
          )}

          {/* Verify Button */}
          <Pressable
            onPress={handleVerify}
            disabled={loading}
            className={`h-14 rounded-xl items-center justify-center mb-4 ${
              loading ? "bg-primary/70" : "bg-primary"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <AppText className="text-primary-foreground font-semibold text-base">
                Verify Email
              </AppText>
            )}
          </Pressable>

          {/* Resend Link */}
          <Pressable onPress={handleResend} className="items-center py-4">
            <AppText className="text-muted-foreground">
              Didn't receive the code?{" "}
              <AppText className="text-primary font-semibold">
                Resend
              </AppText>
            </AppText>
          </Pressable>
          
          <Pressable onPress={() => router.back()} className="items-center mt-2">
             <AppText className="text-muted-foreground text-sm">Back to Sign Up</AppText>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
