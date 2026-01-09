import { supabase } from "@/lib/supabase";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, Switch, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SettingsItemProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightElement?: React.ReactNode;
  isLast?: boolean;
}

const SettingsItem = ({ icon, iconBg, label, onPress, showChevron = true, rightElement, isLast }: SettingsItemProps) => (
  <Pressable 
    onPress={onPress} 
    className={`flex-row items-center p-4 ${!isLast ? 'border-b border-gray-100 dark:border-gray-800' : ''} active:opacity-70`}
  >
    <View className="w-10 h-10 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: iconBg }}>
      {icon}
    </View>
    <Text className="flex-1 text-base font-semiBold text-foreground">{label}</Text>
    {rightElement ? rightElement : (showChevron && (
      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    ))}
  </Pressable>
);

export default function TabSettings() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) setUserEmail(user.email);
    });
  }, []);
  
  const handleSignOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        router.replace("/auth/sign-in");
    } catch (e) {
        console.error("Error signing out:", e);
        router.replace("/auth/sign-in");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-6 flex-row items-center justify-between">
        <Text className="text-3xl font-bold text-foreground">Settings</Text>
      </View>
      
      <ScrollView className="flex-1 px-6 pt-2" showsVerticalScrollIndicator={false}>

        {/* General */}
        <Text className="text-xs font-bold text-muted-foreground uppercase mb-3 tracking-wider">General</Text>
        <View className="bg-white dark:bg-card rounded-3xl overflow-hidden shadow-sm mb-8">
            <SettingsItem 
                icon={<Ionicons name="person-outline" size={22} color="#0D9488" />}
                iconBg={isDark ? "rgba(20, 184, 166, 0.1)" : "#F0FDFA"}
                label="Profile"
                onPress={() => {}}
            />
            <SettingsItem 
                icon={<Ionicons name="moon-outline" size={22} color="#8B5CF6" />}
                iconBg={isDark ? "rgba(139, 92, 246, 0.1)" : "#F5F3FF"}
                label="Dark Mode"
                rightElement={
                    <Switch 
                        value={isDark} 
                        onValueChange={toggleColorScheme}
                        trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                        thumbColor={'#FFFFFF'}
                    />
                }
            />
            <SettingsItem 
                icon={<Ionicons name="compass-outline" size={22} color="#0D9488" />}
                iconBg={isDark ? "rgba(20, 184, 166, 0.1)" : "#F0FDFA"}
                label="Province Selection"
                onPress={() => {}}
            />
            <SettingsItem 
                icon={<Ionicons name="car-outline" size={22} color="#0D9488" />}
                iconBg={isDark ? "rgba(20, 184, 166, 0.1)" : "#F0FDFA"}
                label="Vehicle Management"
                onPress={() => router.push("/onboarding/add-vehicle")}
            />
            <SettingsItem 
                icon={<Ionicons name="notifications-outline" size={22} color="#0D9488" />}
                iconBg={isDark ? "rgba(20, 184, 166, 0.1)" : "#F0FDFA"}
                label="Notifications"
                onPress={() => {}}
            />
            <SettingsItem 
                icon={<Ionicons name="link-outline" size={22} color="#0D9488" />}
                iconBg={isDark ? "rgba(20, 184, 166, 0.1)" : "#F0FDFA"}
                label="Uber Integration"
                onPress={() => {}}
                isLast
            />
        </View>
        
        {/* Financial Management */}
        <Text className="text-xs font-bold text-muted-foreground uppercase mb-3 mt-2 tracking-wider">Financial Management</Text>
        <View className="bg-white dark:bg-card rounded-3xl overflow-hidden shadow-sm mb-6">
            <SettingsItem 
                icon={<Ionicons name="cash-outline" size={22} color="#10B981" />}
                iconBg={isDark ? "rgba(16, 185, 129, 0.1)" : "#ECFDF5"}
                label="Update Total Earnings"
                onPress={() => {}}
            />
            <SettingsItem 
                icon={<Ionicons name="trending-up-outline" size={22} color="#3B82F6" />}
                iconBg={isDark ? "rgba(59, 130, 246, 0.1)" : "#EFF6FF"}
                label="Update Profit Targets"
                onPress={() => router.push("/onboarding/target-profit")}
                isLast
            />
        </View>


        {/* Sign Out */}
        <Pressable 
            onPress={handleSignOut}
            className="bg-red-50 dark:bg-red-900/20 py-4 rounded-2xl flex-row items-center justify-center gap-2 mb-10 active:opacity-80"
        >
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text className="text-red-500 font-bold text-lg">Sign Out</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}
