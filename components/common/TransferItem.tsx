import { ITransferOffer } from "@/types/transfer";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
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
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      {/* HEADER SECTION */}
      <View className="flex flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="font-dm-sans-bold text-[10px] text-orange-500 uppercase tracking-widest mb-1">
            {vehicleType} TRANSFER
          </Text>
          <Text
            className="font-poppins-bold text-lg text-gray-800 leading-6"
            numberOfLines={1}
          >
            {vehicleName}
          </Text>
          <View className="flex flex-row items-center gap-3 mt-1">
            <View className="flex flex-row items-center gap-1">
              <MaterialCommunityIcons
                name="account-group-outline"
                size={14}
                color="#9ca3af"
              />
              <Text className="font-dm-sans-medium text-gray-500 text-xs">
                Max {capacity}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-1">
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color="#9ca3af"
              />
              <Text className="font-dm-sans-medium text-gray-500 text-xs">
                {waitingTime} wait
              </Text>
            </View>
          </View>
        </View>

        <View className="relative">
          <Image
            source={{ uri: image }}
            className="w-16 h-16 rounded-xl bg-gray-50"
            resizeMode="contain"
          />
          {/* REFRESH BUTTON */}
          {onRefresh && (
            <TouchableOpacity
              onPress={onRefresh}
              activeOpacity={0.6}
              className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-100"
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

      {/* ROUTE SECTION (Matching Flight Style) */}
      <View className="flex flex-row items-center justify-between py-4 mt-2 border-t border-gray-50">
        <View className="flex-1">
          <Text className="font-dm-sans-bold text-gray-800 text-[10px] uppercase">
            From
          </Text>
          <Text
            className="font-dm-sans-medium text-gray-500 text-[10px]"
            numberOfLines={1}
          >
            {pickupPoint}
          </Text>
        </View>

        <View className="flex-1 items-center px-4">
          <View className="w-full h-[1px] bg-gray-200 relative flex items-center justify-center">
            <View className="absolute bg-white px-2">
              <MaterialCommunityIcons
                name="car-select"
                size={16}
                color="#9ca3af"
              />
            </View>
          </View>
        </View>

        <View className="flex-1 items-end">
          <Text className="font-dm-sans-bold text-gray-800 text-[10px] uppercase text-right">
            To
          </Text>
          <Text
            className="font-dm-sans-medium text-gray-500 text-[10px] text-right"
            numberOfLines={1}
          >
            {destinationPoint}
          </Text>
        </View>
      </View>

      {/* FOOTER SECTION */}
      <View className="pt-3 border-t border-gray-50 flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-1">
          <MaterialIcons name="door-back" size={14} color="#059669" />
          <Text className="font-dm-sans-bold text-[10px] text-green-600 uppercase">
            Door-to-Door
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

export default TransferItem;
