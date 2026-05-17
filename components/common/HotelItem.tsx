import { IHotelOffer, THotelBookStatus } from "@/types/hotel";
import df from "@/utils/date";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RadioButton from "./RadioButton";

interface HotelItemProps {
  data: IHotelOffer | null;
  status?: THotelBookStatus;
  reference?: string;
  refreshLoading?: boolean;
  onRefresh?: () => Promise<void>;
  onSelect?: (offer: IHotelOffer) => void;
  checked?: boolean;
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
  accessibility_mobility: {
    lib: "mc",
    name: "wheelchair-accessibility",
  },
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

const getNights = (checkIn: string, checkOut: string) => {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );
};

const HotelItem: React.FC<HotelItemProps> = ({
  data: offer,
  status,
  reference,
  refreshLoading,
  onRefresh,
  checked,
  onSelect,
}) => {
  const [showAmenities, setShowAmenities] = useState(false);

  if (!offer) return null;

  const {
    name,
    category,
    address,
    city,
    countryCode,
    roomName,
    boardName,
    services,
    checkIn,
    checkOut,
    checkInInfo,
    image,
    ratePolicy,
    cancellationPolicy,
    rooms,
    converted,
  } = offer;

  const { currency, totalAmount } = offer.converted;

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
      <View className="mb-5 shadow-xl shadow-purple-200">
        <LinearGradient
          colors={["#844AFF", "#C427E0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 28,
            padding: 1.2,
            elevation: 6,
          }}
        >
          <View className="bg-white rounded-[27px] overflow-hidden">
            {/* HERO IMAGE */}
            <View className="relative h-64">
              <Image
                source={{ uri: image }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="cover"
              />

              {/* OVERLAY */}
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.8)"]}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  top: 0,
                  justifyContent: "space-between",
                  padding: 18,
                }}
              >
                {/* TOP ACTIONS */}
                <View className="flex-row justify-between items-start">
                  {/* STARS */}
                  {starCount > 0 ? (
                    <View className="flex-row bg-black/30 px-3 py-1.5 rounded-full">
                      {[...Array(starCount)].map((_, i) => (
                        <MaterialCommunityIcons
                          key={i}
                          name="star"
                          size={14}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                  ) : (
                    <View />
                  )}

                  <View className="flex-row items-center gap-2">
                    {/* STATUS */}
                    {status && (
                      <View
                        className={`${
                          status === "pending"
                            ? "bg-yellow-500/90"
                            : status === "failed"
                              ? "bg-red-500/90"
                              : "bg-emerald-500/90"
                        } px-3 py-1 rounded-full`}
                      >
                        <Text className="text-white text-[10px] font-bold uppercase">
                          {status}
                        </Text>
                      </View>
                    )}

                    {/* REFRESH */}
                    {onRefresh && (
                      <TouchableOpacity
                        onPress={onRefresh}
                        disabled={refreshLoading}
                        className="w-9 h-9 rounded-full bg-black/30 items-center justify-center"
                      >
                        {refreshLoading ? (
                          <ActivityIndicator size={12} color="#fff" />
                        ) : (
                          <MaterialCommunityIcons
                            name="cached"
                            size={18}
                            color="#fff"
                          />
                        )}
                      </TouchableOpacity>
                    )}

                    {/* SELECT */}
                    {onSelect && (
                      <View className="bg-white rounded-full p-1">
                        <RadioButton
                          checked={!!checked}
                          onPress={() => onSelect(offer)}
                        />
                      </View>
                    )}
                  </View>
                </View>

                {/* HOTEL INFO */}
                <View>
                  <Text
                    className="font-poppins-bold text-2xl text-white leading-8"
                    numberOfLines={2}
                  >
                    {name}
                  </Text>

                  <View className="flex-row items-center mt-2">
                    <MaterialIcons
                      name="location-pin"
                      size={16}
                      color="#E9D5FF"
                    />

                    <Text
                      className="text-purple-100 text-xs flex-1"
                      numberOfLines={1}
                    >
                      {address} • {city}, {countryCode}
                    </Text>
                  </View>

                  {/* PRICE FLOAT */}
                  <View className="mt-4 self-start bg-white px-4 py-2 rounded-2xl">
                    <View className="flex-row items-end gap-1">
                      <Text className="font-dm-sans-bold text-[11px] text-slate-400 uppercase">
                        {currency}
                      </Text>

                      <Text className="font-poppins-bold text-xl text-slate-900">
                        {totalAmount}
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* CONTENT */}
            <View className="p-5">
              {/* STAY INFO */}
              <View className="flex-row items-center justify-between mb-5">
                <View className="flex-1">
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

                <View className="items-center px-2">
                  <Text className="text-[10px] text-purple-400 uppercase font-dm-sans-bold">
                    Nights
                  </Text>

                  <Text className="font-poppins-bold text-sm text-slate-800">
                    {getNights(checkIn, checkOut)}
                  </Text>
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

                    <Text className="font-poppins-bold text-sm text-slate-800">
                      {df.toShortDate(checkOut)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* CHECK IN INFO */}
              {checkInInfo && (
                <View className="mb-5 bg-purple-50 border border-purple-100 rounded-2xl p-4 flex-row items-start">
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={18}
                    color="#844AFF"
                  />

                  <Text className="flex-1 ml-2 text-[11px] text-purple-700 font-dm-sans-bold leading-5">
                    {checkInInfo}
                  </Text>
                </View>
              )}

              {/* AMENITIES */}
              {services.length > 0 && (
                <View className="mb-5">
                  <Text className="font-dm-sans-bold text-[9px] text-purple-400 uppercase tracking-widest mb-3">
                    Amenities
                  </Text>

                  <View className="flex-row flex-wrap gap-2">
                    {visibleServices.map((s: any, i: number) => (
                      <View
                        key={i}
                        className="flex-row items-center bg-slate-50 px-3 py-2 rounded-full border border-slate-100"
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
                        className="px-3 py-2 rounded-full bg-purple-50 border border-purple-100"
                      >
                        <Text className="font-dm-sans-bold text-[10px] text-purple-600">
                          +{remainingServices} more
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}

              {/* PNR */}
              {reference && (
                <View className="mb-5 bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="ticket-confirmation-outline"
                      size={16}
                      color="#844AFF"
                    />

                    <Text className="ml-2 font-dm-sans-bold text-[11px] text-purple-600 uppercase">
                      PNR
                    </Text>
                  </View>

                  <Text className="font-poppins-bold text-sm tracking-widest text-slate-900">
                    {reference}
                  </Text>
                </View>
              )}

              {/* FOOTER */}
              {/* <LinearGradient
                colors={["#F8FAFC", "#FFFFFF"]}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 14,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: "#f1f5f9",
                }}
              >
                <View className="flex-row items-center gap-2">
                  <View className="w-2 h-2 rounded-full bg-emerald-500" />

                  <Text className="font-dm-sans-bold text-[10px] text-emerald-600 uppercase tracking-wider">
                    Instant Confirmation
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="shield-check-outline"
                    size={16}
                    color="#10b981"
                  />

                  <Text className="ml-1 text-[11px] text-slate-500 font-dm-sans-bold">
                    Secure Booking
                  </Text>
                </View>
              </LinearGradient> */}
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* AMENITIES MODAL */}
      <Modal visible={showAmenities} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[70%]">
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-poppins-bold text-slate-900">
                Amenities
              </Text>

              <TouchableOpacity onPress={() => setShowAmenities(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#0f172a"
                />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {services.map((s: any, i: number) => (
                <View
                  key={i}
                  className="flex-row items-center py-4 border-b border-slate-100"
                >
                  {renderIcon(s.type)}

                  <Text className="ml-3 text-slate-700 font-dm-sans-bold">
                    {s.description}
                  </Text>
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
