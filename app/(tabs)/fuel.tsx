import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { FlatList, Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FUEL_LOGS, FUEL_STATIONS } from "@/data/fuel";

export default function Fuel() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  // Theme colors
  const primaryColor = isDark ? "#0A84FF" : "#007AFF";
  const foregroundColor = isDark ? "#FFFFFF" : "#1F2937";
  const mutedColor = isDark ? "#CCCCCC" : "#6B7280";

  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [liters, setLiters] = useState('');
  const [cost, setCost] = useState('');

  const renderItem = ({ item }: { item: typeof FUEL_LOGS[0] }) => (
    <View className="bg-card rounded-2xl p-4 mb-4 shadow-sm mx-4 border border-border">
      {/* Header: Cost and Vehicle */}
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-xl font-bold text-foreground">{item.cost}</Text>
          <Text className="text-muted-foreground text-sm mt-1">{item.date}</Text>
        </View>
        <View className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-full">
          <Ionicons name="car-sport" size={14} color={primaryColor} style={{ marginRight: 4 }} />
          <Text className="text-primary text-xs font-semibold">{item.vehicle}</Text>
        </View>
      </View>

      {/* Station Info */}
      <View className="flex-row items-center mt-3">
        {/* Brand Icon Placeholder */}
        <View 
          className="w-12 h-12 rounded-full items-center justify-center mr-3 overflow-hidden"
          style={{ backgroundColor: `${item.brandColor}15` }}
        >
           {FUEL_STATIONS.find(s => s.id === item.logoType)?.image ? (
             <Image 
               source={{ uri: FUEL_STATIONS.find(s => s.id === item.logoType)?.image }} 
               style={{ width: 32, height: 32, borderRadius: 16 }}
               resizeMode="contain"
             />
           ) : (
             <MaterialCommunityIcons name="gas-station" size={24} color={item.brandColor} />
           )}
        </View>
        
        <View>
          <Text className="text-foreground font-semibold text-base">{item.station}</Text>
          <Text className="text-muted-foreground text-sm mt-0.5">{item.volume} @ {item.pricePerLiter}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-6 flex-row items-center justify-between">
        
        <Text className="text-3xl font-bold text-foreground">Fuel Log</Text>
        
        <View className="w-10" /> 
      </View>

      {/* Search Bar */}
      <View className="px-4 pb-4">
        <View className="flex-row items-center bg-card rounded-xl px-4 py-3 border border-border shadow-sm">
          <Ionicons name="search" size={20} color={mutedColor} />
          <TextInput 
            className="flex-1 ml-3 text-base text-foreground"
            placeholder="Search fuel logs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={mutedColor}
          />
        </View>
      </View>

      {/* List */}
      <FlatList
        data={FUEL_LOGS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
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

      {/* Add Fuel Log Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
           {/* Modal Content */}
           <View className="bg-background rounded-t-3xl h-[90%] w-full overflow-hidden">
             
             {/* Modal Header */}
             <View className="flex-row items-center justify-between px-6 py-4 bg-background border-b border-border">
               <TouchableOpacity 
                 onPress={() => setModalVisible(false)}
                 className="p-2 -ml-2"
               >
                 <Ionicons name="arrow-back" size={24} color={foregroundColor} />
               </TouchableOpacity>
               <Text className="text-xl font-bold text-foreground">Add Fuel Log</Text>
               <View className="w-10" />
             </View>

             <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
               
               {/* Select Fuel Station */}
               <Text className="text-foreground font-semibold mb-3 text-base">Select Fuel Station</Text>
               <View className="flex-row flex-wrap justify-between mb-2">
                 {FUEL_STATIONS.map((station) => (
                   <TouchableOpacity
                     key={station.id}
                     onPress={() => setSelectedStation(station.id)}
                     className={`w-[30%] aspect-square mb-4 rounded-2xl items-center justify-center border-2 ${
                       selectedStation === station.id 
                         ? 'bg-card border-primary shadow-sm' 
                         : 'bg-muted border-transparent'
                     }`}
                   >
                     {station.image ? (
                       <Image 
                         source={{ uri: station.image }} 
                         style={{ width: 40, height: 40 }}
                         resizeMode="contain"
                       />
                     ) : (
                       <MaterialCommunityIcons 
                         name={station.icon as any} 
                         size={32} 
                         color={selectedStation === station.id ? station.color : '#9CA3AF'} 
                       />
                     )}
                     {selectedStation === station.id && (
                        <Text 
                          className="text-xs font-medium mt-1" 
                          style={{ color: station.color }}
                        >
                          {station.name}
                        </Text>
                     )}
                   </TouchableOpacity>
                 ))}
               </View>

               {/* Liters Purchased */}
               <Text className="text-foreground font-semibold mb-2 text-base">Liters Purchased</Text>
               <View className="bg-card border border-input rounded-xl px-4 py-3 mb-6">
                 <TextInput
                   className="text-lg text-foreground"
                   placeholder="0.00 L"
                   keyboardType="decimal-pad"
                   value={liters}
                   onChangeText={setLiters}
                   placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                 />
               </View>

               {/* Total Cost */}
               <Text className="text-foreground font-semibold mb-2 text-base">Total Cost</Text>
               <View className="bg-card border border-input rounded-xl px-4 py-3 mb-6">
                 <TextInput
                   className="text-lg text-foreground"
                   placeholder="R 0.00"
                   keyboardType="decimal-pad"
                   value={cost}
                   onChangeText={setCost}
                   placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                 />
               </View>

               {/* Upload Receipt */}
               <TouchableOpacity 
                 className="border-2 border-dashed border-border rounded-2xl p-8 items-center justify-center bg-muted/10 mb-8"
                 activeOpacity={0.7}
               >
                 <View className="bg-muted p-3 rounded-full mb-3">
                   <Ionicons name="image-outline" size={28} color={isDark ? "#9CA3AF" : "#4B5563"} />
                 </View>
                 <Text className="text-foreground font-semibold text-base mb-1">Upload Receipt</Text>
                 <Text className="text-muted-foreground text-center text-sm">
                   Tap here to upload an image (Optional)
                 </Text>
               </TouchableOpacity>

               {/* Spacer for button visibility */}
               <View className="h-24" />
             </ScrollView>

             {/* Save Button */}
             <View className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t border-border">
               <TouchableOpacity 
                 className="bg-primary rounded-xl py-4 items-center shadow-lg"
                 activeOpacity={0.8}
                 onPress={() => setModalVisible(false)}
               >
                 <Text className="text-white font-bold text-lg">Save Fuel Log</Text>
               </TouchableOpacity>
             </View>
           </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
