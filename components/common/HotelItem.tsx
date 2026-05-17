import { IHotelOffer, THotelBookStatus } from "@/types/hotel";
import df from "@/utils/date";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal as RNModal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useHotel } from "../providers/HotelProvider";
import Button from "./Button";
import Modal from "./Modal";
import RadioButton from "./RadioButton";

interface HotelItemProps {
  data: IHotelOffer | null;
  status?: THotelBookStatus;
  reference?: string;
  refreshLoading?: boolean;
  onRefresh?: () => Promise<void>;
  onSelect?: (offer: IHotelOffer) => void;
  checked?: boolean;
  hiddenPolicy?: boolean;
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

const mapRateToDisplay = (defaultRate: any) => {
  const getCondition = (title: string) =>
    defaultRate?.conditions?.find(
      (c: any) => c.title?.toLowerCase() === title.toLowerCase(),
    )?.description || null;

  const cancellationTimeline = defaultRate?.cancellation_timeline ?? [];
  const conditions = defaultRate?.conditions ?? [];

  const ratePolicy =
    getCondition("Rate Description") ||
    getCondition("Description") ||
    defaultRate?.description ||
    null;

  const cancellationSummary =
    getCondition("Guarantee Policy") ||
    getCondition("Cancellation Policy") ||
    null;

  const refundable =
    cancellationTimeline.length > 0 ||
    conditions.some((c: any) =>
      c.title?.toLowerCase().includes("cancellation"),
    );

  return {
    // =========================
    // RAW (for debugging / modal)
    // =========================
    raw: defaultRate,

    // =========================
    // UI FIELDS
    // =========================
    ratePolicy,
    cancellationPolicy: {
      raw: conditions,
      summary: cancellationSummary,
      refundable,
      timeline: cancellationTimeline,
    },

    // =========================
    // QUICK DISPLAY HELPERS
    // =========================
    badges: {
      refundable: refundable,
      paymentType: defaultRate?.payment_type,
      boardType: defaultRate?.board_type,
    },

    pricing: {
      total: defaultRate?.total_amount,
      currency: defaultRate?.total_currency,
      base: defaultRate?.base_amount,
      tax: defaultRate?.tax_amount,
      fee: defaultRate?.fee_amount,
      dueAtHotel: defaultRate?.due_at_accommodation_amount,
    },

    availability: {
      quantity: defaultRate?.quantity_available,
      expiresAt: defaultRate?.expires_at,
    },
  };
};

const HotelItem: React.FC<HotelItemProps> = ({
  data: offer,
  status,
  reference,
  refreshLoading,
  onRefresh,
  checked,
  onSelect,
  hiddenPolicy,
}) => {
  const [showAmenities, setShowAmenities] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { updateOffer, offer: cxOffer } = useHotel();

  if (!offer) return null;

  const {
    name,
    category,
    address,
    city,
    countryCode,
    services,
    checkIn,
    checkOut,
    checkInInfo,
    image,
    rooms,
    converted,
  } = offer;

  const { currency, totalAmount } = converted;

  const starCount = parseInt(category?.match(/\d+/)?.[0] || "0");

  const visibleServices = services.slice(0, 5);
  const remainingServices = services.length - visibleServices.length;
  const selectedRoom = cxOffer?.defaultRoom ?? rooms?.[0];

  const selectedRate = cxOffer?.defaultRate ?? selectedRoom?.rates?.[0];
  const selectedDisplay = cxOffer?.defaultRate
    ? mapRateToDisplay(cxOffer.defaultRate)
    : null;
  if (!selectedRoom || !selectedRate) return null;

  const handleRoomSelect = (room: any) => {
    updateOffer({
      ...offer,
      defaultRoom: room,
      defaultRate: room?.rates?.[0],
    });
  };

  const handleRateSelect = (rate: any) => {
    updateOffer({
      ...offer,
      id: rate.id,
      defaultRate: rate,
      converted: {
        ...cxOffer?.converted,
        totalAmount: Number(rate.total_amount),
      } as any,
    });
  };

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
                source={{ uri: image || "" }}
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
                <View className="">
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

              {/* SELECTED ROOM & RATE SUMMARY */}
              {cxOffer?.defaultRoom &&
                cxOffer.defaultRate &&
                selectedDisplay && (
                  <View className="mt-5 p-4 rounded-2xl border border-purple-100 bg-purple-50">
                    {/* HEADER */}
                    <Text className="text-[10px] font-dm-sans-bold text-purple-500 uppercase tracking-widest mb-3">
                      Selected Choice
                    </Text>

                    {/* ROOM */}
                    <View className="mb-3">
                      <Text className="text-sm font-poppins-bold text-slate-900">
                        {selectedRoom.name}
                      </Text>

                      {selectedRoom.name && (
                        <Text className="text-xs text-slate-600">
                          {selectedRoom.name}
                        </Text>
                      )}
                    </View>

                    {/* RATE */}
                    <View className="flex-row justify-between items-center">
                      {/* PRICE */}
                      <View>
                        <Text className="text-[11px] text-slate-500">
                          {selectedDisplay.badges.paymentType === "pay_now"
                            ? "Pay now"
                            : "Pay at hotel"}
                        </Text>
                      </View>

                      {/* BADGE */}
                      <View
                        className={`px-3 py-1 rounded-full ${
                          selectedDisplay.cancellationPolicy.refundable
                            ? "bg-green-100"
                            : "bg-red-100"
                        }`}
                      >
                        <Text
                          className={`text-[11px] font-semibold ${
                            selectedDisplay.cancellationPolicy.refundable
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {selectedDisplay.cancellationPolicy.refundable
                            ? "Free cancellation"
                            : "Non-refundable"}
                        </Text>
                      </View>
                    </View>

                    {/* SMALL POLICY HINT */}
                    <Text className="mt-2 text-[11px] text-slate-600 leading-4">
                      {selectedDisplay.cancellationPolicy.summary ||
                        selectedDisplay.ratePolicy ||
                        "Standard hotel conditions apply"}
                    </Text>
                  </View>
                )}
            </View>

            {/* ACTION BUTTON GROUP */}
            {!hiddenPolicy && rooms.length > 0 && (
              <View className="mb-5 px-5">
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="flex-1 rounded-lg bg-[#bc9efcf0] flex items-center justify-center p-2"
                  onPress={() => setShowDetails(true)}
                >
                  <Text className="font-poppins-semibold text-xs text-[#570cfa]">
                    SELECT ROOM & RATE
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* PNR */}
            {reference && (
              <View className="mb-5 mx-4 bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 flex-row items-center justify-between">
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
          </View>
        </LinearGradient>
      </View>

      {/* AMENITIES MODAL */}
      <RNModal visible={showAmenities} animationType="slide" transparent>
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
      </RNModal>

      <Modal
        isOpen={showDetails}
        title="Rooms & Rates"
        scrolled
        onClose={() => setShowDetails(false)}
      >
        <View className="gap-4 mt-4">
          <Text className="font-poppins-bold text-lg text-slate-800">
            ROOMS ({rooms.length})
          </Text>
          <ScrollView
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 16 }}
          >
            {rooms.map((r, i) => (
              <TouchableOpacity
                key={`${name}_room_${i}`}
                activeOpacity={0.7}
                className="relative rounded-lg overflow-hidden"
                style={{ width: 200, height: 200 }}
                onPress={() => handleRoomSelect(r)}
              >
                <Image
                  source={{ uri: r.photos?.[0]?.url || "" }}
                  style={{ width: "100%", height: "100%" }}
                />

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
                  <View className="absolute top-0 right-0 px-4 pt-4">
                    <RadioButton
                      checked={cxOffer?.defaultRoom === r}
                      onPress={() => {}}
                    />
                  </View>

                  <View className="absolute bottom-0 px-4 pb-4 left-0">
                    <Text className="font-poppins-semibold text-sm text-white">
                      {r.name}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="gap-4 mt-10">
          <Text className="font-poppins-bold text-lg text-slate-800">
            RATES ({selectedRoom.rates.length})
          </Text>

          <ScrollView
            horizontal
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {selectedRoom.rates.map((rate: any, index: number) => (
              <RateCard
                key={`${name}_${selectedRoom.name}_rate_${index}`}
                rate={rate}
                selected={cxOffer?.defaultRate === rate}
                onSelect={() => handleRateSelect(rate)}
              />
            ))}
          </ScrollView>
        </View>

        {selectedRate && <RateDetails rate={selectedRate} />}

        {/* SUPPORT & COMPANY INFO */}
        <View className="mt-6 p-4 rounded-2xl border border-slate-200 bg-white">
          {/* HEADER */}
          <Text className="text-xs font-poppins-bold text-slate-500 uppercase tracking-widest mb-3">
            Booking Support & Legal Info
          </Text>

          {/* COMPANY */}
          <View className="mb-3">
            <Text className="text-sm font-semibold text-slate-900">
              CHARLIE UNICORN AI
            </Text>
          </View>

          {/* CONTACT */}
          <View className="mb-3">
            <Text className="text-xs font-semibold text-slate-800">
              Support
            </Text>

            <Text className="text-xs text-slate-600">
              Email: team@charlieunicornai.eu
            </Text>

            <Text className="text-xs text-slate-600">
              Phone: +48 504 412 991
            </Text>
          </View>

          {/* ADDRESS */}
          <View className="mb-3">
            <Text className="text-xs font-semibold text-slate-800">
              Address
            </Text>

            <Text className="text-xs text-slate-600 leading-4">
              Kasztanowa Street 17/1, Manowo, Poland
            </Text>
          </View>

          {/* TERMS */}
          <View>
            <Text className="text-xs font-semibold text-slate-800 mb-1">
              Terms & Conditions
            </Text>

            <Text className="text-[11px] text-slate-500 leading-4">
              By completing this booking, you agree to the hotel's policies,
              cancellation rules, and our platform terms of service. Prices and
              availability are not guaranteed until payment is confirmed.
            </Text>
          </View>
        </View>

        <View className="mt-8">
          <Button
            type="primary"
            label="Confirm"
            onPress={() => setShowDetails(false)}
          />
        </View>
      </Modal>
    </>
  );
};

const RateCard = ({ rate, selected, onSelect }: any) => {
  const display = mapRateToDisplay(rate);

  return (
    <TouchableOpacity
      onPress={onSelect}
      activeOpacity={0.8}
      className={`p-4 rounded-2xl border ${
        selected
          ? "border-purple-500 bg-purple-50"
          : "border-slate-200 bg-white"
      }`}
      style={{ width: 300 }}
    >
      {/* TOP ROW: PRICE + PAYMENT TYPE */}
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-lg font-poppins-bold text-slate-900">
            {display.pricing.currency} {display.pricing.total}
          </Text>

          <Text className="text-xs text-slate-500">
            {display.badges.paymentType === "pay_now"
              ? "Pay now"
              : "Pay at hotel"}
          </Text>
        </View>

        {/* REFUND BADGE */}
        <View
          className={`px-3 py-1 rounded-full ${
            display.cancellationPolicy.refundable
              ? "bg-green-100"
              : "bg-red-100"
          }`}
        >
          <Text
            className={`text-xs font-semibold ${
              display.cancellationPolicy.refundable
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {display.cancellationPolicy.refundable
              ? "Free cancellation"
              : "Non-refundable"}
          </Text>
        </View>
      </View>

      {/* MIDDLE: KEY POLICY SUMMARY */}
      <Text className="mt-2 text-xs text-slate-700 leading-4">
        {display.cancellationPolicy.summary ||
          display.ratePolicy ||
          "Standard hotel conditions apply"}
      </Text>

      {/* BADGES ROW */}
      <View className="flex-row gap-2 mt-3 flex-wrap">
        <View className="bg-slate-100 px-2 py-1 rounded-md">
          <Text className="text-[10px] text-slate-600">
            {display.badges.boardType}
          </Text>
        </View>

        {display.pricing.dueAtHotel !== "0.00" && (
          <View className="bg-orange-100 px-2 py-1 rounded-md">
            <Text className="text-[10px] text-orange-700">
              Pay at hotel: {display.pricing.dueAtHotel}
            </Text>
          </View>
        )}

        <View className="bg-slate-100 px-2 py-1 rounded-md">
          <Text className="text-[10px] text-slate-600">
            {display.availability.quantity} left
          </Text>
        </View>
      </View>

      {/* FOOTER HINT */}
    </TouchableOpacity>
  );
};

const RateDetails = ({ rate }: any) => {
  const display = mapRateToDisplay(rate);

  return (
    <ScrollView contentContainerStyle={{ marginTop: 40 }}>
      {/* TITLE */}
      <Text className="text-lg font-poppins-bold text-slate-900 mb-4">
        Rate Details
      </Text>

      {/* PRICE SUMMARY */}
      <View className="bg-slate-50 p-4 rounded-2xl mb-4">
        <Text className="text-sm font-semibold text-slate-700">
          Price Breakdown
        </Text>

        <Text className="text-xs text-slate-600 mt-2">
          Base: {display.pricing.base}
        </Text>
        <Text className="text-xs text-slate-600">
          Taxes: {display.pricing.tax}
        </Text>
        <Text className="text-xs text-slate-600">
          Fees: {display.pricing.fee}
        </Text>

        <Text className="text-sm font-bold mt-2 text-slate-900">
          Total: {display.pricing.currency} {display.pricing.total}
        </Text>

        {Number(display.pricing.dueAtHotel) > 0 && (
          <Text className="text-xs text-orange-600 mt-1">
            Pay at hotel: {display.pricing.dueAtHotel}
          </Text>
        )}
      </View>

      {/* CANCELLATION POLICY */}
      <View className="mb-4">
        <Text className="font-semibold text-slate-800 mb-2">
          Cancellation Policy
        </Text>

        <Text className="text-xs text-slate-600 leading-5">
          {display.cancellationPolicy.summary ||
            "Standard cancellation rules apply"}
        </Text>

        <View className="mt-2">
          {display.cancellationPolicy.timeline?.length > 0 ? (
            display.cancellationPolicy.timeline.map((t: any, i: number) => {
              const item = typeof t === "string" ? JSON.parse(t) : t;

              return (
                <Text
                  key={i}
                  className="text-[11px] font-dm-sans-medium text-slate-500"
                >
                  • Refund {item.refund_amount} {item.currency} before{" "}
                  {new Date(item.before).toLocaleString()}
                </Text>
              );
            })
          ) : (
            <Text className="text-[11px] text-slate-400">
              No detailed timeline available
            </Text>
          )}
        </View>
      </View>

      {/* GUARANTEE + CONDITIONS */}
      <View className="mb-4">
        <Text className="font-semibold text-slate-800 mb-2">
          Hotel Conditions
        </Text>

        {display.cancellationPolicy.raw?.map((c: any, i: number) => (
          <View key={i} className="mb-3">
            <Text className="text-sm font-semibold text-slate-800">
              {c.title}
            </Text>
            <Text className="text-xs text-slate-600 leading-5">
              {c.description}
            </Text>
          </View>
        ))}
      </View>

      {/* POLICY TYPE SUMMARY */}
      <View className="p-3 rounded-xl bg-purple-50">
        <Text className="text-xs text-purple-700 font-semibold">
          {display.cancellationPolicy.refundable
            ? "✓ This rate is refundable under conditions"
            : "⚠️ This rate is non-refundable"}
        </Text>
      </View>
    </ScrollView>
  );
};

export default HotelItem;
