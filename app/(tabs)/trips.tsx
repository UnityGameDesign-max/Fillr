import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TRIPS } from "@/data/trips";

export default function Trips() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTrips = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return TRIPS;
    return TRIPS.filter((t) => {
      const title = `${t.from} to ${t.to}`.toLowerCase();
      return title.includes(q) || t.label.toLowerCase().includes(q) || t.note.toLowerCase().includes(q);
    });
  }, [searchQuery]);

  const renderItem = ({ item }: { item: (typeof TRIPS)[number] }) => {
    const title = `${item.from} to ${item.to}`;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push({ pathname: "/trip-details", params: { id: item.id } })}
        className="mx-4 mb-4 overflow-hidden rounded-2xl bg-white shadow-sm"
      >
        <View className="h-32 w-full items-center justify-center bg-blue-50">
          <Ionicons name="map-outline" size={28} color="#2563EB" />
        </View>

        <View className="p-4">
          <Text className="text-gray-500 text-sm">{item.label}</Text>
          <Text className="text-gray-900 text-lg font-bold mt-1">{title}</Text>

          <View className="mt-4 flex-row rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
            <View className="flex-1 items-center py-3">
              <Text className="text-gray-900 font-bold text-base">{item.distanceKm.toFixed(1)} km</Text>
              <Text className="text-gray-500 text-xs mt-0.5">Distance</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="flex-1 items-center py-3">
              <Text className="text-gray-900 font-bold text-base">{item.durationMin} min</Text>
              <Text className="text-gray-500 text-xs mt-0.5">Duration</Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="flex-1 items-center py-3">
              <Text className="text-gray-900 font-bold text-base">R {item.estCost.toFixed(2)}</Text>
              <Text className="text-gray-500 text-xs mt-0.5">Est. Cost</Text>
            </View>
          </View>

          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-gray-500 flex-1 pr-3">{item.note}</Text>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <View className="px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-gray-200"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-900">Trips</Text>

        <View className="w-10" />
      </View>

      <View className="px-4 pb-3">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-3 text-base text-gray-900"
            placeholder="Search by location or date"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
