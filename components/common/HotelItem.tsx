import { IHotelOffer, THotelBookStatus } from "@/types/hotel";
import df from "@/utils/date";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface HotelItemProps {
  data: IHotelOffer | null;
  status?: THotelBookStatus;
  reference?: string;
  refreshLoading?: boolean;
  onRefresh?: () => Promise<void>;
}

const serviceIconMap: Record<string, any> = {
  wifi: { lib: "mc", name: "wifi" },
  parking: { lib: "mc", name: "parking" },
  gym: { lib: "mc", name: "dumbbell" },
  spa: { lib: "mc", name: "spa" },
  pool: { lib: "mc", name: "pool" },
  restaurant: { lib: "mc", name: "silverware-fork-knife" },
  lounge: { lib: "mc", name: "sofa" },
  laundry: { lib: "mc", name: "washing-machine" },
  concierge: { lib: "mc", name: "account-tie" },
  room_service: { lib: "mc", name: "room-service-outline" },
  business_centre: { lib: "mc", name: "briefcase-outline" },
  childcare_service: { lib: "mc", name: "baby-face-outline" },
  pets_allowed: { lib: "mc", name: "dog" },
  accessibility_mobility: { lib: "mc", name: "wheelchair-accessibility" },
  accessibility_hearing: { lib: "mc", name: "ear-hearing" },
  "24_hour_front_desk": { lib: "mc", name: "desk" },
  cash_machine: { lib: "mc", name: "cash" },
  adult_only: { lib: "mc", name: "account-lock" },

  bar: { lib: "mc", name: "glass-cocktail" },
  breakfast: { lib: "mc", name: "coffee" },
  shuttle: { lib: "mc", name: "bus" },
  airport_transfer: { lib: "mc", name: "airplane" },
  terrace: { lib: "mc", name: "home-roof" },
  garden: { lib: "mc", name: "flower" },
  air_conditioning: { lib: "mc", name: "air-conditioner" },
  heating: { lib: "mc", name: "fire" },
};

const HotelItem: React.FC<HotelItemProps> = ({
  data: offer,
  status,
  reference,
  refreshLoading,
  onRefresh,
}) => {
  const [showAmenities, setShowAmenities] = useState(false);

  if (!offer) return null;

  const {
    name,
    category,
    address,
    city,
    countryCode,
    totalAmount,
    currency,
    roomName,
    boardName,
    services,
    checkIn,
    checkOut,
    checkInInfo,
  } = offer;

  const starCount = parseInt(category?.match(/\d+/)?.[0] || "0");

  const visibleServices = services.slice(0, 5);
  const remainingServices = services.length - visibleServices.length;

  const renderIcon = (type: string) => {
    const icon = serviceIconMap[type];

    if (!icon) {
      return (
        <MaterialCommunityIcons
          name="check-circle-outline"
          size={14}
          color="#844AFF"
        />
      );
    }

    if (icon.lib === "mc") {
      return (
        <MaterialCommunityIcons name={icon.name} size={14} color="#844AFF" />
      );
    }

    return <MaterialIcons name={icon.name} size={14} color="#844AFF" />;
  };

  return (
    <>
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

            {/* HEADER */}
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
                  <MaterialIcons
                    name="location-pin"
                    size={14}
                    color="#C427E0"
                  />
                  <Text
                    className="font-dm-sans-bold text-slate-400 text-[11px] flex-1"
                    numberOfLines={2}
                  >
                    {address} | {city}, {countryCode}
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

            {/* STAY INFO */}
            <View className="flex-row items-center justify-between mb-5">
              <View className="flex-1 items-start">
                <Text className="font-dm-sans-bold text-[9px] text-purple-400 uppercase tracking-widest mb-1">
                  Check-In
                </Text>

                <View className="flex-row items-center gap-1">
                  <MaterialCommunityIcons
                    name="login"
                    size={14}
                    color="#844AFF"
                  />
                  <Text className="font-poppins-bold text-sm text-slate-800">
                    {df.toShortDate(checkIn)}
                  </Text>
                </View>
              </View>

              <View className="px-4 items-center">
                <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center border border-slate-100">
                  <MaterialCommunityIcons
                    name="calendar-range"
                    size={18}
                    color="#844AFF"
                  />
                </View>
              </View>

              <View className="flex-1 items-end">
                <Text className="font-dm-sans-bold text-[9px] text-purple-400 uppercase tracking-widest mb-1">
                  Check-Out
                </Text>

                <View className="flex-row items-center gap-1">
                  <MaterialCommunityIcons
                    name="logout"
                    size={14}
                    color="#844AFF"
                  />
                  <Text className="font-poppins-bold text-sm text-slate-800 text-right">
                    {df.toShortDate(checkOut)}
                  </Text>
                </View>
              </View>
            </View>

            {/* CHECK-IN INFO */}
            {checkInInfo && (
              <View className="mb-5 bg-purple-50 border border-purple-100 rounded-xl p-3 flex-row items-start gap-2">
                <MaterialCommunityIcons
                  name="information-outline"
                  size={16}
                  color="#844AFF"
                />
                <Text className="flex-1 text-[11px] text-purple-700 font-dm-sans-bold">
                  {checkInInfo}
                </Text>
              </View>
            )}

            {/* ROOM & BOARD */}
            <View className="flex flex-row items-center justify-between relative mb-5">
              <View className="flex-1 items-start">
                <Text className="font-dm-sans-bold text-[9px] text-purple-400 uppercase tracking-widest mb-1">
                  Room Category
                </Text>
                <Text
                  className="font-poppins-bold text-sm text-slate-800"
                  numberOfLines={1}
                >
                  {roomName}
                </Text>
              </View>

              <View className="px-4 items-center">
                <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center border border-slate-100">
                  <MaterialCommunityIcons
                    name="bed-king-outline"
                    size={18}
                    color="#844AFF"
                  />
                </View>
              </View>

              <View className="flex-1 items-end">
                <Text className="font-dm-sans-bold text-[9px] text-purple-400 uppercase tracking-widest mb-1">
                  Inclusions
                </Text>
                <Text className="font-poppins-bold text-sm text-slate-800 text-right">
                  {boardName}
                </Text>
              </View>
            </View>

            {/* SERVICES */}
            {services.length > 0 && (
              <View className="mb-5">
                <Text className="font-dm-sans-bold text-[9px] text-purple-400 uppercase tracking-widest mb-2">
                  Amenities
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  {visibleServices.map((s: any, i: number) => (
                    <View
                      key={i}
                      className="flex-row items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100"
                    >
                      {renderIcon(s.type)}
                      <Text className="ml-1 font-dm-sans-bold text-[10px] text-slate-600">
                        {s.description}
                      </Text>
                    </View>
                  ))}

                  {remainingServices > 0 && (
                    <TouchableOpacity
                      onPress={() => setShowAmenities(true)}
                      className="px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100"
                    >
                      <Text className="font-dm-sans-bold text-[10px] text-purple-600">
                        +{remainingServices} more
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* REFERENCE */}
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

      {/* AMENITIES MODAL */}
      <Modal visible={showAmenities} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[70%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold">Amenities</Text>

              <TouchableOpacity onPress={() => setShowAmenities(false)}>
                <MaterialCommunityIcons name="close" size={22} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {services.map((s: any, i: number) => (
                <View
                  key={i}
                  className="flex-row items-center py-3 border-b border-slate-100"
                >
                  {renderIcon(s.type)}
                  <Text className="ml-3 text-slate-700">{s.description}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default HotelItem;
