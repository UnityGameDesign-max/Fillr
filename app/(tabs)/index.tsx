import { supabase } from "@/lib/supabase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- Components ---

const InfoBottomSheet = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="absolute inset-0" />
        </TouchableWithoutFeedback>
        
        <View className="bg-background rounded-t-3xl p-6 pb-10 shadow-2xl">
          <View className="items-center mb-4">
            <View className="w-12 h-1.5 bg-muted rounded-full" />
          </View>
          
          <Text className="text-xl font-bold text-foreground mb-6 text-center">
            Setting Realistic Targets
          </Text>
          
          <View className="gap-6">
             <View className="flex-row gap-4">
                 <View className="w-2 h-2 rounded-full bg-primary mt-2" />
                 <Text className="text-muted-foreground flex-1 text-base leading-6">
                    Consider your typical working hours and days per week
                 </Text>
             </View>
             <View className="flex-row gap-4">
                 <View className="w-2 h-2 rounded-full bg-primary mt-2" />
                 <Text className="text-muted-foreground flex-1 text-base leading-6">
                    Factor in fuel costs, maintenance, and other expenses
                 </Text>
             </View>
             <View className="flex-row gap-4">
                 <View className="w-2 h-2 rounded-full bg-primary mt-2" />
                 <Text className="text-muted-foreground flex-1 text-base leading-6">
                    Review and adjust targets monthly based on performance
                 </Text>
             </View>
             <View className="flex-row gap-4">
                 <View className="w-2 h-2 rounded-full bg-primary mt-2" />
                 <Text className="text-muted-foreground flex-1 text-base leading-6">
                    Daily targets should align with weekly and monthly goals
                 </Text>
             </View>
          </View>

          <Pressable 
            onPress={onClose}
            className="bg-primary py-4 rounded-xl items-center mt-8"
          >
            <Text className="text-primary-foreground font-bold text-lg">Got it</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const Header = ({ name }: { name: string }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const date = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <View className="flex-row justify-between items-start mb-6">
      <View>
        <View className="flex-row items-center gap-2 mb-1">
            <View className="w-8 h-8 text-foreground rounded-full items-center justify-center">
                 {/* Placeholder Avatar */}
                 <Image 
                    source={{ uri: `https://ui-avatars.com/api/?name=${name}&background=random` }} 
                    className="w-8 h-8 rounded-full"
                 />
            </View>
        </View>
        <Text className="text-2xl font-bold text-foreground">
          Good Morning, {name}
        </Text>
        <Text className="text-muted-foreground text-sm mt-1">{date}</Text>
      </View>
      <Pressable className="p-2 bg-background rounded-full shadow-sm">
        <Ionicons name="notifications-outline" size={24} color={isDark ? "#FFF" : "#1F2937"} />
      </Pressable>
    </View>
  );
};

// --- RideShare Dashboard ---

