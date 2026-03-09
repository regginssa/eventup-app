import { ITransferOffer } from "@/types/transfer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

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
          {/* BACKGROUND ICON */}
          <View className="absolute -right-10 -top-10 opacity-5">
            <MaterialCommunityIcons name="car-side" size={150} color="#000" />
          </View>

          {/* HEADER */}
          <View className="flex-row justify-between items-center mb-5">
            <View className="flex-row items-center gap-3">
              <LinearGradient
                colors={["#844AFF20", "#C427E020"]}
                className="p-2"
                style={{ borderRadius: 12 }}
              >
                <MaterialCommunityIcons
                  name={vehicleType === "SHARED" ? "car-multiple" : "car"}
                  size={18}
                  color="#844AFF"
                />
              </LinearGradient>

              <View>
                <Text className="font-poppins-bold text-slate-800 text-sm uppercase tracking-tighter">
                  {vehicleName}
                </Text>

                <Text className="font-dm-sans-bold text-[10px] text-purple-500/60 uppercase">
                  {vehicleType} Transfer
                </Text>
              </View>
            </View>

            {onRefresh && (
              <TouchableOpacity
                onPress={onRefresh}
                disabled={refreshLoading}
                className="w-8 h-8 items-center justify-center rounded-full bg-slate-50 border border-slate-100"
              >
                {refreshLoading ? (
                  <ActivityIndicator size={12} color="#844AFF" />
                ) : (
                  <MaterialCommunityIcons
                    name="cached"
                    size={16}
                    color="#64748b"
                  />
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* ROUTE SECTION */}
          <View className="flex-row items-center justify-between relative mb-6">
            {/* Pickup */}
            <View className="items-start flex-1">
              <Text className="font-dm-sans-bold text-[9px] text-slate-400 uppercase tracking-widest mb-1">
                Pickup
              </Text>

              <Text
                className="font-poppins-bold text-[14px] text-slate-900"
                numberOfLines={1}
              >
                {pickupPoint}
              </Text>
            </View>

            {/* Route Graphic */}
            <View className="flex-1 items-center px-4">
              <Text className="font-dm-sans-bold text-[9px] text-purple-400 absolute -top-4">
                {waitingTime}
              </Text>

              <View className="flex-row items-center justify-center w-full">
                <View className="h-[1.5px] flex-1 bg-slate-100 rounded-full" />

                <View className="mx-2">
                  <MaterialCommunityIcons
                    name="car-side"
                    size={20}
                    color="#C427E0"
                  />
                </View>

                <View className="h-[1.5px] flex-1 bg-slate-100 rounded-full" />
              </View>

              <View className="mt-2 flex-row gap-2">
                <View className="px-2 py-0.5 rounded-full border border-purple-200">
                  <Text className="text-[8px] font-dm-sans-bold text-purple-500 uppercase tracking-widest">
                    {vehicleType}
                  </Text>
                </View>

                <View className="px-2 py-0.5 rounded-full border border-slate-200">
                  <Text className="text-[8px] font-dm-sans-bold text-slate-500 uppercase tracking-widest">
                    Max {capacity}
                  </Text>
                </View>
              </View>
            </View>

            {/* Destination */}
            <View className="items-end flex-1">
              <Text className="font-dm-sans-bold text-[9px] text-slate-400 uppercase tracking-widest mb-1">
                Drop-off
              </Text>

              <Text
                className="font-poppins-bold text-[14px] text-slate-900 text-right"
                numberOfLines={1}
              >
                {destinationPoint}
              </Text>
            </View>
          </View>

          {/* FOOTER */}
          <View className="rounded-2xl border border-slate-50">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="bg-slate-200/50 p-1.5 rounded-lg">
                  <MaterialCommunityIcons
                    name="map-marker-path"
                    size={14}
                    color="#64748b"
                  />
                </View>

                <Text className="font-dm-sans-bold text-[11px] text-slate-500">
                  Door-to-Door Transfer
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
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default TransferItem;
