import { ITransferOffer } from "@/types/transfer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TransferItemProps {
  data: ITransferOffer | null;
  refreshLoading?: boolean;
  onRefresh?: () => Promise<void>;
}

const TransferItem: React.FC<TransferItemProps> = ({
  data: offer,
  refreshLoading,
  onRefresh,
}) => {
  if (!offer) return null;

  const {
    vehicleName,
    vehicleType,
    capacity,
    image,
    totalAmount,
    currency,
    pickupPoint,
    destinationPoint,
    waitingTime,
  } = offer;

  return (
    <View className="mb-4 shadow-xl shadow-purple-200">
      <LinearGradient
        colors={["#844AFF", "#C427E0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 24, padding: 1, elevation: 5 }}
      >
        <View className="bg-white/95 rounded-[23px] p-5 overflow-hidden">
          {/* HEADER SECTION: Vehicle & Capacity */}
          <View className="flex flex-row justify-between items-start mb-5">
            <View className="flex-1 pr-3">
              <Text className="font-dm-sans-bold text-[10px] text-purple-500 uppercase tracking-[2px] mb-1">
                {vehicleType} Transfer
              </Text>
              <Text
                className="font-poppins-bold text-lg text-slate-900 leading-6"
                numberOfLines={1}
              >
                {vehicleName}
              </Text>

              <View className="flex flex-row items-center gap-3 mt-2">
                <View className="flex flex-row items-center gap-1 bg-slate-100/50 px-2 py-1 rounded-lg">
                  <MaterialCommunityIcons
                    name="account-group"
                    size={14}
                    color="#844AFF"
                  />
                  <Text className="font-dm-sans-bold text-slate-500 text-[10px]">
                    Max {capacity}
                  </Text>
                </View>
                <View className="flex flex-row items-center gap-1 bg-slate-100/50 px-2 py-1 rounded-lg">
                  <MaterialCommunityIcons
                    name="timer-outline"
                    size={14}
                    color="#844AFF"
                  />
                  <Text className="font-dm-sans-bold text-slate-500 text-[10px]">
                    {waitingTime} Wait
                  </Text>
                </View>
              </View>
            </View>

            <View className="items-end">
              <View className="relative">
                <View className="w-16 h-16 rounded-2xl bg-slate-50 items-center justify-center border border-slate-100">
                  <Image
                    source={{ uri: image }}
                    className="w-12 h-12"
                    resizeMode="contain"
                  />
                </View>
                {onRefresh && (
                  <TouchableOpacity
                    onPress={onRefresh}
                    disabled={refreshLoading}
                    className="absolute -top-2 -right-2 w-7 h-7 items-center justify-center rounded-full bg-white border border-slate-100 shadow-sm"
                  >
                    {refreshLoading ? (
                      <ActivityIndicator size={10} color="#844AFF" />
                    ) : (
                      <MaterialCommunityIcons
                        name="cached"
                        size={14}
                        color="#64748b"
                      />
                    )}
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>

          {/* ROUTE SECTION: Matching Itinerary Style */}
          <View className="flex flex-row items-center justify-between relative mb-6">
            <View className="flex-1 items-start">
              <Text className="font-dm-sans-bold text-[9px] text-slate-400 uppercase tracking-widest mb-1">
                Pickup
              </Text>
              <Text
                className="font-poppins-bold text-[13px] text-slate-800"
                numberOfLines={1}
              >
                {pickupPoint}
              </Text>
            </View>

            <View className="px-4 items-center">
              <View className="flex-row items-center">
                <View className="w-1 h-1 rounded-full bg-slate-200" />
                <View className="w-8 h-[1px] bg-slate-100" />
                <MaterialCommunityIcons
                  name="car-side"
                  size={18}
                  color="#C427E0"
                />
                <View className="w-8 h-[1px] bg-slate-100" />
                <View className="w-1 h-1 rounded-full bg-slate-200" />
              </View>
            </View>

            <View className="flex-1 items-end">
              <Text className="font-dm-sans-bold text-[9px] text-slate-400 uppercase tracking-widest mb-1 text-right">
                Drop-off
              </Text>
              <Text
                className="font-poppins-bold text-[13px] text-slate-800 text-right"
                numberOfLines={1}
              >
                {destinationPoint}
              </Text>
            </View>
          </View>

          {/* FOOTER SECTION */}
          <LinearGradient
            colors={["#F8FAFC", "#FFFFFF"]}
            className="flex-row items-center justify-between p-3 rounded-2xl border border-slate-50"
          >
            <View className="flex-row items-center gap-2">
              <LinearGradient
                colors={["#10b981", "#059669"]}
                className="w-2 h-2 rounded-full shadow-sm shadow-emerald-200"
              />
              <Text className="font-dm-sans-bold text-[10px] text-emerald-600 uppercase tracking-widest">
                Door-to-Door Service
              </Text>
            </View>

            <View className="flex-row items-baseline gap-1">
              <Text className="font-dm-sans-bold text-[10px] text-slate-400 uppercase">
                {currency}
              </Text>
              <Text className="font-poppins-bold text-xl text-slate-900">
                {totalAmount}
              </Text>
            </View>
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  );
};

export default TransferItem;