const RideShareDashboard = ({ name }: { name: string }) => {
  const [infoVisible, setInfoVisible] = useState(false);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getMood = (earning: number, fuel: number) => {
     if (earning >= fuel * 2) return '😃'; // Great profit
     if (earning > fuel) return '😐';      // Okay profit
     return '😔';                          // Loss or low profit
  };

  return (
    <View>
      <Header name={name} />

      {/* Stats Row 1 */}
      <View className="flex-row gap-4 mb-4">
        <View className="flex-1 bg-background p-4 rounded-2xl shadow-sm">
          <View className="flex-row justify-between items-start mb-1">
              <Text className="text-muted-foreground text-xs font-medium">Total Earnings</Text>
              <Text>💰</Text>
          </View>
          <Text className="text-xl font-bold text-foreground">R 1,250.00</Text>
        </View>
        <View className="flex-1 bg-background p-4 rounded-2xl shadow-sm">
          <View className="flex-row justify-between items-start mb-1">
              <Text className="text-muted-foreground text-xs font-medium">Fuel Cost</Text>
              <Text>⛽</Text>
          </View>
          <Text className="text-xl font-bold text-foreground">R 320.50</Text>
        </View>
      </View>



      {/* Net Profit Today */}
      <View className="bg-secondary/10 p-5 rounded-2xl mb-4 border border-secondary/20">
        <Text className="text-secondary font-medium mb-1">Net Profit Today</Text>
        <Text className="text-4xl font-bold text-secondary">R 929.50</Text>
      </View>

      {/* Daily Profit Target */}
      <View className="bg-background p-5 rounded-2xl shadow-sm mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-foreground font-bold text-base">Daily Profit Target</Text>
          <Text className="text-muted-foreground font-medium text-sm">R929.50 / R1,200</Text>
        </View>
        
        <View className="h-3 bg-muted rounded-full overflow-hidden mb-3">
          <View className="h-full bg-secondary rounded-full" style={{ width: '77%' }} />
        </View>
        
        <Text className="text-secondary font-medium text-center text-sm">R 270.50 to go!</Text>
      </View>

      <InfoBottomSheet visible={infoVisible} onClose={() => setInfoVisible(false)} />

      {/* Earnings vs Fuel Graph (Mock) */}
      <View className="bg-background p-5 rounded-2xl shadow-sm mb-6">
        <View className="flex-row justify-between items-center mb-4">
            <Text className="text-foreground font-semibold">Earnings vs Fuel Cost</Text>
        </View>
        <Text className="text-muted-foreground text-xs mb-4">Last 7 Days (21 - 28 May) <Text className="text-secondary">+12%</Text></Text>
        
        <View className="flex-row justify-between items-end h-40 px-2">
            {[
              { day: '21', earning: 80, fuel: 30 },
              { day: '22', earning: 90, fuel: 35 },
              { day: '23', earning: 70, fuel: 25 },
              { day: '24', earning: 100, fuel: 40 },
              { day: '25', earning: 85, fuel: 30 },
              { day: '26', earning: 95, fuel: 35 },
              { day: '27', earning: 110, fuel: 45 }
            ].map((item, i) => (
                <View key={i} className="items-center gap-2">
                    {/* Mood Emoji */}
                    <Text className="text-lg mb-1">{getMood(item.earning, item.fuel)}</Text>

                    {/* Bars */}
                    <View className="items-center gap-1">
                        <View className="w-8 bg-primary/20 rounded-t-sm" style={{ height: item.fuel }} />
                        <View className="w-8 bg-secondary rounded-b-sm" style={{ height: item.earning }} />
                    </View>
                    <Text className="text-muted-foreground text-xs">{item.day}</Text>
                </View>
            ))}
        </View>
      </View>

      {/* Avg Profit per Trip */}
      <View className="bg-background p-4 rounded-2xl shadow-sm mb-6 flex-row items-center justify-between">
         <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center">
                <Ionicons name="stats-chart" size={24} color={isDark ? "#60A5FA" : "#4F46E5"} />
            </View>
            <View>
                <Text className="text-foreground font-semibold">Avg. Profit per Trip</Text>
                <Text className="text-muted-foreground text-xs">Based on 15 trips today</Text>
            </View>
         </View>
         <Text className="text-primary font-bold text-lg">R 61.96</Text>
      </View>

      {/* Recent Activity */}
      <View className="mb-8">
        <Text className="text-foreground font-semibold text-lg mb-4">Recent Activity</Text>
        <View className="gap-3">
            <ActivityItem 
                icon="car" 
                title="Trip to Sandton City" 
                time="15:32" 
                amount="+ R 120.00" 
                isPositive 
            />
            <ActivityItem 
                icon="gas-pump" 
                title="Fuel at Shell" 
                time="14:01" 
                amount="- R 320.50" 
                isPositive={false} 
                iconType="fa"
            />
            <ActivityItem 
                icon="car" 
                title="Trip to OR Tambo" 
                time="12:15" 
                amount="+ R 250.00" 
                isPositive 
            />
        </View>
      </View>
    </View>
  );
};

const ActivityItem = ({ icon, title, time, amount, isPositive, iconType = "ion" }: any) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === 'dark';
    
    return (
    <View className="flex-row items-center justify-between bg-transparent">
        <View className="flex-row items-center gap-3">
            <View className={`w-10 h-10 rounded-full items-center justify-center ${isPositive ? 'bg-secondary/20' : 'bg-destructive/20'}`}>
                {iconType === 'ion' ? (
                     <Ionicons name={icon} size={20} color={isPositive ? (isDark ? "#4ADE80" : "#059669") : (isDark ? "#F87171" : "#D97706")} />
                ) : (
                    <MaterialCommunityIcons name={icon} size={20} color={isPositive ? (isDark ? "#4ADE80" : "#059669") : (isDark ? "#F87171" : "#D97706")} />
                )}
            </View>
            <View>
                <Text className="text-foreground font-medium">{title}</Text>
                <Text className="text-muted-foreground text-xs">{time}</Text>
            </View>
        </View>
        <Text className={`font-semibold ${isPositive ? 'text-secondary' : 'text-destructive'}`}>{amount}</Text>
    </View>
    );
};

// --- Regular Driver Dashboard ---

