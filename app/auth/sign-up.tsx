import { AppText } from "@/components/shared/AppText";
import { supabase } from "@/lib/supabase";
import { onboardingStore } from "@/store/onboardingStore";
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
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSnapshot } from "valtio";

export default function SignUp() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const snap = useSnapshot(onboardingStore);

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

      // Handle profile creation for Google Sign Up (if new user)
      if (data.user) {
         // Try to save profile data (similar to email sign up)
         // Note: If user already exists, this might just update or be skipped
         await saveProfileData(data.user.id);
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

  const saveProfileData = async (userId: string) => {
      console.log("Saving profile data for:", userId);
      console.log("Snapshot data:", { role: snap.role, province: snap.province });

      try {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: userId,
            role: snap.role || 'SOLO', // Default to Regular Driver if null
            province: snap.province,
            target_profit_amount: snap.targetProfit?.amount,
            target_profit_period: snap.targetProfit?.period,
            weekly_earnings: snap.weeklyEarnings,
            earnings_includes_cash_card: snap.earningsIncludesCashAndCard,
            updated_at: new Date(),
          });
        
        if (profileError) {
            console.error("Error saving profile:", profileError);
            alert(`Failed to save profile: ${profileError.message}`);
            return;
        }

        if (snap.vehicle) {
           const { error: vehicleError } = await supabase.from("vehicles").insert({
              user_id: userId,
              // ... map vehicle fields
              make: snap.vehicle.make,
              model: snap.vehicle.model,
              year: snap.vehicle.year,
              engine: snap.vehicle.engine,
              fuel_type: snap.vehicle.fuelType,
              odometer: snap.vehicle.odometer,
           });

           if (vehicleError) {
               console.error("Error saving vehicle:", vehicleError);
               // We don't block registration for vehicle error, but log it
           }
        }
      } catch (e) {
          console.error("Unexpected error saving profile data:", e);
      }
  };

  // Password strength state
  const getStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 5) score++;
    if (pass.length > 7) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0-4
  };

  const strengthScore = getStrength(password);
  const strengthLabels = ["Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    isDark ? "#374151" : "#E5E7EB", // 0 (Gray)
    "#EF4444", // 1 (Red)
    "#F59E0B", // 2 (Orange)
    "#3B82F6", // 3 (Blue)
    "#10B981", // 4 (Green)
  ];

  const validateInputs = () => {
    if (!email) return "Email is required";
    
    // Email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    
    return null;
  };

  const handleRegister = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (loading) return;
    setLoading(true);
    setError(null);

    // 1. Sign Up
    const { error: signUpError, data } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: 'fillr://auth/verify-email',
        data: {
          role: snap.role || 'SOLO',
          province: snap.province,
          target_profit_amount: snap.targetProfit?.amount,
          target_profit_period: snap.targetProfit?.period,
          weekly_earnings: snap.weeklyEarnings,
          earnings_includes_cash_card: snap.earningsIncludesCashAndCard,
          vehicle: snap.vehicle ? {
            make: snap.vehicle.make,
            model: snap.vehicle.model,
            year: snap.vehicle.year,
            engine: snap.vehicle.engine,
            fuelType: snap.vehicle.fuelType,
            odometer: snap.vehicle.odometer,
          } : null,
        },
      },
    });

    if (signUpError) {
      console.error("Sign Up Error:", signUpError);
      
      if (signUpError.message.includes("Error sending confirmation email")) {
          alert(
              "Too many signup attempts or Email Service Issue.\n\n" +
              "1. Try a different email address.\n" +
              "2. Check Supabase > Auth > Rate Limits.\n" +
              "3. Use a Custom SMTP server in Supabase."
          );
      } else {
          setError(signUpError.message);
      }
      
      setLoading(false);
      return;
    }

    // On success
    await SecureStore.setItemAsync("hasSeenOnboarding", "true");
    setLoading(false);
    
    if (data.session) {
       router.replace("/(tabs)");
    } else if (data.user && !data.session) {
       // Email confirmation required
       router.replace({
         pathname: "/auth/verify-email",
         params: { email: email }
       });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
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
            onPress={() => router.replace("/auth/sign-in")}
            className="flex-1 py-3 items-center justify-center rounded-lg"
          >
            <AppText className="text-muted-foreground font-medium">Sign In</AppText>
          </Pressable>
          <Pressable
            className="flex-1 py-3 items-center justify-center bg-card shadow-sm rounded-lg"
          >
            <AppText className="text-foreground font-semibold">Create Account</AppText>
          </Pressable>
        </View>

        {/* Form */}
        <View className="gap-5">
          {/* Email */}
          <View>
            <AppText className="text-sm font-semibold text-foreground mb-2">
              Email Address
            </AppText>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="name@example.com"
              className="w-full h-14 px-4 rounded-xl border border-input bg-card text-base text-foreground"
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View>
            <AppText className="text-sm font-semibold text-foreground mb-2">
              Password
            </AppText>
            <View className="relative">
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
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

            {/* Strength Indicator */}
            {password.length > 0 && (
              <View className="flex-row items-center gap-2 mt-3">
                <View className="flex-1 flex-row gap-1 h-1">
                  {[1, 2, 3, 4].map((level) => (
                    <View
                      key={level}
                      className="flex-1 rounded-full"
                      style={{
                        backgroundColor:
                          strengthScore >= level
                            ? strengthColor[strengthScore]
                            : (isDark ? "#374151" : "#E5E7EB"),
                      }}
                    />
                  ))}
                </View>
                <AppText
                  className="text-xs font-medium"
                  style={{ color: strengthColor[strengthScore] || (isDark ? "#9CA3AF" : "#9CA3AF") }}
                >
                  {strengthLabels[strengthScore]}
                </AppText>
              </View>
            )}
          </View>

          {error && (
            <View className="bg-destructive/10 p-3 rounded-xl">
              <AppText className="text-destructive text-sm text-center">
                {error}
              </AppText>
            </View>
          )}

          {/* Create Button */}
          <Pressable
            onPress={handleRegister}
            disabled={loading}
            className={`h-14 rounded-xl items-center justify-center mt-2 ${
              loading ? "bg-primary/70" : "bg-primary"
            }`}
          >
            {loading ? (
              <ActivityIndicator color={isDark ? "#000" : "white"} />
            ) : (
              <AppText className="text-primary-foreground font-semibold text-base">
                Create Account
              </AppText>
            )}
          </Pressable>

          {/* Divider */}
          <View className="flex-row items-center my-2">
            <View className="flex-1 h-[1px] bg-border" />
            <AppText className="mx-4 text-muted-foreground text-sm">
              or sign up with
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
                Sign Up with Google
              </AppText>
            </Pressable>

          </View>

          <View className="mt-4 mb-6">
            <AppText className="text-center text-muted-foreground text-xs leading-5">
              By creating an account, you agree to our{" "}
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
