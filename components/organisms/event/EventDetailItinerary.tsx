import { IBooking } from "@/types/booking";
import { formatDateTime } from "@/utils/format";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface EventDetailItineraryProps {
  booking: IBooking | null;
}

const EventDetailItinerary: React.FC<EventDetailItineraryProps> = ({
  booking,
}) => {
  if (!booking) {
    return (
      <View className="flex-1 items-center justify-center">
        <View className="flex-1 items-center justify-center gap-2">
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={48}
            color="#1f2937"
          />
          <Text className="text-gray-800 font-poppins-semibold">
            No itinerary
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 gap-4 overflow-hidden">
      {/* Flight */}
      {booking?.flight ? (
        <View className="w-full rounded-lg gap-2">
          <Text className="text-gray-700 font-poppins-semibold mb-2">
            Flight Details
          </Text>

          <View className="flex flex-row items-start gap-2">
            <MaterialIcons name="airlines" size={16} color="#4b5563" />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Airline: {booking.flight.validatingAirline}
            </Text>
          </View>

          <View className="flex flex-row items-start gap-2">
            <MaterialCommunityIcons
              name="calendar-clock-outline"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Departure:{" "}
              {booking.flight.itineraries[0].segments[0].departure.airport} -{" "}
              {
                booking.flight.itineraries[0].segments[0].departure.datetime.split(
                  "T",
                )[1]
              }{" "}
              /{" "}
              {formatDateTime(
                booking.flight.itineraries[0].segments[0].departure.datetime.split(
                  "T",
                )[0] as string,
              )}
            </Text>
          </View>

          <View className="flex flex-row items-start gap-2">
            <MaterialCommunityIcons
              name="airplane-takeoff"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Arrival:{" "}
              {
                booking.flight.itineraries[0].segments[
                  booking.flight.itineraries[0].segments.length - 1
                ].arrival.airport
              }{" "}
              -{" "}
              {
                booking.flight.itineraries[0].segments[
                  booking.flight.itineraries[0].segments.length - 1
                ].arrival.datetime.split("T")[1]
              }{" "}
              /{" "}
              {formatDateTime(
                booking.flight.itineraries[0].segments[
                  booking.flight.itineraries[0].segments.length - 1
                ].arrival.datetime as string,
              )}
            </Text>
          </View>

          <View className="flex flex-row items-start gap-2">
            <MaterialIcons name="event-seat" size={16} color="#4b5563" />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              PNR / Record Locator: {booking.flight.associatedRecord.reference}
            </Text>
          </View>
        </View>
      ) : (
        <View className="w-full flex flex-col items-center justify-center gap-2">
          <MaterialCommunityIcons
            name="airplane-off"
            size={24}
            color="#4b5563"
          />
          <Text className="font-poppins-semibold text-gray-600">No flight</Text>
        </View>
      )}

      <View className="w-full h-[1px] bg-gray-200"></View>

      {/* Hotel */}
      {booking?.hotel ? (
        <View className="w-full rounded-lg gap-2">
          <Text className="text-gray-700 font-poppins-semibold mb-2">
            Hotel Booking
          </Text>

          <View className="flex flex-row items-start gap-2">
            <MaterialIcons name="hotel" size={16} color="#4b5563" />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Hotel: {booking.hotel.hotel.name}
            </Text>
          </View>

          <View className="flex flex-row items-start gap-2">
            <MaterialCommunityIcons
              name="clock-check-outline"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Check-in: {formatDateTime(booking.hotel.checkIn)}
            </Text>
          </View>

          <View className="flex flex-row items-start gap-2">
            <MaterialCommunityIcons
              name="clock-check-outline"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Check-out: {formatDateTime(booking.hotel.checkOut)}
            </Text>
          </View>

          <View className="flex flex-row items-start gap-2">
            <MaterialIcons name="bed" size={16} color="#4b5563" />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Room:{" "}
              {booking.hotel.rooms.map((room) => room.roomType).join(" / ") ||
                "-"}
            </Text>
          </View>
        </View>
      ) : (
        <View className="w-full flex flex-col items-center justify-center gap-3">
          <MaterialCommunityIcons
            name="bank-off-outline"
            size={24}
            color="#4b5563"
          />
          <Text className="font-poppins-semibold text-gray-600">No hotel</Text>
        </View>
      )}

      <View className="w-full h-[1px] bg-gray-200"></View>

      {/* Chauffeur Pickup Info (Gold Package Only) */}
      {booking?.transfer?.ah ? (
        <View className="w-full rounded-lg gap-2">
          <Text className="text-gray-700 font-poppins-semibold mb-2">
            Aiport To Hotel Transfer Details
          </Text>

          <View className="flex flex-row items-start gap-2">
            <MaterialCommunityIcons name="account" size={16} color="#4b5563" />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Driver: {booking.transfer.ah.provider.name}
            </Text>
          </View>

          <View className="flex flex-row items-start gap-2">
            <MaterialIcons name="directions-car" size={16} color="#4b5563" />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Car: {booking.transfer.ah.vehicle.description}
            </Text>
          </View>

          <View className="flex flex-row items-start gap-2">
            <MaterialIcons name="luggage" size={16} color="#4b5563" />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Pickup: {booking.transfer.ah.start.locationCode}
            </Text>
          </View>

          <View className="flex flex-row items-start gap-2">
            <MaterialIcons name="phone-in-talk" size={16} color="#4b5563" />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Contact: {booking.transfer.ah.provider.contacts?.phoneNumber}
            </Text>
          </View>
        </View>
      ) : (
        <View
          className={`w-full bg-white rounded-xl p-4 gap-3 overflow-hidden`}
        >
          <View className="w-full flex flex-col items-center justify-center gap-2">
            <MaterialCommunityIcons name="car-off" size={24} color="#4b5563" />
            <Text className="font-poppins-semibold text-gray-600">
              No Aiport To Hotel Transfer Details
            </Text>
          </View>
        </View>
      )}

      {booking?.transfer?.ah ? (
        <View className="w-full rounded-lg gap-2">
          <Text className="text-gray-700 font-poppins-semibold mb-2">
            Hotel To Event Transfer Details
          </Text>

          <View className="flex flex-row items-start gap-2">
            <MaterialCommunityIcons name="account" size={16} color="#4b5563" />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Driver: {booking.transfer.he.provider.name}
            </Text>
          </View>

          <View className="flex flex-row items-start gap-2">
            <MaterialIcons name="directions-car" size={16} color="#4b5563" />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Car: {booking.transfer.he.vehicle.description}
            </Text>
          </View>

          <View className="flex flex-row items-start gap-2">
            <MaterialIcons name="luggage" size={16} color="#4b5563" />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Pickup: {booking.transfer.he.start.locationCode}
            </Text>
          </View>

          <View className="flex flex-row items-start gap-2">
            <MaterialIcons name="phone-in-talk" size={16} color="#4b5563" />
            <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
              Contact: {booking.transfer.he.provider.contacts?.phoneNumber}
            </Text>
          </View>
        </View>
      ) : (
        <View
          className={`w-full bg-white rounded-xl p-4 gap-3 overflow-hidden`}
        >
          <View className="w-full flex flex-col items-center justify-center gap-2">
            <MaterialCommunityIcons name="car-off" size={24} color="#4b5563" />
            <Text className="font-poppins-semibold text-gray-600">
              No Hotel To Event Transfer Details
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default EventDetailItinerary;
