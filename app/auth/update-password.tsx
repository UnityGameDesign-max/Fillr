import { AppText } from "@/components/shared/AppText";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Linking from 'expo-linking';
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UpdatePassword() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Theme colors
  const mutedColor = isDark ? "#CCCCCC" : "#6B7280";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    // Supabase sends them in the hash
    if (url.includes('access_token') && url.includes('refresh_token')) {
        // We can try to let supabase handle it or manually parse
        // Since detectSessionInUrl is false, we might need to manually set session
        // But typically, simply calling getUser() might check storage if persisted
        
        // Let's try to extract tokens from hash
        const hashIndex = url.indexOf('#');
        if (hashIndex !== -1) {
            const hash = url.substring(hashIndex + 1);
            const params = new URLSearchParams(hash);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            if (accessToken && refreshToken) {
                const { error } = await supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                });
                if (error) {
                    console.error("Error setting session", error);
                    setError("Failed to establish session from link.");
                }
            }
        }
    }
  };

  const handleUpdatePassword = async () => {
    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        // Navigate to home or sign in after a delay
        setTimeout(() => {
            router.replace("/(tabs)");
        }, 2000);
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
        {/* Header */}
        <View className="mt-10 mb-8">
          <AppText className="text-2xl font-bold text-foreground mb-3">
            Set New Password
          </AppText>
          <AppText className="text-muted-foreground leading-6">
            Please enter your new password below.
          </AppText>
        </View>

        {/* Form */}
        <View className="gap-5">
          <View>
            <AppText className="text-sm font-semibold text-foreground mb-2">
              New Password
            </AppText>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter new password"
                secureTextEntry={!showPass}
                className="w-full h-14 px-4 pr-12 rounded-xl border border-input bg-card text-base text-foreground"
                placeholderTextColor={mutedColor}
                autoCapitalize="none"
              />
              <Pressable
                onPress={() => setShowPass(!showPass)}
                className="absolute right-4 top-0 bottom-0 justify-center"
              >
                <Ionicons
                  name={showPass ? "eye-off" : "eye"}
                  size={20}
                  color={mutedColor}
                />
              </Pressable>
            </View>
          </View>

          <View>
            <AppText className="text-sm font-semibold text-foreground mb-2">
              Confirm Password
            </AppText>
            <View className="relative">
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry={!showPass}
                className="w-full h-14 px-4 pr-12 rounded-xl border border-input bg-card text-base text-foreground"
                placeholderTextColor={mutedColor}
                autoCapitalize="none"
              />
            </View>
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
                <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
              </View>
              <AppText className="text-green-600 text-sm text-center font-medium">
                Password updated successfully! Redirecting...
              </AppText>
            </View>
          )}

          <Pressable
            onPress={handleUpdatePassword}
            disabled={loading || success}
            className={`h-14 rounded-xl items-center justify-center mt-2 ${
              loading || success ? "bg-primary/70" : "bg-primary"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <AppText className="text-primary-foreground font-semibold text-base">
                Update Password
              </AppText>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
