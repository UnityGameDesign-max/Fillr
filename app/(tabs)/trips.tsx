import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useMemo, useState } from "react";
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TRIPS } from "@/data/trips";

export default function Trips() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  
  // Theme colors
  const primaryColor = isDark ? "#0A84FF" : "#007AFF";
  const foregroundColor = isDark ? "#FFFFFF" : "#1F2937";
  const mutedColor = isDark ? "#CCCCCC" : "#6B7280";
  const cardColor = isDark ? "#1C1C1E" : "#FFFFFF";
  const inputBg = isDark ? "#2C2C2E" : "#F3F4F6";

  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Manual Entry State
  const [tripTitle, setTripTitle] = useState("");
  const [date, setDate] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [odoStart, setOdoStart] = useState("");
  const [odoEnd, setOdoEnd] = useState("");

  const handleSaveTrip = () => {
    setIsTracking(false);
    setShowSuccess(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setShowSuccess(false);
    setIsTracking(false);
    // Reset form
    setTripTitle("");
    setDate("");
    setStartLocation("");
    setEndLocation("");
    setOdoStart("");
    setOdoEnd("");
  };

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
        className="mx-4 mb-4 overflow-hidden rounded-2xl bg-card shadow-sm border border-border"
      >
        <View className="h-32 w-full items-center justify-center bg-primary/10">
          <Ionicons name="map-outline" size={28} color={primaryColor} />
        </View>

        <View className="p-4">
          <Text className="text-muted-foreground text-sm">{item.label}</Text>
          <Text className="text-foreground text-lg font-bold mt-1">{title}</Text>

          <View className="mt-4 flex-row rounded-xl border border-border bg-muted/20 overflow-hidden">
            <View className="flex-1 items-center py-3">
              <Text className="text-foreground font-bold text-base">{item.distanceKm.toFixed(1)} km</Text>
              <Text className="text-muted-foreground text-xs mt-0.5">Distance</Text>
            </View>
            <View className="w-px bg-border" />
            <View className="flex-1 items-center py-3">
              <Text className="text-foreground font-bold text-base">{item.durationMin} min</Text>
              <Text className="text-muted-foreground text-xs mt-0.5">Duration</Text>
            </View>
            <View className="w-px bg-border" />
            <View className="flex-1 items-center py-3">
              <Text className="text-foreground font-bold text-base">R {item.estCost.toFixed(2)}</Text>
              <Text className="text-muted-foreground text-xs mt-0.5">Est. Cost</Text>
            </View>
          </View>

          <View className="mt-4 flex-row items-center justify-between">
            <Text className="text-muted-foreground flex-1 pr-3">{item.note}</Text>
            <Ionicons name="chevron-forward" size={18} color={mutedColor} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <View className="px-4 py-6 flex-row items-center justify-between">

        <Text className="text-3xl font-bold text-foreground">Trips</Text>

        <View className="w-10" />
      </View>

      <View className="px-4 pb-3">
        <View className="flex-row items-center bg-card rounded-xl px-4 py-3 border border-border shadow-sm">
          <Ionicons name="search" size={20} color={mutedColor} />
          <TextInput
            className="flex-1 ml-3 text-base text-foreground"
            placeholder="Search by location or date"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={mutedColor}
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

      {/* FAB */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Log New Trip Modal (Custom Implementation) */}
      {modalVisible && (
        <View className="absolute top-0 bottom-0 left-0 right-0 z-50">
          <TouchableOpacity 
            className="absolute inset-0 bg-black/50"
            activeOpacity={1}
            onPress={handleCloseModal}
          />
          <View className="flex-1 justify-end" pointerEvents="box-none">
           {showSuccess ? (
             // Success View
             <View className="bg-background rounded-t-3xl h-[92%] w-full overflow-hidden items-center pt-10 px-6">
                
                {/* Success Icon */}
                <View className="w-24 h-24 bg-emerald-100 rounded-full items-center justify-center mb-6 shadow-sm">
                  <Ionicons name="checkmark" size={48} color="#10B981" />
                </View>

                <Text className="text-2xl font-bold text-foreground text-center mb-2">Trip Successfully Logged</Text>
                <Text className="text-muted-foreground text-center mb-8 px-4 leading-6">
                  Your journey details have been saved securely.
                </Text>

                {/* Trip Details Card */}
                <View className="w-full bg-card rounded-3xl border border-border shadow-sm overflow-hidden mb-8">
                  {/* Map Placeholder Header */}
                  <View className="h-24 bg-muted/20 items-center justify-center border-b border-border">
                    <Ionicons name="map" size={32} color={mutedColor} />
                  </View>
                  
                  <View className="p-5">
                    <Text className="text-xl font-bold text-foreground mb-1">Client Meeting - Downtown</Text>
                    <Text className="text-muted-foreground text-sm mb-6">Oct 24, 2023 • 9:45 AM</Text>

                    <View className="flex-row items-center justify-between mb-6">
                      <View>
                        <Text className="text-xs font-bold text-muted-foreground uppercase mb-1">TOTAL DISTANCE</Text>
                        <View className="flex-row items-baseline">
                          <Text className="text-3xl font-bold text-primary">25.4</Text>
                          <Text className="text-base font-medium text-muted-foreground ml-1">km</Text>
                        </View>
                      </View>
                      
                      <View className="bg-emerald-100 px-3 py-2 rounded-xl items-end">
                         <Text className="text-emerald-700 font-bold text-lg">R 4.50</Text>
                         <Text className="text-emerald-700/70 text-[10px] font-bold">Est. Cost</Text>
                      </View>
                    </View>

                    {/* Odometer Visualization */}
                    <Text className="text-xs font-bold text-muted-foreground uppercase mb-3">ODOMETER READING</Text>
                    <View className="bg-muted/30 rounded-xl p-4 flex-row items-center justify-between mb-6">
                       <View>
                         <Text className="text-[10px] text-muted-foreground font-medium mb-0.5">Start</Text>
                         <Text className="text-foreground font-bold text-base">12,450</Text>
                       </View>
                       
                       <View className="flex-1 h-px bg-border mx-4 relative">
                          <View className="absolute right-0 -top-1">
                             <Ionicons name="arrow-forward" size={12} color={mutedColor} />
                          </View>
                       </View>

                       <View className="items-end">
                         <Text className="text-[10px] text-muted-foreground font-medium mb-0.5">End</Text>
                         <Text className="text-foreground font-bold text-base">12,475</Text>
                       </View>
                    </View>

                    {/* Tags */}
                    <View className="flex-row gap-2">
                      <View className="flex-row items-center border border-border rounded-lg px-2 py-1.5 bg-background">
                        <Ionicons name="briefcase" size={12} color={mutedColor} style={{ marginRight: 4 }} />
                        <Text className="text-xs text-muted-foreground font-medium">Business</Text>
                      </View>
                      <View className="flex-row items-center border border-border rounded-lg px-2 py-1.5 bg-background">
                        <Ionicons name="leaf" size={12} color={mutedColor} style={{ marginRight: 4 }} />
                        <Text className="text-xs text-muted-foreground font-medium">Fuel Efficient</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Actions */}
                <TouchableOpacity 
                  className="w-full bg-primary h-14 rounded-xl flex-row items-center justify-center mb-4 shadow-lg shadow-primary/20"
                  activeOpacity={0.8}
                  onPress={handleCloseModal}
                >
                  <Ionicons name="list" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text className="text-white font-bold text-base">View All Trips</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  className="py-2"
                  onPress={handleCloseModal}
                >
                  <Text className="text-primary font-bold text-base">Back to Dashboard</Text>
                </TouchableOpacity>

             </View>
           ) : isTracking ? (
             // Active Tracking View
             <View className="bg-background rounded-t-3xl w-full pb-10 pt-4 px-6">
                {/* Drag Handle */}
                <View className="items-center mb-8">
                  <View className="w-12 h-1 bg-muted rounded-full" />
                </View>

                {/* Stats Row */}
                <View className="flex-row justify-between mb-8">
                  {/* Distance */}
                  <View className="items-center flex-1">
                    <View className="flex-row items-center mb-1">
                       <Ionicons name="location-sharp" size={12} color={mutedColor} style={{ marginRight: 4 }} />
                       <Text className="text-xs font-bold text-muted-foreground uppercase">DIST.</Text>
                    </View>
                    <View className="flex-row items-baseline">
                      <Text className="text-3xl font-bold text-foreground">12.5</Text>
                      <Text className="text-base font-medium text-muted-foreground ml-1">km</Text>
                    </View>
                  </View>

                  {/* Divider */}
                  <View className="w-px bg-border h-10 self-center" />

                  {/* Time */}
                  <View className="items-center flex-1">
                    <View className="flex-row items-center mb-1">
                       <Ionicons name="time" size={12} color={mutedColor} style={{ marginRight: 4 }} />
                       <Text className="text-xs font-bold text-muted-foreground uppercase">TIME</Text>
                    </View>
                    <Text className="text-3xl font-bold text-foreground">18:45</Text>
                  </View>

                  {/* Divider */}
                  <View className="w-px bg-border h-10 self-center" />

                  {/* Cost */}
                  <View className="items-center flex-1">
                    <View className="flex-row items-center mb-1">
                       <Ionicons name="wallet" size={12} color={mutedColor} style={{ marginRight: 4 }} />
                       <Text className="text-xs font-bold text-muted-foreground uppercase">EST.</Text>
                    </View>
                    <View className="flex-row items-baseline">
                      <Text className="text-xl font-bold text-emerald-500">R</Text>
                      <Text className="text-3xl font-bold text-emerald-500 ml-1">65</Text>
                      <Text className="text-sm font-bold text-emerald-500">.00</Text>
                    </View>
                  </View>
                </View>

                {/* Speed & Signal Card */}
                <View className="bg-input rounded-2xl p-4 flex-row items-center justify-between mb-8">
                   <View className="flex-row items-center">
                     <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                        <Ionicons name="speedometer" size={20} color="#2563EB" />
                     </View>
                     <View>
                       <Text className="text-xs text-muted-foreground font-medium mb-0.5">Current Speed</Text>
                       <Text className="text-lg font-bold text-foreground">64 km/h</Text>
                     </View>
                   </View>

                   <View className="flex-row items-center border-l border-border pl-4">
                     <View>
                       <Text className="text-xs text-muted-foreground font-medium mb-0.5">GPS Signal</Text>
                       <Text className="text-emerald-500 font-bold">Strong</Text>
                     </View>
                     <Ionicons name="cellular" size={20} color="#10B981" style={{ marginLeft: 8 }} />
                   </View>
                </View>

                {/* Stop Button */}
                <TouchableOpacity 
                  className="bg-primary h-16 rounded-2xl flex-row items-center justify-center mb-4 shadow-lg shadow-primary/20"
                  activeOpacity={0.8}
                  onPress={handleSaveTrip}
                >
                  <View className="w-6 h-6 bg-white/20 rounded-md items-center justify-center mr-3">
                     <View className="w-3 h-3 bg-white rounded-sm" />
                  </View>
                  <Text className="text-white font-bold text-lg">Stop Trip</Text>
                </TouchableOpacity>

                {/* Footer Info */}
                <Text className="text-center text-muted-foreground text-xs">
                  Trip started at 08:30 AM • 142 Main Rd, Cape Town
                </Text>
             </View>
           ) : (
             // Setup View
             <View className="bg-background rounded-t-3xl h-[92%] w-full overflow-hidden">
             
               {/* Header */}
               <View className="flex-row items-center justify-between px-6 py-4 bg-background border-b border-border">
                 <TouchableOpacity 
                   onPress={handleCloseModal}
                   className="p-2 -ml-2"
                 >
                   <Ionicons name="close" size={24} color={foregroundColor} />
                 </TouchableOpacity>
                 <Text className="text-xl font-bold text-foreground">Log New Trip</Text>
                 <View className="w-10" />
               </View>

               <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                 <Text className="text-2xl font-bold text-foreground mb-1">How are you traveling?</Text>
                 <Text className="text-muted-foreground mb-6">Choose to track live or log a past journey.</Text>

                 {/* Live Tracking Card */}
                 <View className="bg-card rounded-3xl p-6 mb-8 border border-border shadow-sm relative overflow-hidden">
                   <View className="flex-row items-center mb-3">
                     <View className="bg-emerald-500/10 px-2 py-1 rounded-md flex-row items-center">
                       <MaterialCommunityIcons name="satellite-variant" size={14} color="#10B981" style={{ marginRight: 4 }} />
                       <Text className="text-emerald-500 text-xs font-bold tracking-wider">LIVE TRACKING</Text>
                     </View>
                   </View>
                   
                   <Text className="text-xl font-bold text-foreground mb-2">Start GPS Trip</Text>
                   <Text className="text-muted-foreground leading-5 mb-6">
                     Automatically track route, time, and mileage using your device's sensors.
                   </Text>

                   <TouchableOpacity 
                     className="bg-[#10B981] py-3 px-6 rounded-full self-start flex-row items-center"
                     activeOpacity={0.8}
                     onPress={() => setIsTracking(true)}
                   >
                     <Ionicons name="play" size={18} color="white" style={{ marginRight: 6 }} />
                     <Text className="text-white font-bold">Start Driving</Text>
                   </TouchableOpacity>
                 </View>

                 {/* Manual Entry Header */}
                 <View className="flex-row items-center justify-between mb-4">
                   <Text className="text-xl font-bold text-foreground">Manual Entry</Text>
                   <TouchableOpacity className="flex-row items-center bg-indigo-500/10 px-3 py-1.5 rounded-full">
                      <Ionicons name="sparkles" size={14} color="#6366F1" style={{ marginRight: 4 }} />
                      <Text className="text-indigo-500 text-xs font-bold">AI Autofill</Text>
                   </TouchableOpacity>
                 </View>

                 {/* Manual Entry Form */}
                 <View className="bg-card rounded-3xl p-5 border border-border shadow-sm mb-24">
                   
                   {/* Trip Title */}
                   <View className="mb-4">
                     <Text className="text-xs font-bold text-muted-foreground uppercase mb-2 ml-1">Trip Title</Text>
                     <TextInput
                       className="bg-input rounded-xl px-4 py-3 text-foreground"
                       placeholder="e.g., Client Meeting - Sandton"
                       placeholderTextColor={mutedColor}
                       value={tripTitle}
                       onChangeText={setTripTitle}
                     />
                   </View>

                   {/* Date */}
                   <View className="mb-4">
                     <Text className="text-xs font-bold text-muted-foreground uppercase mb-2 ml-1">Date</Text>
                     <View className="bg-input rounded-xl px-4 py-3 flex-row items-center justify-between">
                       <TextInput
                          className="flex-1 text-foreground"
                          placeholder="mm/dd/yyyy"
                          placeholderTextColor={mutedColor}
                          value={date}
                          onChangeText={setDate}
                        />
                        <Ionicons name="calendar-outline" size={20} color={mutedColor} />
                     </View>
                   </View>

                   {/* Route */}
                   <View className="mb-4">
                     <Text className="text-xs font-bold text-muted-foreground uppercase mb-2 ml-1">Route</Text>
                     <View className="relative">
                       {/* Connector Line */}
                       <View 
                          className="absolute left-[21px] top-10 bottom-10 w-[1.5px] border-l-[1.5px] border-dashed border-muted-foreground/40 z-0" 
                          style={{ transform: [{ translateX: -0.75 }] }}
                       />

                       {/* Start Input */}
                       <View className="bg-input rounded-xl px-4 py-3 flex-row items-center mb-2 z-10">
                         <View className="w-5 h-5 rounded-full border-[2.5px] border-blue-600 mr-3 bg-transparent" />
                         <TextInput
                           className="flex-1 text-foreground text-base"
                           placeholder="Start Location"
                           placeholderTextColor={mutedColor}
                           value={startLocation}
                           onChangeText={setStartLocation}
                         />
                       </View>
                       
                       {/* End Input */}
                       <View className="bg-input rounded-xl px-4 py-3 flex-row items-center z-10">
                         <View className="w-5 h-5 rounded-[4px] border-[2.5px] border-emerald-600 mr-3 bg-transparent" />
                         <TextInput
                           className="flex-1 text-foreground text-base"
                           placeholder="End Location"
                           placeholderTextColor={mutedColor}
                           value={endLocation}
                           onChangeText={setEndLocation}
                         />
                       </View>
                     </View>
                   </View>

                   {/* Odometer */}
                   <View className="mb-6">
                     <View className="flex-row justify-between items-end mb-2 ml-1">
                       <Text className="text-xs font-bold text-muted-foreground uppercase">Odometer Reading (km)</Text>
                       <TouchableOpacity>
                         <Text className="text-xs font-bold text-primary">Calculate distance</Text>
                       </TouchableOpacity>
                     </View>
                     
                     <View className="flex-row items-center gap-3">
                       <View className="flex-1 bg-input rounded-xl px-4 py-3 flex-row items-center">
                         <Text className="text-xs font-bold text-muted-foreground uppercase mr-3">START</Text>
                         <TextInput
                           className="flex-1 text-foreground font-medium text-base"
                           placeholder="00000"
                           placeholderTextColor={mutedColor}
                           keyboardType="numeric"
                           value={odoStart}
                           onChangeText={setOdoStart}
                         />
                       </View>
                       <Ionicons name="arrow-forward" size={16} color={mutedColor} />
                       <View className="flex-1 bg-input rounded-xl px-4 py-3 flex-row items-center">
                          <Text className="text-xs font-bold text-muted-foreground uppercase mr-3">END</Text>
                          <TextInput
                            className="flex-1 text-foreground font-medium text-base"
                            placeholder="00000"
                            placeholderTextColor={mutedColor}
                            keyboardType="numeric"
                            value={odoEnd}
                            onChangeText={setOdoEnd}
                          />
                       </View>
                     </View>
                   </View>

                   {/* Save Button */}
                   <TouchableOpacity 
                     className="bg-primary rounded-xl py-4 items-center shadow-lg"
                     activeOpacity={0.8}
                     onPress={handleSaveTrip}
                   >
                     <Text className="text-white font-bold text-base">Save Log Entry</Text>
                   </TouchableOpacity>

                 </View>
               </ScrollView>
             </View>
           )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
