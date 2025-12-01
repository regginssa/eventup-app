import { TFlightAvailability } from "@/types";
import { formatEventDate, getCurrencySymbol } from "@/utils/format";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface FlightItemProps {
  flight: TFlightAvailability;
  hiddenHeader?: boolean;
}

const FlightItem: React.FC<FlightItemProps> = ({ flight, hiddenHeader }) => {
  const flightDepartureDate =
    flight?.FareItinerary?.OriginDestinationOptions[0]
      ?.OriginDestinationOption[0]?.FlightSegment?.DepartureDateTime;
  const flightArrivalDate =
    flight?.FareItinerary?.OriginDestinationOptions[0]?.OriginDestinationOption[
      flight?.FareItinerary?.OriginDestinationOptions[0]
        ?.OriginDestinationOption.length - 1
    ]?.FlightSegment.ArrivalDateTime;
  const flightDepartureCode =
    flight?.FareItinerary?.OriginDestinationOptions[0]
      ?.OriginDestinationOption[0]?.FlightSegment?.DepartureAirportLocationCode;
  const flightArrivalCode =
    flight?.FareItinerary?.OriginDestinationOptions[0]?.OriginDestinationOption[
      flight?.FareItinerary?.OriginDestinationOptions[0]
        ?.OriginDestinationOption.length - 1
    ]?.FlightSegment.ArrivalAirportLocationCode;
  const flightAirlineName =
    flight?.FareItinerary?.OriginDestinationOptions[0]
      ?.OriginDestinationOption[0].FlightSegment?.MarketingAirlineName;
  const stops = flight?.FareItinerary?.OriginDestinationOptions[0]?.TotalStops;
  const flightNo =
    flight?.FareItinerary?.OriginDestinationOptions[0]
      ?.OriginDestinationOption[0].FlightSegment.FlightNumber;
  const seatsLeft =
    flight?.FareItinerary?.OriginDestinationOptions[0]
      ?.OriginDestinationOption[0]?.SeatsRemaining?.Number;
  const refundable = flight?.FareItinerary?.AirItineraryFareInfo?.IsRefundable;
  const currency =
    flight?.FareItinerary?.AirItineraryFareInfo.ItinTotalFares.TotalFare?.CurrencyCode.toLowerCase();
  const totalPrice =
    flight?.FareItinerary?.AirItineraryFareInfo?.ItinTotalFares?.TotalFare
      ?.Amount;

  return (
    <>
      {!hiddenHeader && (
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons name="airplane" size={20} color="#374151" />
          <Text className="font-dm-sans-bold text-gray-700">Flight</Text>
        </View>
      )}

      <View className="w-full px-2">
        {/* FROM */}
        <View className="w-full flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons name="airport" size={16} color="#4b5563" />
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              From:
            </Text>
          </View>
          <Text className="font-poppins-semibold text-gray-600">
            {flightDepartureCode}
          </Text>
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
          <Text className="font-poppins-semibold text-gray-600">
            {flightArrivalCode}
          </Text>
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
            {flightDepartureDate
              ? formatEventDate(new Date(flightDepartureDate))
              : "-"}
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
            {flightArrivalDate
              ? formatEventDate(new Date(flightArrivalDate))
              : "-"}
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
            {flightAirlineName}
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
            {flightNo}
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
            {refundable}
          </Text>
        </View>

        {/* PRICE */}
        <View className="w-full flex flex-row items-center justify-between mt-2">
          <Text className="font-dm-sans-bold text-gray-700 text-lg">
            Total Price:
          </Text>
          <Text className="font-poppins-bold text-gray-600 text-xl">
            <Text className="text-base">
              {getCurrencySymbol(currency as any)}
            </Text>
            {totalPrice}
          </Text>
        </View>
      </View>
    </>
  );
};

export default FlightItem;
