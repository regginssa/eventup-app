import { IFlightOffer } from "@/types/flight";
import df from "@/utils/date";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface FlightItemProps {
  data: IFlightOffer | null;
}

const FlightItem: React.FC<FlightItemProps> = ({ data }) => {
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

  // Helper to format the flight number display
  const flightDisplay = Array.isArray(flightNumbers)
    ? flightNumbers.join(" • ")
    : flightNumbers;
  const stopsLabel =
    stops.length === 0
      ? "Direct"
      : `${stops.length} Stop${stops.length > 1 ? "s" : ""}`;

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
      {/* TIMELINE SECTION */}
      <View className="flex flex-row items-center justify-between py-2">
        {/* Origin */}
        <View className="flex flex-col items-start flex-1">
          <Text className="font-poppins-bold text-2xl text-gray-800">
            {originIata}
          </Text>
          <Text className="font-dm-sans-medium text-gray-500 text-xs">
            {df.toShortDateTime(departureTime)}
          </Text>
        </View>

        {/* Visual Line & Stops */}
        <View className="flex-1 items-center px-2 gap-1">
          <Text className="font-dm-sans-medium text-[10px] text-gray-500 mb-1">
            {duration}
          </Text>
          <View className="w-full h-[1px] bg-gray-300 relative flex items-center justify-center">
            <View className="absolute bg-white px-1">
              <MaterialCommunityIcons
                name="airplane"
                size={14}
                color="#9ca3af"
              />
            </View>
          </View>
          <Text
            className={`font-dm-sans-bold text-[10px] mt-1 ${stops.length === 0 ? "text-green-600" : "text-orange-500"}`}
          >
            {stopsLabel}
          </Text>
        </View>

        {/* Destination */}
        <View className="flex flex-col items-end flex-1">
          <Text className="font-poppins-bold text-2xl text-gray-800">
            {destinationIata}
          </Text>
          <Text className="font-dm-sans-medium text-gray-500 text-xs">
            {df.toShortDateTime(arrivalTime)}
          </Text>
        </View>
      </View>

      {/* DATE & FOOTER INFO */}
      <View className="mt-4 pt-3 border-t border-gray-50 flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-1">
          <MaterialCommunityIcons
            name="calendar-range"
            size={14}
            color="#6b7280"
          />
          <Text className="font-dm-sans-medium text-xs text-gray-500">
            {df.toShortDate(departureTime)}
          </Text>
        </View>

        <View className="flex flex-row items-start gap-1">
          <Text className="font-poppins-semibold text-xs text-gray-600">
            {currency}
          </Text>
          <Text className="font-poppins-bold text-xl text-green-700">
            {totalAmount}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default FlightItem;
