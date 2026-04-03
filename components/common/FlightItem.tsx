import { IFlightOffer, TFlightBookStatus } from "@/types/flight";
import df from "@/utils/date";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useFlight } from "../providers/FlightProvider";

interface FlightItemProps {
  data: IFlightOffer | null;
  status?: TFlightBookStatus;
  reference?: string;
  refreshLoading?: boolean;
  onRefresh?: () => Promise<void>;
  isRemovable?: boolean;
}

const FlightItem: React.FC<FlightItemProps> = ({
  data: offer,
  status,
  reference,
  refreshLoading,
  onRefresh,
  isRemovable,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!offer) return null;
  const { initialize } = useFlight();

  const { airlineLogo, airlineName, slices } = offer;
  const { currency, totalAmount } = offer.converted;

  return (
    <View className="mb-4 shadow-xl shadow-purple-200">
      <LinearGradient
        colors={["#844AFF", "#C427E0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 24, padding: 1, elevation: 5 }}
      >
        <View className="bg-white/95 rounded-[23px] p-5 overflow-hidden">
          {/* Background airplane icon */}
          <View className="absolute -right-12 -top-12 opacity-[0.05]">
            <MaterialCommunityIcons name="airplane" size={160} color="#000" />
          </View>

          {/* HEADER */}
          <View className="flex-row gap-2 items-center mb-5">
            {airlineLogo ? (
              <Image source={airlineLogo} style={{ width: 24, height: 24 }} />
            ) : (
              <MaterialIcons name="airlines" size={22} color="#844AFF" />
            )}
            <View className="flex-1 pr-4">
              <Text className="font-poppins-bold text-lg text-slate-900">
                {airlineName}
              </Text>

              <Text className="font-dm-sans-bold text-[11px] text-slate-400">
                {slices.length === 2 ? "Round Trip Flight" : "One Way Flight"}
              </Text>
            </View>

            {/* STATUS */}
            {status && (
              <View
                className={`${
                  status === "processing"
                    ? "bg-yellow-100"
                    : status === "failed"
                      ? "bg-red-100"
                      : "bg-green-100"
                } px-3 py-1 rounded-full flex-row items-center mr-2`}
              >
                <MaterialCommunityIcons
                  name={
                    status === "processing"
                      ? "clock-outline"
                      : status === "failed"
                        ? "close-circle-outline"
                        : "check-decagram"
                  }
                  size={14}
                  color={
                    status === "processing"
                      ? "#a16207"
                      : status === "failed"
                        ? "#b91c1c"
                        : "#16a34a"
                  }
                />

                <Text
                  className={`${
                    status === "processing"
                      ? "text-yellow-700"
                      : status === "failed"
                        ? "text-red-700"
                        : "text-green-700"
                  } font-dm-sans-bold text-[10px] ml-1 uppercase`}
                >
                  {status === "processing" ? "Pending" : status}
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

            {isRemovable && (
              <TouchableOpacity
                onPress={initialize}
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

          {/* FLIGHT SLICES */}
          {slices.map((slice, index) => {
            const stopsLabel =
              slice.stops.length === 0
                ? "Non-stop"
                : `${slice.stops.length} stop • ${slice.stops
                    .map((s) => s.iataCode)
                    .join(", ")}`;

            return (
              <View key={index} className="mb-5">
                {slices.length > 1 && (
                  <Text className="font-dm-sans-bold text-[9px] text-purple-400 uppercase tracking-widest mb-2">
                    {index === 0 ? "Outbound Flight" : "Return Flight"}
                  </Text>
                )}

                {/* ROUTE SUMMARY */}
                <View className="flex-row items-center justify-between">
                  {/* ORIGIN */}
                  <View>
                    <Text className="font-poppins-bold text-3xl text-slate-900">
                      {slice.originIata}
                    </Text>

                    <Text className="font-dm-sans-bold text-[11px] text-slate-400">
                      {df.toShortDateTime(slice.departureTime)}
                    </Text>
                  </View>

                  {/* CENTER */}
                  <View className="flex-1 items-center px-4">
                    <Text className="font-dm-sans-bold text-[10px] text-purple-400 mb-1">
                      {slice.duration}
                    </Text>

                    <View className="flex-row items-center w-full">
                      <View className="flex-1 h-[1px] bg-slate-200" />
                      <MaterialCommunityIcons
                        name="airplane"
                        size={16}
                        color="#C427E0"
                      />
                      <View className="flex-1 h-[1px] bg-slate-200" />
                    </View>

                    <Text className="font-dm-sans-bold text-[10px] text-amber-500 mt-1">
                      {stopsLabel}
                    </Text>
                  </View>

                  {/* DESTINATION */}
                  <View className="items-end">
                    <Text className="font-poppins-bold text-3xl text-slate-900">
                      {slice.destinationIata}
                    </Text>

                    <Text className="font-dm-sans-bold text-[11px] text-slate-400">
                      {df.toShortDateTime(slice.arrivalTime)}
                    </Text>
                  </View>
                </View>

                {/* EXPANDED TIMELINE */}
                {expanded && (
                  <View className="mt-4 border-t border-slate-100 pt-4">
                    {/* ORIGIN */}
                    <View className="flex-row justify-between mb-3">
                      <Text className="font-poppins-bold text-slate-900">
                        {slice.originIata}
                      </Text>

                      <Text className="font-dm-sans-bold text-[11px] text-slate-400">
                        {df.toShortDateTime(slice.departureTime)}
                      </Text>
                    </View>

                    {slice.flightNumbers.map((flight, i) => {
                      const stop = slice.stops[i];

                      return (
                        <View key={i} className="mb-4">
                          {/* Flight */}
                          <View className="flex-row items-center ml-2">
                            <MaterialCommunityIcons
                              name="airplane"
                              size={14}
                              color="#C427E0"
                            />

                            <Text className="ml-2 font-dm-sans-bold text-purple-600 text-[11px]">
                              {flight}
                            </Text>
                          </View>

                          {/* Stop */}
                          {stop && (
                            <View className="ml-5 mt-2">
                              <View className="flex-row justify-between">
                                <Text className="font-poppins-bold text-slate-800">
                                  {stop.iataCode}
                                </Text>

                                <Text className="font-dm-sans-bold text-[11px] text-slate-400">
                                  {df.toShortDateTime(stop.arrivalTime)}
                                </Text>
                              </View>

                              <Text className="font-dm-sans-bold text-[10px] text-slate-400 mt-1">
                                Layover {stop.duration}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })}

                    {/* DESTINATION */}
                    <View className="flex-row justify-between">
                      <Text className="font-poppins-bold text-slate-900">
                        {slice.destinationIata}
                      </Text>

                      <Text className="font-dm-sans-bold text-[11px] text-slate-400">
                        {df.toShortDateTime(slice.arrivalTime)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}

          {/* EXPAND BUTTON */}
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            className="items-center mb-4"
          >
            <Text className="font-dm-sans-bold text-purple-600 text-[11px]">
              {expanded ? "Hide route details" : "Show full route"}
            </Text>
          </TouchableOpacity>

          {/* BOOKING REF */}
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
              display: "flex",
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
                Instant Ticket
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

export default FlightItem;
