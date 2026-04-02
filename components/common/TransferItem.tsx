import { ITransferOffer, TTransferBookStatus } from "@/types/transfer";
import df from "@/utils/date";
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
  status?: TTransferBookStatus;
  reference?: string;
  refreshLoading?: boolean;
  onRefresh?: () => Promise<void>;
}

const TransferItem: React.FC<TransferItemProps> = ({
  data: offer,
  status,
  reference,
  refreshLoading,
  onRefresh,
}) => {
  if (!offer) return null;

  const {
    vehicleName,
    vehicleType,
    capacity,
    pickupPoint,
    destinationPoint,
    waitingTime,
    pickupDateTime,
    image,
  } = offer;

  const { currency, totalAmount } = offer.converted;

  return (
    <View className="mb-4 shadow-xl shadow-purple-200">
      <LinearGradient
        colors={["#844AFF", "#C427E0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 24, padding: 1, elevation: 5 }}
      >
        <View className="bg-white/95 rounded-[23px] overflow-hidden">
          {/* IMAGE HEADER */}
          <View className="w-full h-40 bg-slate-100">
            {image ? (
              <Image
                source={{ uri: image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <MaterialCommunityIcons name="car" size={40} color="#cbd5f5" />
              </View>
            )}

            {/* Gradient overlay for smooth transition */}
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.95)"]}
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                height: 60,
              }}
            />

            {/* Vehicle badge */}
            <View className="absolute top-3 left-3 bg-white/80 px-2 py-1 rounded-full">
              <Text className="text-[10px] font-bold text-purple-600 uppercase">
                {vehicleType}
              </Text>
            </View>
          </View>

          {/* CONTENT */}
          <View className="p-5">
            {/* BACKGROUND ICON */}
            <View className="absolute -right-10 -top-10 opacity-5">
              <MaterialCommunityIcons name="car-side" size={150} color="#000" />
            </View>

            {/* HEADER */}
            <View className="flex-row justify-between items-center mb-5">
              <View className="flex-row items-center gap-3">
                <LinearGradient
                  colors={["#844AFF20", "#C427E020"]}
                  style={{ borderRadius: 12, padding: 8 }}
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

              {/* STATUS */}
              {status && (
                <View
                  className={`${
                    status === "pending"
                      ? "bg-yellow-100"
                      : status === "failed"
                        ? "bg-red-100"
                        : "bg-green-100"
                  } px-3 py-1 rounded-full flex-row items-center mr-2`}
                >
                  <MaterialCommunityIcons
                    name={
                      status === "pending"
                        ? "clock-outline"
                        : status === "failed"
                          ? "close-circle-outline"
                          : "check-decagram"
                    }
                    size={14}
                    color={
                      status === "pending"
                        ? "#a16207"
                        : status === "failed"
                          ? "#b91c1c"
                          : "#16a34a"
                    }
                  />
                  <Text
                    className={`${
                      status === "pending"
                        ? "text-yellow-700"
                        : status === "failed"
                          ? "text-red-700"
                          : "text-green-700"
                    } font-dm-sans-bold text-[10px] ml-1 uppercase`}
                  >
                    {status === "pending" ? "Pending" : status}
                  </Text>
                </View>
              )}

              {/* REFRESH */}
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

            {/* PICKUP TIME */}
            <View className="flex-row items-center gap-2 mb-6">
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color="#844AFF"
              />
              <Text className="font-dm-sans-bold text-[11px] text-purple-500">
                Pickup {df.toDateTime(pickupDateTime)}
              </Text>
            </View>

            {/* ROUTE */}
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

            {/* BOOKING REFERENCE */}
            {reference && (
              <View className="mb-4 flex-row items-center justify-between bg-purple-50 border border-purple-100 rounded-xl px-3 py-2">
                <View className="flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="ticket-confirmation-outline"
                    size={16}
                    color="#844AFF"
                  />
                  <Text className="font-dm-sans-bold text-[11px] text-purple-600 uppercase">
                    Booking Ref
                  </Text>
                </View>

                <Text className="font-poppins-bold text-sm tracking-widest text-slate-900">
                  {reference}
                </Text>
              </View>
            )}

            {/* PRICE */}
            <LinearGradient
              colors={["#F8FAFC", "#FFFFFF"]}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                padding: 12,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: "#f8fafc",
              }}
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
        </View>
      </LinearGradient>
    </View>
  );
};

export default TransferItem;
