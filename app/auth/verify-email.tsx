import { AppText } from "@/components/shared/AppText";
import { supabase } from "@/lib/supabase";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
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
  const { email } = useLocalSearchParams<{ email: string }>();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!code || code.length < 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
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
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      alert("Verification code resent! Please check your email (and spam folder).");
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to resend code.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
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
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-6">
              <Image
                source={require("../../assets/icons/adaptive-icon.png")} // Fallback icon or use a mail icon if available
                style={{ width: 50, height: 50, tintColor: "#2563EB" }}
                resizeMode="contain"
              />
            </View>
            <AppText className="text-2xl font-bold text-center text-gray-900 mb-2">
              Verify Your Email
            </AppText>
            <AppText className="text-center text-gray-500 leading-6">
              We've sent a verification code to{"\n"}
              <AppText className="font-bold text-gray-900">{email}</AppText>
            </AppText>
          </View>

          {/* Input */}
          <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
            <AppText className="text-xs font-bold text-gray-400 uppercase mb-2">
              Verification Code
            </AppText>
            <TextInput
              className="text-gray-900 text-lg font-medium h-12"
              placeholder="123456"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              maxLength={6}
              autoFocus
            />
          </View>

          {error && (
            <View className="bg-red-50 p-3 rounded-xl mb-6">
              <AppText className="text-red-600 text-sm text-center">
                {error}
              </AppText>
            </View>
          )}

          {/* Verify Button */}
          <Pressable
            onPress={handleVerify}
            disabled={loading}
            className={`h-14 rounded-xl items-center justify-center mb-4 ${
              loading ? "bg-blue-400" : "bg-blue-600"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <AppText className="text-white font-semibold text-base">
                Verify Email
              </AppText>
            )}
          </Pressable>

          {/* Resend Link */}
          <Pressable onPress={handleResend} className="items-center py-4">
            <AppText className="text-gray-500">
              Didn't receive the code?{" "}
              <AppText className="text-blue-600 font-semibold">
                Resend
              </AppText>
            </AppText>
          </Pressable>
          
          <Pressable onPress={() => router.back()} className="items-center mt-2">
             <AppText className="text-gray-400 text-sm">Back to Sign Up</AppText>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