const RegularDashboard = ({ name }: { name: string }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View>
       <Header name={name} />

        {/* Stats Row */}
       <View className="flex-row gap-4 mb-4">
        <View className="flex-1 bg-background p-4 rounded-2xl shadow-sm">
          <Text className="text-muted-foreground text-xs font-medium mb-1">Fuel Consumption</Text>
          <View className="flex-row items-baseline gap-1">
             <Text className="text-2xl font-bold text-foreground">14.2</Text>
             <Text className="text-muted-foreground text-sm">km/L</Text>
          </View>
        </View>
        <View className="flex-1 bg-background p-4 rounded-2xl shadow-sm">
          <Text className="text-muted-foreground text-xs font-medium mb-1">Cost/Kilometer</Text>
          <View className="flex-row items-baseline gap-1">
             <Text className="text-2xl font-bold text-foreground">R2.10</Text>
             <Text className="text-muted-foreground text-sm">/km</Text>
          </View>
        </View>
      </View>

      <View className="bg-background p-4 rounded-2xl shadow-sm mb-6">
          <Text className="text-muted-foreground text-xs font-medium mb-1">This Month's Fuel Spend</Text>
          <Text className="text-3xl font-bold text-foreground">R1,850.75</Text>
      </View>

      {/* Map Card */}
      <View className="bg-background rounded-2xl shadow-sm overflow-hidden mb-6">
        <View className="h-32 bg-primary/20 relative">
            {/* Placeholder Map */}
             <Image 
                source={{ uri: "https://maps.googleapis.com/maps/api/staticmap?center=-26.1076,28.0567&zoom=13&size=600x300&maptype=roadmap&key=YOUR_API_KEY_HERE" }} // Mock
                className="w-full h-full opacity-50"
             />
             <View className="absolute inset-0 items-center justify-center">
                 <Ionicons name="map" size={40} color={isDark ? "#60A5FA" : "#3B82F6"} opacity={0.5} />
             </View>
        </View>
        <View className="p-4">
            <Text className="text-muted-foreground text-xs font-medium mb-1">Today's Summary</Text>
            <Text className="text-xl font-bold text-foreground mb-4">45 km driven across 3 trips</Text>
            
            <View className="flex-row justify-between items-center">
                 <Text className="text-muted-foreground font-medium">Est. fuel cost: R94.50</Text>
                 <Pressable className="bg-secondary px-4 py-2 rounded-lg">
                    <Text className="text-secondary-foreground font-semibold">View Trips</Text>
                 </Pressable>
            </View>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row gap-4 mb-6">
        <Pressable className="flex-1 bg-secondary/20 py-4 rounded-xl items-center justify-center gap-2">
            <Ionicons name="add-circle-outline" size={24} color={isDark ? "#4ADE80" : "#059669"} />
            <Text className="text-secondary font-semibold">Log New Trip</Text>
        </Pressable>
        <Pressable className="flex-1 bg-primary/20 py-4 rounded-xl items-center justify-center gap-2">
            <MaterialCommunityIcons name="gas-station" size={24} color={isDark ? "#60A5FA" : "#2563EB"} />
            <Text className="text-primary font-semibold">Add Fuel-Up</Text>
        </Pressable>
      </View>

      {/* Fuel Saving Tip */}
      <View className="bg-background p-5 rounded-2xl shadow-sm mb-6 border-l-4 border-primary">
        <Text className="text-primary text-xs font-bold mb-1 uppercase">Fuel Saving Tip</Text>
        <Text className="text-foreground font-bold text-lg mb-2">Avoid harsh acceleration to save up to 15% on fuel</Text>
        <Text className="text-muted-foreground leading-5">Maintaining a steady speed is key. Gentle starts and stops make a big difference to your efficiency.</Text>
      </View>

       {/* Consumption Graph */}
       <View className="bg-background p-5 rounded-2xl shadow-sm mb-8">
         <View className="flex-row justify-between items-center mb-4">
             <Text className="text-foreground font-semibold">Consumption (Last 7 Days)</Text>
         </View>
         <View className="flex-row items-baseline gap-2 mb-4">
            <Text className="text-3xl font-bold text-foreground">14.5</Text>
            <Text className="text-muted-foreground text-sm">km/L</Text>
            <Text className="text-secondary text-sm font-medium">+2.5%</Text>
         </View>
         
         {/* Simple Line Graph Placeholder */}
         <View className="h-32 flex-row items-end justify-between px-2">
            {[40, 60, 50, 80, 70, 40, 90].map((h, i) => (
                 <View key={i} className="items-center gap-2">
                    <View className="w-1 bg-secondary rounded-full" style={{ height: `${h}%` }} />
                    <Text className="text-muted-foreground text-xs">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</Text>
                 </View>
            ))}
         </View>
       </View>

    </View>
  );
};


export default function Home() {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string>("Driver");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
            // Get name from metadata or email
            const metaName = user.user_metadata?.full_name || user.user_metadata?.first_name;
            if (metaName) {
                setName(metaName);
            } else if (user.email) {
                setName(user.email.split('@')[0]);
            }

            // Fetch Profile Role
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            
            if (profile) {
                setRole(profile.role);
            }
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading && !refreshing) {
      return (
          <SafeAreaView className="flex-1 bg-card items-center justify-center">
              <ActivityIndicator size="large" color="#2563EB" />
          </SafeAreaView>
      )
  }

  return (
    <SafeAreaView className="flex-1 bg-card" edges={['top']}>
      <ScrollView 
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {role === 'EHAILING' ? (
            <RideShareDashboard name={name} />
        ) : (
            <RegularDashboard name={name} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
