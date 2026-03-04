import { IHotelOffer } from "@/types/hotel";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
    image,
    totalAmount,
    currency,
    roomName,
    boardName,
  } = offer;

  // Extract stars (e.g., "4 STARS" -> 4)
  const starCount = parseInt(category.match(/\d+/)?.[0] || "0");

  return (
    <View className="bg-slate-200 rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      {/* HEADER SECTION: Title & Image */}
      <View className="flex flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          {starCount > 0 && (
            <View className="flex flex-row mb-1">
              {[...Array(starCount)].map((_, i) => (
                <MaterialCommunityIcons
                  key={i}
                  name="star"
                  size={12}
                  color="#f59e0b"
                />
              ))}
            </View>
          )}
          <Text
            className="font-poppins-bold text-lg text-gray-800 leading-6"
            numberOfLines={2}
          >
            {name}
          </Text>
          <View className="flex flex-row items-center gap-1 mt-1">
            <MaterialIcons name="location-pin" size={12} color="#9ca3af" />
            <Text
              className="font-dm-sans-medium text-gray-500 text-xs"
              numberOfLines={1}
            >
              {address}
            </Text>
          </View>
        </View>

        <View className="relative">
          <Image
            source={{ uri: image }}
            className="w-20 h-20 rounded-xl bg-gray-100"
            resizeMode="cover"
          />
          {/* REFRESH BUTTON - Positioned over or next to image */}
          {onRefresh && (
            <TouchableOpacity
              onPress={onRefresh}
              activeOpacity={0.6}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-100"
            >
              {refreshLoading ? (
                <ActivityIndicator size={14} color="#9ca3af" />
              ) : (
                <MaterialCommunityIcons
                  name="cached"
                  size={16}
                  color="#9ca3af"
                />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* MIDDLE SECTION: Visual Line (Matching Flight Style) */}
      <View className="flex flex-row items-center justify-between py-4 mt-2 border-t border-gray-50">
        {/* Room Info */}
        <View className="flex flex-col items-start flex-1">
          <Text className="font-dm-sans-bold text-gray-800 text-[10px] uppercase tracking-wider">
            Room Type
          </Text>
          <Text
            className="font-dm-sans-medium text-gray-500 text-[10px]"
            numberOfLines={1}
          >
            {roomName}
          </Text>
        </View>

        {/* Visual Line with Icon */}
        <View className="flex-1 items-center px-4 gap-1">
          <View className="w-full h-[1px] bg-gray-400 relative flex items-center justify-center">
            <View className="absolute px-2">
              <MaterialCommunityIcons
                name="bed-outline"
                size={14}
                color="#6b7280"
              />
            </View>
          </View>
        </View>

        {/* Board Info */}
        <View className="flex flex-col items-end flex-1">
          <Text className="font-dm-sans-bold text-gray-800 text-[10px] uppercase tracking-wider text-right">
            Board Basis
          </Text>
          <Text
            className="font-dm-sans-medium text-gray-500 text-[10px] text-right"
            numberOfLines={1}
          >
            {boardName}
          </Text>
        </View>
      </View>

      {/* FOOTER SECTION: Status & Price */}
      <View className="pt-3 border-t border-gray-50 flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-1">
          <View className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <Text className="font-dm-sans-bold text-[10px] text-green-600 uppercase tracking-tighter">
            Instant Confirmation
          </Text>
        </View>

        <View className="flex flex-row items-start gap-1">
          <Text className="font-poppins-semibold text-xs text-gray-600">
            {currency}
          </Text>
          <Text className="font-poppins-bold text-xl text-green-600">
            {totalAmount}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default HotelItem;
