import { IHotelOffer } from "@/types/hotel";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface HotelItemProps {
  data: IHotelOffer | null;
  refreshLoading?: boolean;
  onRefresh?: () => Promise<void>;
}

const HotelItem: React.FC<HotelItemProps> = ({
  data: offer,
  refreshLoading,
  onRefresh,
}) => {
  if (!offer) return null;

  const {
    name,
    category,
    address,
    totalAmount,
    currency,
    roomName,
    boardName,
  } = offer;

  const starCount = parseInt(category?.match(/\d+/)?.[0] || "0");

  return (
    <View className="mb-4 shadow-xl shadow-purple-200">
      <LinearGradient
        colors={["#844AFF", "#C427E0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 24, padding: 1, elevation: 5 }}
      >
        <View className="bg-white/95 rounded-[23px] p-5 overflow-hidden">
          {/* LARGE BACKGROUND ICON */}
          <View className="absolute -right-12 -top-12 opacity-[0.05]">
            <MaterialCommunityIcons name="bed-king" size={160} color="#000" />
          </View>

          {/* HEADER SECTION: Hotel Name & Rating */}
          <View className="flex flex-row justify-between items-start mb-5">
            <View className="flex-1 pr-4">
              {starCount > 0 && (
                <View className="flex flex-row mb-1.5">
                  {[...Array(starCount)].map((_, i) => (
                    <MaterialCommunityIcons
                      key={i}
                      name="star"
                      size={14}
                      color="#844AFF"
                    />
                  ))}
                </View>
              )}
              <Text
                className="font-poppins-bold text-lg text-slate-900 leading-6"
                numberOfLines={2}
              >
                {name}
              </Text>
              <View className="flex flex-row items-center gap-1 mt-1.5">
                <MaterialIcons name="location-pin" size={14} color="#C427E0" />
                <Text
                  className="font-dm-sans-bold text-slate-400 text-[11px] flex-1"
                  numberOfLines={1}
                >
                  {address}
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

          {/* ROOM & BOARD SECTION */}
          <View className="flex flex-row items-center justify-between relative mb-6">
            {/* Room Type */}
            <View className="flex-1 items-start">
              <Text className="font-dm-sans-bold text-[9px] text-purple-400 uppercase tracking-widest mb-1">
                Room Category
              </Text>
              <Text
                className="font-poppins-bold text-sm text-slate-800 leading-tight"
                numberOfLines={2}
              >
                {roomName}
              </Text>
            </View>

            {/* Divider Icon */}
            <View className="px-4 items-center">
              <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center border border-slate-100">
                <MaterialCommunityIcons
                  name="bed-king-outline"
                  size={18}
                  color="#844AFF"
                />
              </View>
            </View>

            {/* Board Basis */}
            <View className="flex-1 items-end">
              <Text className="font-dm-sans-bold text-[9px] text-purple-400 uppercase tracking-widest mb-1 text-right">
                Inclusions
              </Text>
              <Text
                className="font-poppins-bold text-sm text-slate-800 leading-tight text-right"
                numberOfLines={2}
              >
                {boardName}
              </Text>
            </View>
          </View>

          {/* FOOTER: Confirmation & Price */}
          <LinearGradient
            colors={["#F8FAFC", "#FFFFFF"]}
            className="flex-row items-center justify-between p-3 rounded-2xl border border-slate-50"
          >
            <View className="flex-row items-center gap-2">
              <View className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
              <Text className="font-dm-sans-bold text-[10px] text-emerald-600 uppercase tracking-wider">
                Instant Confirmation
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

export default HotelItem;
