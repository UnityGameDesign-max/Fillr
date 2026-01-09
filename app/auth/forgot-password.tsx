import { AppText } from "@/components/shared/AppText";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  View,
  Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPassword() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Theme colors
  const mutedColor = isDark ? "#CCCCCC" : "#6B7280";

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (loading) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'fillr://auth/update-password', // Deep link to your app (needs configuration)
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
      }
    } catch (e) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <Pressable 
          onPress={() => router.back()} 
          className="w-10 h-10 items-center justify-center rounded-full bg-muted/20 mt-4 mb-6"
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? "#FFFFFF" : "#000000"} />
        </Pressable>

        {/* Header */}
        <View className="mb-8">
          <AppText className="text-2xl font-bold text-foreground mb-3">
            Forgot Password?
          </AppText>
          <AppText className="text-muted-foreground leading-6">
            Don't worry! It happens. Please enter the email address associated with your account.
          </AppText>
        </View>

        {/* Form */}
        <View className="gap-5">
          <View>
            <AppText className="text-sm font-semibold text-foreground mb-2">
              Email Address
            </AppText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="e.g. name@example.com"
              className="w-full h-14 px-4 rounded-xl border border-input bg-card text-base text-foreground"
              placeholderTextColor={mutedColor}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {error && (
            <View className="bg-destructive/10 p-3 rounded-xl">
              <AppText className="text-destructive text-sm text-center">
                {error}
              </AppText>
            </View>
          )}

          {success && (
            <View className="bg-green-500/10 p-4 rounded-xl mb-2">
              <View className="flex-row items-center justify-center mb-2">
                <Ionicons name="mail-open-outline" size={24} color="#22c55e" />
              </View>
              <AppText className="text-green-600 text-sm text-center font-medium">
                Check your email! We've sent you a password reset link.
              </AppText>
            </View>
          )}

          <Pressable
            onPress={handleResetPassword}
            disabled={loading || success}
            className={`h-14 rounded-xl items-center justify-center mt-2 ${
              loading || success ? "bg-primary/70" : "bg-primary"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <AppText className="text-primary-foreground font-semibold text-base">
                {success ? "Email Sent" : "Send Reset Link"}
              </AppText>
            )}
          </Pressable>

          {/* Back to Login */}
          <View className="flex-row justify-center mt-4">
            <AppText className="text-muted-foreground">Remember your password? </AppText>
            <Pressable onPress={() => router.back()}>
              <AppText className="text-primary font-semibold">Log In</AppText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
