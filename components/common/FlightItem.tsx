import { IFlightOffer } from "@/types/flight";
import df from "@/utils/date";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
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
  } = data;

  const flightDisplay = Array.isArray(flightNumbers)
    ? flightNumbers.join(" • ")
    : flightNumbers;

  const stopsLabel =
    stops.length === 0
      ? "Direct"
      : `${stops.length} Stop${stops.length > 1 ? "s" : ""}`;

  return (
    <View className="bg-slate-200 rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      {/* VERTICAL HEADER SECTION */}
      <View className="flex flex-row justify-between items-start mb-4 pb-3 border-b border-gray-50">
        <View className="flex-1">
          {/* Top Row: Icon + Airline Name */}
          <View className="flex flex-row items-center gap-2 mb-2">
            <View className="bg-blue-50 p-1.5 rounded-full shrink-0">
              <MaterialIcons name="airlines" size={16} color="#2563eb" />
            </View>
            <Text
              className="font-dm-sans-bold text-gray-800 text-sm uppercase tracking-wider flex-1"
              numberOfLines={1}
            >
              {airlineName}
            </Text>
          </View>

          {/* Bottom Row: Flight Number Badge */}
          <View className="flex flex-row">
            <View className="bg-gray-100 px-2 py-0.5 rounded-md">
              <Text className="font-dm-sans-medium text-[10px] text-gray-500">
                {flightDisplay}
              </Text>
            </View>
          </View>
        </View>

        {/* REFRESH BUTTON - Positioned top-right of the header area */}
        {onRefresh && (
          <TouchableOpacity
            onPress={onRefresh}
            disabled={refreshLoading}
            activeOpacity={0.6}
            className="p-1 bg-gray-50 rounded-full border border-gray-100 ml-2"
          >
            {refreshLoading ? (
              <ActivityIndicator size={14} color="#9ca3af" />
            ) : (
              <MaterialCommunityIcons name="cached" size={16} color="#9ca3af" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {/* TIMELINE SECTION (Unchanged) */}
      <View className="flex flex-row items-center justify-between py-2">
        <View className="flex flex-col items-start flex-1">
          <Text className="font-poppins-bold text-2xl text-gray-800">
            {originIata}
          </Text>
          <Text className="font-dm-sans-medium text-gray-500 text-[10px]">
            {df.toShortDateTime(departureTime)}
          </Text>
        </View>

        <View className="flex-1 items-center px-2 gap-1">
          <Text className="font-dm-sans-medium text-[9px] text-gray-500 mb-1">
            {duration}
          </Text>
          <View className="w-full h-[1px] bg-gray-400 relative flex items-center justify-center">
            <View className="absolute px-2">
              <MaterialCommunityIcons
                name="airplane"
                size={14}
                color="#6b7280"
              />
            </View>
          </View>
          <Text
            className={`font-dm-sans-bold text-[9px] mt-1 ${
              stops.length === 0 ? "text-green-600" : "text-orange-500"
            }`}
          >
            {stopsLabel}
          </Text>
        </View>

        <View className="flex flex-col items-end flex-1">
          <Text className="font-poppins-bold text-2xl text-gray-800">
            {destinationIata}
          </Text>
          <Text className="font-dm-sans-medium text-gray-500 text-[10px]">
            {df.toShortDateTime(arrivalTime)}
          </Text>
        </View>
      </View>

      {/* FOOTER SECTION */}
      <View className="mt-4 pt-3 border-t border-gray-50 flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-1">
          <MaterialCommunityIcons
            name="calendar-range"
            size={12}
            color="#9ca3af"
          />
          <Text className="font-dm-sans-medium text-[10px] text-gray-500">
            {df.toShortDate(departureTime)}
          </Text>
        </View>

        <View className="flex flex-row items-start gap-1">
          <Text className="font-poppins-semibold text-[10px] text-gray-600">
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

export default FlightItem;
