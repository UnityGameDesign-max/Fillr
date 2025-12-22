import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { fontFamily } from "@/lib/fontFamily";

export default function Register() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const disabled = !emailOrPhone || !password;

  const handleRegister = async () => {
    if (disabled) return;

    await SecureStore.setItemAsync(
      "userData",
      JSON.stringify({ emailOrPhone })
    );
    router.replace("/onboarding/select-role");
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-6 py-10">
      <View className="items-center mb-8">
        <View className="w-14 h-14 bg-primary rounded-2xl items-center justify-center">
          <MaterialCommunityIcons name="car" size={28} color="#fff" />
        </View>
      </View>

      <View className="items-center">
        <View className="w-full">
          <Input
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            placeholder="Email"
          />
        </View>
      </View>


      <Button>
        <Text>Button</Text>
      </Button>

      {/* Divider */}
      <View className="flex-row items-center my-6">
        <View className="flex-1 h-[1px] bg-gray-300" />
        <Button className="bg-primary">
          <Text className="font-regular">or sign up with</Text>
        </Button>
        <View className="flex-1 h-[1px] bg-gray-300" />
      </View>
      {/* 
      <CustomButton
        label="Sign up with Google"
        iconName="logo-google"
     
        textColor="#1F2937"
        iconColor="#1F2937"
        onPress={() => console.log("Google click")}
      /> */}

      {/* Apple Sign-In */}
      <Pressable className="w-full h-14 bg-black rounded-xl flex-row items-center justify-center">
        <Ionicons name="logo-apple" size={20} color="white" className="mr-2" />
        <Button>
          <Text>Sign Up with Apple</Text>
        </Button>
      </Pressable>

      <View className="mt-auto mb-6"></View>
    </SafeAreaView>
  );
}
