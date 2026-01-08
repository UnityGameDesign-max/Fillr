import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Share, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TRIP_DETAILS } from "@/data/trips";
import { TripDetail } from "@/types/trip";

export default function TripDetails() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();

  const trip = useMemo(() => {
    const id = params?.id;
    return TRIP_DETAILS.find((t) => t.id === id) ?? TRIP_DETAILS[0];
  }, [params?.id]);

  const handleShare = async () => {
    await Share.share({
      message: `Trip Details\nDistance: ${trip.distanceKm} km\nDuration: ${trip.durationLabel}\nCost: R ${trip.cost.toFixed(2)}`,
    });
  };

  const fuelFillPct = Math.min(100, Math.max(0, (trip.efficiencyLPer100km / 12) * 100));

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-gray-200"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900">Trip Details</Text>

        <TouchableOpacity
          onPress={handleShare}
          className="w-10 h-10 items-center justify-center -mr-2 rounded-full active:bg-gray-200"
        >
          <Ionicons name="share-outline" size={22} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="h-44 mx-4 rounded-2xl bg-blue-50 items-center justify-center">
          <Ionicons name="map-outline" size={30} color="#2563EB" />
        </View>

        <View className="px-4 mt-4">
        <View className="flex-row gap-3">
          <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <Text className="text-gray-500 text-xs">Distance</Text>
            <Text className="text-gray-900 text-lg font-bold mt-1">{trip.distanceKm} km</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <Text className="text-gray-500 text-xs">Duration</Text>
            <Text className="text-gray-900 text-xl font-bold mt-1">{trip.durationLabel}</Text>
          </View>
          <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <Text className="text-gray-500 text-xs">Cost</Text>
            <Text className="text-gray-900 text-xl font-bold mt-1">R {trip.cost.toFixed(2)}</Text>
          </View>
        </View>

        <View className="mt-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex-row items-start">
          <View className="w-9 h-9 rounded-full bg-emerald-100 items-center justify-center mr-3">
            <Ionicons name="sparkles" size={18} color="#059669" />
          </View>
          <Text className="text-emerald-900 flex-1">{trip.insight}</Text>
        </View>

        <Text className="text-gray-900 font-bold text-lg mt-6 mb-3">Analytics</Text>

        <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <Text className="text-gray-500 text-xs">Fuel Analytics</Text>
          <View className="flex-row items-end mt-2">
            <Text className="text-gray-900 text-3xl font-bold">{trip.fuelConsumedL.toFixed(1)}</Text>
            <Text className="text-gray-500 ml-2 mb-1">L</Text>
            <Text className="text-gray-500 ml-2 mb-1">Consumed</Text>
          </View>
          <View className="flex-row items-center justify-between mt-3">
            <Text className="text-gray-500">Efficiency</Text>
            <Text className="text-gray-900 font-semibold">{trip.efficiencyLPer100km.toFixed(1)} L/100km</Text>
          </View>
          <View className="h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <View className="h-2 bg-yellow-400 rounded-full" style={{ width: `${fuelFillPct}%` }} />
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mt-4">
          <Text className="text-gray-500 text-xs">Speed Analytics</Text>
          <View className="flex-row items-end mt-2">
            <Text className="text-gray-900 text-3xl font-bold">{trip.avgSpeedKmh}</Text>
            <Text className="text-gray-500 ml-2 mb-1">km/h</Text>
            <Text className="text-gray-500 ml-2 mb-1">Average Speed</Text>
          </View>

          <View className="mt-4 h-20 flex-row items-end justify-between">
            {[22, 35, 18, 48, 28, 60, 40, 52, 30, 45, 25, 55].map((h, idx) => (
              <View key={idx} className="w-2 rounded-full bg-emerald-400/70" style={{ height: h }} />
            ))}
          </View>

          <View className="flex-row items-center justify-between mt-4">
            <Text className="text-gray-500">Max Speed</Text>
            <Text className="text-gray-900 font-semibold">{trip.maxSpeedKmh} km/h</Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mt-4">
          <View className="flex-row items-start">
            <View className="w-8 h-8 rounded-full bg-emerald-50 items-center justify-center mr-3">
              <Ionicons name="navigate" size={16} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold">{trip.startLabel}</Text>
              <Text className="text-gray-500 mt-1">{trip.startAddress}</Text>
              <Text className="text-gray-400 text-xs mt-1">{trip.startTime}</Text>
            </View>
          </View>

          <View className="h-px bg-gray-100 my-4" />

          <View className="flex-row items-start">
            <View className="w-8 h-8 rounded-full bg-rose-50 items-center justify-center mr-3">
              <Ionicons name="location" size={16} color="#F43F5E" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-semibold">{trip.endLabel}</Text>
              <Text className="text-gray-500 mt-1">{trip.endAddress}</Text>
              <Text className="text-gray-400 text-xs mt-1">{trip.endTime}</Text>
            </View>
          </View>
        </View>

        <View className="h-10" />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

