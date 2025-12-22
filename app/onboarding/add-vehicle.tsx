import { AppText } from "@/components/shared/AppText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { onboardingStore } from "./store/onboardingStore";

const FUEL_TYPES = [
  { id: "PETROL", name: "Petrol", icon: "flash" },
  { id: "DIESEL", name: "Diesel", icon: "flame" },
];

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export default function AddVehicle() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<string | null>(null);
  const [engine, setEngine] = useState("");
  const [fuelType, setFuelType] = useState<string | null>(null);
  const [odometer, setOdometer] = useState("");

  const isValid =
    make.trim() &&
    model.trim() &&
    year &&
    engine.trim() &&
    fuelType &&
    odometer.trim();

  const handleContinue = async () => {
    if (!isValid) return;

    onboardingStore.vehicle = {
      make: make.trim(),
      model: model.trim(),
      year: parseInt(year!),
      engine: engine.trim(),
      fuelType: fuelType!,
      odometer: parseInt(odometer.trim()),
    };
    onboardingStore.currentStep = 3;
    router.replace("/onboarding/select-role");
  };

  const handleBack = () => {
    onboardingStore.currentStep = 1;
    router.replace("/onboarding/select-province");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      <View className="px-5 pt-10">
        <Pressable
          onPress={handleBack}
          className="mb-4 w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
        <View className="mb-6">
          <AppText className="text-sm font-medium text-gray-500 mb-1">
            Question 2/3
          </AppText>
          <AppText className="text-3xl font-bold text-gray-900 mb-1">
            Add Your Vehicle
          </AppText>
          <AppText className="text-gray-600">
            Help us track your fuel efficiency accurately.
          </AppText>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Make */}
        <View className="mb-4">
          <AppText className="text-sm font-semibold text-gray-700 mb-2">
            Make *
          </AppText>
          <TextInput
            value={make}
            onChangeText={setMake}
            placeholder="e.g., Toyota, Ford, BMW"
            className="w-full p-4 rounded-xl border border-gray-300 bg-white text-base"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Model */}
        <View className="mb-4">
          <AppText className="text-sm font-semibold text-gray-700 mb-2">
            Model *
          </AppText>
          <TextInput
            value={model}
            onChangeText={setModel}
            placeholder="e.g., Corolla, Focus, 3 Series"
            className="w-full p-4 rounded-xl border border-gray-300 bg-white text-base"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Year */}
        <View className="mb-4">
          <AppText className="text-sm font-semibold text-gray-700 mb-2">
            Year *
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-2"
          >
            <View className="flex-row gap-2">
              {YEARS.map((yr) => {
                const isSelected = year === String(yr);
                return (
                  <Pressable
                    key={yr}
                    onPress={() => setYear(String(yr))}
                    className={`px-4 py-2 rounded-lg border ${
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <AppText
                      className={`text-base ${
                        isSelected ? "text-blue-600 font-semibold" : "text-gray-700"
                      }`}
                    >
                      {yr}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Engine */}
        <View className="mb-4">
          <AppText className="text-sm font-semibold text-gray-700 mb-2">
            Engine *
          </AppText>
          <TextInput
            value={engine}
            onChangeText={setEngine}
            placeholder="e.g., 1.6L, 2.0L Turbo"
            className="w-full p-4 rounded-xl border border-gray-300 bg-white text-base"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Fuel Type */}
        <View className="mb-4">
          <AppText className="text-sm font-semibold text-gray-700 mb-2">
            Fuel Type *
          </AppText>
          <View className="flex-row gap-3">
            {FUEL_TYPES.map((type) => {
              const isSelected = fuelType === type.id;
              return (
                <Pressable
                  key={type.id}
                  onPress={() => setFuelType(type.id)}
                  className={`flex-1 p-4 rounded-xl border flex-row items-center justify-center gap-2 ${
                    isSelected
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  <Ionicons
                    name={type.icon as any}
                    size={20}
                    color={isSelected ? "#2563EB" : "#6B7280"}
                  />
                  <AppText
                    className={`text-base font-semibold ${
                      isSelected ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {type.name}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Current Odometer */}
        <View className="mb-4">
          <AppText className="text-sm font-semibold text-gray-700 mb-2">
            Current Odometer (Km) *
          </AppText>
          <TextInput
            value={odometer}
            onChangeText={setOdometer}
            placeholder="e.g., 50000"
            keyboardType="numeric"
            className="w-full p-4 rounded-xl border border-gray-300 bg-white text-base"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </ScrollView>

      <View className="px-5 pb-8 pt-4">
        <Pressable
          disabled={!isValid}
          onPress={handleContinue}
          className={`h-14 rounded-xl items-center justify-center 
            ${isValid ? "bg-blue-600" : "bg-gray-300"}`}
        >
          <AppText className="text-white font-semibold text-base">
            Continue
          </AppText>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
