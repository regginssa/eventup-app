import { TAmadeusFlightOffer } from "@/types/amadeus";
import { formatEventDate, getCurrencySymbol } from "@/utils/format";
import { mapAmadeusFlightOfferToFlightItemData } from "@/utils/map";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export type TFlightItemData = {
  from: string;
  to: string;

  departureDate: string;
  arrivalDate: string;

  stops: number;

  airlineCode: string;
  airlineName: string;

  flightNumber: string;

  seatsLeft: number;

  refundable: boolean;

  price: {
    total: string;
    currency: string;
  };
};

interface FlightItemProps {
  data: TAmadeusFlightOffer;
  hiddenHeader?: boolean;
}

const FlightItem: React.FC<FlightItemProps> = ({ data, hiddenHeader }) => {
  if (!data) return null;

  const { from, to, departureDate, arrivalDate, stops, airlineCode, airlineName, flightNumber, seatsLeft, refundable, price } = mapAmadeusFlightOfferToFlightItemData(data);

  return (
    <>
      {!hiddenHeader && (
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons name="airplane" size={20} color="#374151" />
          <Text className="font-dm-sans-bold text-gray-700">Flight</Text>
        </View>
      )}

      <View className="w-full px-2 flex flex-col items-start gap-2">
        {/* FROM */}
        <View className="w-full flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons name="airport" size={16} color="#4b5563" />
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              From:
            </Text>
          </View>
          <Text className="font-poppins-semibold text-gray-600">{from}</Text>
        </View>

        {/* TO */}
        <View className="w-full flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="airplane-landing"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              To:
            </Text>
          </View>
          <Text className="font-poppins-semibold text-gray-600">{to}</Text>
        </View>

        {/* DEPARTURE */}
        <View className="w-full flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="calendar-clock-outline"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Departure:
            </Text>
          </View>
          <Text className="font-poppins-semibold text-gray-600">
            {departureDate ? formatEventDate(new Date(departureDate)) : "-"}
          </Text>
        </View>

        {/* ARRIVAL */}
        <View className="w-full flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="calendar-check-outline"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Arrival:
            </Text>
          </View>

          <Text className="font-poppins-semibold text-gray-600">
            {arrivalDate ? formatEventDate(new Date(arrivalDate)) : "-"}
          </Text>
        </View>

        {/* STOPS */}
        <View className="w-full flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="airplane-landing"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Stops:
            </Text>
          </View>

          <Text className="font-poppins-semibold text-gray-600">{stops}</Text>
        </View>

        {/* AIRLINE */}
        <View className="w-full flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialIcons name="airlines" size={16} color="#4b5563" />
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Airline:
            </Text>
          </View>

          <Text className="font-poppins-semibold text-gray-600">
            {airlineName} ({airlineCode})
          </Text>
        </View>

        {/* FLIGHT NUMBER */}
        <View className="w-full flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons name="airplane" size={16} color="#4b5563" />
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Flight No:
            </Text>
          </View>

          <Text className="font-poppins-semibold text-gray-600">
            {flightNumber}
          </Text>
        </View>

        {/* SEATS LEFT */}
        <View className="w-full flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="seat-outline"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Seats Left:
            </Text>
          </View>

          <Text className="font-poppins-semibold text-gray-600">
            {seatsLeft}
          </Text>
        </View>

        {/* REFUNDABILITY */}
        <View className="w-full flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="credit-card-refund-outline"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Refundability:
            </Text>
          </View>

          <Text className="font-poppins-semibold text-gray-600">
            {refundable ? "Yes" : "No"}
          </Text>
        </View>

        {/* PRICE */}
        <View className="w-full flex flex-row items-center justify-between">
          <Text className="font-dm-sans-bold text-gray-700 text-lg">
            Total Price:
          </Text>
          <Text className="font-poppins-bold text-gray-600 text-xl">
            <Text className="text-base">
              {getCurrencySymbol(price?.currency as any)}
            </Text>
            {price?.total}
          </Text>
        </View>
      </View>
    </>
  );
};

export default FlightItem;
