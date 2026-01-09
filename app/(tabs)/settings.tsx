import { supabase } from "@/lib/supabase";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React from 'react';
import { Pressable, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabSettings() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const handleSignOut = async () => {
    console.log("Sign out pressed - executing direct signout");
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Sign out error:", error);
            alert(`Error signing out: ${error.message}`);
            return;
        }
        router.replace("/auth/sign-in");
    } catch (e) {
        console.error("Unexpected error signing out:", e);
        router.replace("/auth/sign-in");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-5 py-4 bg-card border-b border-border">
        <Text className="text-2xl font-bold text-foreground">Settings</Text>
      </View>
      
      <View className="flex-1 pt-6">
        <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground uppercase mb-2 mt-4 ml-5">Appearance</Text>
            <View className="bg-card border-y border-border">
                <View className="flex-row items-center py-4 px-5">
                    <View className="w-8 items-center mr-3">
                        <Ionicons name="moon-outline" size={24} color={isDark ? "#FFFFFF" : "#1F2937"} />
                    </View>
                    <Text className="flex-1 text-base text-foreground">Dark Mode</Text>
                    <Switch 
                        value={isDark} 
                        onValueChange={toggleColorScheme}
                    />
                </View>
            </View>
        </View>

        <View className="mb-6">
            <Text className="text-sm font-semibold text-muted-foreground uppercase mb-2 mt-4 ml-5">Account</Text>
            <View className="bg-card border-y border-border">
                <Pressable className="flex-row items-center py-4 px-5 active:opacity-70" onPress={handleSignOut}>
                    <View className="w-8 items-center mr-3">
                        <Ionicons name="log-out-outline" size={24} color={isDark ? "#FF453A" : "#FF3B30"} />
                    </View>
                    <Text className="flex-1 text-base text-destructive">Sign Out</Text>
                    <Ionicons name="chevron-forward" size={20} color={isDark ? "#9CA3AF" : "#9CA3AF"} />
                </Pressable>
            </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
