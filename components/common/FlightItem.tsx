import { IFlightOffer } from "@/types/flight";
import df from "@/utils/date";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

interface FlightItemProps {
  data: IFlightOffer | null;
  refreshLoading?: boolean;
  onRefresh?: () => Promise<void>;
}

const FlightItem: React.FC<FlightItemProps> = ({
  data,
  refreshLoading,
  onRefresh,
}) => {
  if (!data) return null;

  const {
    originIata,
    destinationIata,
    departureTime,
    arrivalTime,
    stops,
    airlineName,
    duration,
    totalAmount,
    currency,
    flightNumbers,
    airlineLogo,
  } = data;

  const flightDisplay = Array.isArray(flightNumbers)
    ? flightNumbers.join(" • ")
    : flightNumbers;

  const stopsLabel =
    stops && stops.length === 0
      ? "Non-stop"
      : `${stops?.length} Stop${stops?.length > 1 ? "s" : ""}`;

  return (
    <View className="mb-4 shadow-xl shadow-purple-200">
      <LinearGradient
        // Using your brand gradient profile
        colors={["#844AFF", "#C427E0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: 24, padding: 1, elevation: 5 }}
      >
        <View className="bg-white/95 rounded-[23px] p-5 overflow-hidden">
          {/* Subtle Background Pattern (Optional Overlay) */}
          <View className="absolute -right-10 -top-10 opacity-5">
            <MaterialCommunityIcons name="airplane" size={150} color="#000" />
          </View>

          {/* HEADER SECTION */}
          <View className="flex flex-row justify-between items-center mb-5">
            <View className="flex flex-row items-center gap-3">
              <LinearGradient
                colors={["#844AFF20", "#C427E020"]}
                className="p-2"
                style={{ borderRadius: 12 }}
              >
                {airlineLogo ? (
                  <Image
                    source={airlineLogo}
                    style={{ width: 18, height: 18 }}
                    contentFit="cover"
                  />
                ) : (
                  <MaterialIcons name="airlines" size={18} color="#844AFF" />
                )}
              </LinearGradient>
              <View>
                <Text
                  className="font-poppins-bold text-slate-800 text-sm uppercase tracking-tighter"
                  numberOfLines={1}
                >
                  {airlineName}
                </Text>
                <Text className="font-dm-sans-bold text-[10px] text-purple-500/60 uppercase">
                  {flightDisplay}
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

          {/* MAIN JOURNEY SECTION */}
          <View className="flex flex-row items-center justify-between relative mb-6">
            {/* Origin */}
            <View className="items-start">
              <Text className="font-poppins-bold text-3xl text-slate-900 leading-none">
                {originIata}
              </Text>
              <Text className="font-dm-sans-bold text-[11px] text-slate-400 mt-1">
                {df.to24HourTime(departureTime)}
              </Text>
            </View>

            {/* Path Graphic */}
            <View className="flex-1 items-center px-4 relative">
              <Text className="font-dm-sans-bold text-[9px] text-purple-400 absolute -top-4">
                {duration}
              </Text>

              <View className="w-full flex-row items-center justify-center">
                <View className="h-[1.5px] flex-1 bg-slate-100 rounded-full" />
                <View className="mx-2 rotate-90">
                  <MaterialCommunityIcons
                    name="airplane"
                    size={18}
                    color="#C427E0"
                  />
                </View>
                <View className="h-[1.5px] flex-1 bg-slate-100 rounded-full" />
              </View>

              <View
                className="mt-2 px-2 py-0.5 rounded-full border"
                style={{
                  borderColor: stops.length === 0 ? "#10b98130" : "#f59e0b30",
                }}
              >
                <Text
                  className={`font-dm-sans-bold text-[8px] uppercase tracking-widest ${
                    stops.length === 0 ? "text-emerald-500" : "text-amber-500"
                  }`}
                >
                  {stopsLabel}
                </Text>
              </View>
            </View>

            {/* Destination */}
            <View className="items-end">
              <Text className="font-poppins-bold text-3xl text-slate-900 leading-none">
                {destinationIata}
              </Text>
              <Text className="font-dm-sans-bold text-[11px] text-slate-400 mt-1">
                {df.to24HourTime(arrivalTime)}
              </Text>
            </View>
          </View>

          {/* FOOTER ACTION AREA */}
          <LinearGradient
            colors={["#F8FAFC", "#FFFFFF"]}
            className="flex-row items-center justify-between p-3 rounded-2xl border border-slate-50"
          >
            <View className="flex-row items-center gap-2">
              <View className="bg-slate-200/50 p-1.5 rounded-lg">
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={14}
                  color="#64748b"
                />
              </View>
              <Text className="font-dm-sans-bold text-[11px] text-slate-500">
                {df.toShortDate(departureTime)}
              </Text>
            </View>

            <View className="flex-row items-baseline gap-1">
              <Text className="font-dm-sans-bold text-[10px] text-slate-400">
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
