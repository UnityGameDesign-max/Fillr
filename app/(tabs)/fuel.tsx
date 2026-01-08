import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FUEL_LOGS, FUEL_STATIONS } from "@/data/fuel";

export default function Fuel() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [liters, setLiters] = useState('');
  const [cost, setCost] = useState('');

  const renderItem = ({ item }: { item: typeof FUEL_LOGS[0] }) => (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm mx-4">
      {/* Header: Cost and Vehicle */}
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-xl font-bold text-gray-900">{item.cost}</Text>
          <Text className="text-gray-500 text-sm mt-1">{item.date}</Text>
        </View>
        <View className="flex-row items-center bg-blue-50 px-3 py-1.5 rounded-full">
          <Ionicons name="car-sport" size={14} color="#2563EB" style={{ marginRight: 4 }} />
          <Text className="text-blue-600 text-xs font-semibold">{item.vehicle}</Text>
        </View>
      </View>

      {/* Station Info */}
      <View className="flex-row items-center mt-3">
        {/* Brand Icon Placeholder */}
        <View 
          className="w-12 h-12 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${item.brandColor}15` }}
        >
           <MaterialCommunityIcons name="gas-station" size={24} color={item.brandColor} />
        </View>
        
        <View>
          <Text className="text-gray-900 font-semibold text-base">{item.station}</Text>
          <Text className="text-gray-500 text-sm mt-0.5">{item.volume} @ {item.pricePerLiter}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-gray-200"
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <Text className="text-xl font-bold text-gray-900">Fuel Log</Text>
        
        <View className="w-10" /> 
      </View>

      {/* Search Bar */}
      <View className="px-4 pb-4">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput 
            className="flex-1 ml-3 text-base text-gray-900"
            placeholder="Search fuel logs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
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
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-600 rounded-full items-center justify-center shadow-lg"
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={32} color="white" />
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
           <View className="bg-gray-50 rounded-t-3xl h-[90%] w-full overflow-hidden">
             
             {/* Modal Header */}
             <View className="flex-row items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
               <TouchableOpacity 
                 onPress={() => setModalVisible(false)}
                 className="p-2 -ml-2"
               >
                 <Ionicons name="arrow-back" size={24} color="#1F2937" />
               </TouchableOpacity>
               <Text className="text-xl font-bold text-gray-900">Add Fuel Log</Text>
               <View className="w-10" />
             </View>

             <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
               
               {/* Select Fuel Station */}
               <Text className="text-gray-700 font-semibold mb-3 text-base">Select Fuel Station</Text>
               <View className="flex-row flex-wrap justify-between mb-2">
                 {FUEL_STATIONS.map((station) => (
                   <TouchableOpacity
                     key={station.id}
                     onPress={() => setSelectedStation(station.id)}
                     className={`w-[30%] aspect-square mb-4 rounded-2xl items-center justify-center border-2 ${
                       selectedStation === station.id 
                         ? 'bg-white border-blue-600 shadow-sm' 
                         : 'bg-gray-100 border-transparent'
                     }`}
                   >
                     <MaterialCommunityIcons 
                       name={station.icon as any} 
                       size={32} 
                       color={selectedStation === station.id ? station.color : '#9CA3AF'} 
                     />
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
               <Text className="text-gray-700 font-semibold mb-2 text-base">Liters Purchased</Text>
               <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6">
                 <TextInput
                   className="text-lg text-gray-900"
                   placeholder="0.00 L"
                   keyboardType="decimal-pad"
                   value={liters}
                   onChangeText={setLiters}
                   placeholderTextColor="#9CA3AF"
                 />
               </View>

               {/* Total Cost */}
               <Text className="text-gray-700 font-semibold mb-2 text-base">Total Cost</Text>
               <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 mb-6">
                 <TextInput
                   className="text-lg text-gray-900"
                   placeholder="R 0.00"
                   keyboardType="decimal-pad"
                   value={cost}
                   onChangeText={setCost}
                   placeholderTextColor="#9CA3AF"
                 />
               </View>

               {/* Upload Receipt */}
               <TouchableOpacity 
                 className="border-2 border-dashed border-gray-300 rounded-2xl p-8 items-center justify-center bg-gray-50 mb-8"
                 activeOpacity={0.7}
               >
                 <View className="bg-gray-200 p-3 rounded-full mb-3">
                   <Ionicons name="image-outline" size={28} color="#4B5563" />
                 </View>
                 <Text className="text-gray-900 font-semibold text-base mb-1">Upload Receipt</Text>
                 <Text className="text-gray-500 text-center text-sm">
                   Tap here to upload an image (Optional)
                 </Text>
               </TouchableOpacity>

               {/* Spacer for button visibility */}
               <View className="h-24" />
             </ScrollView>

             {/* Save Button */}
             <View className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-100">
               <TouchableOpacity 
                 className="bg-blue-600 rounded-xl py-4 items-center shadow-lg"
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
