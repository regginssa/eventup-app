import {
  FlightItem,
  HotelItem,
  OfficialTicketItem,
  TransferItem,
} from "@/components/common";
import { IBooking } from "@/types/booking";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface EventDetailItineraryProps {
  booking: IBooking | null;
}

const EventDetailItinerary: React.FC<EventDetailItineraryProps> = ({
  booking,
}) => {
  if (!booking) {
    return (
      <View className="flex-1 items-center justify-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
        <View className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-sm mb-4">
          <MaterialCommunityIcons
            name="calendar-blank-outline"
            size={32}
            color="#94a3b8"
          />
        </View>
        <Text className="text-slate-800 font-poppins-semibold text-lg">
          Empty Itinerary
        </Text>
        <Text className="text-slate-400 font-dm-sans-medium text-center px-8 text-sm mt-1">
          Your confirmed bookings will appear here once your trip is finalized.
        </Text>
      </View>
    );
  }

  const { flight, hotel, transfer, ticketStatus, event } = booking;

  // Helper to render the timeline dot/line
  const TimelineConnector = () => (
    <View className="items-center w-6">
      <LinearGradient
        colors={["#844AFF", "#12A9FF"]}
        className="w-4 h-4 border-2 border-white shadow-sm z-10"
        style={{ borderRadius: 8 }}
      />
      <View className="w-[2px] flex-1 bg-slate-100 -my-1" />
    </View>
  );

  return (
    <View className="flex-1">
      <View className="mb-6 gap-4">
        <View className="flex-row items-center justify-between px-1">
          <View>
            <Text className="font-poppins-bold text-slate-800 text-xl">
              My Ticket
            </Text>
          </View>
          <View
            className={`${ticketStatus === "pending" ? "bg-yellow-100" : ticketStatus === "failed" ? "bg-red-100" : "bg-green-100"} px-3 py-1 rounded-full flex-row items-center`}
          >
            <MaterialCommunityIcons
              name={
                ticketStatus === "pending"
                  ? "clock-outline"
                  : ticketStatus === "failed"
                    ? "cross-outline"
                    : "check-decagram"
              }
              size={14}
              color={
                ticketStatus === "pending"
                  ? "#a16207"
                  : ticketStatus === "failed"
                    ? "#b91c1c"
                    : "#16a34a"
              }
            />
            <Text
              className={`${ticketStatus === "pending" ? "text-yellow-700" : ticketStatus === "failed" ? "text-red-700" : "text-green-700"} font-dm-sans-bold text-[10px] ml-1 uppercase`}
            >
              {ticketStatus === "completed" ? "Confirmed" : ticketStatus}
            </Text>
          </View>
        </View>

        {event.type === "ai" ? <OfficialTicketItem event={event} /> : null}
      </View>

      {/* HEADER STATUS */}
      <View className="flex-row items-center justify-between mb-6 px-1">
        <View>
          <Text className="font-poppins-bold text-slate-800 text-xl">
            My Journey
          </Text>
          <Text className="font-dm-sans-medium text-blue-500 text-xs">
            Verified Itinerary
          </Text>
        </View>
        <View className="bg-green-100 px-3 py-1 rounded-full flex-row items-center">
          <MaterialCommunityIcons
            name="check-decagram"
            size={14}
            color="#16a34a"
          />
          <Text className="text-green-700 font-dm-sans-bold text-[10px] ml-1 uppercase">
            Confirmed
          </Text>
        </View>
      </View>

      <View className="gap-0">
        {/* FLIGHT SECTION */}
        {flight.offer && flight.status === "confirmed" && (
          <View className="flex-row gap-3 min-h-[100px]">
            <TimelineConnector />
            <View className="flex-1 pb-6">
              <FlightItem data={flight.offer} />
            </View>
          </View>
        )}

        {/* TRANSFER: AIRPORT -> HOTEL */}
        {transfer.airportToHotel?.offer &&
          transfer.airportToHotel.status === "confirmed" && (
            <View className="flex-row gap-3 min-h-[100px]">
              <TimelineConnector />
              <View className="flex-1 pb-6">
                <TransferItem data={transfer.airportToHotel.offer} />
              </View>
            </View>
          )}

        {/* HOTEL SECTION */}
        {hotel.offer && hotel.status === "confirmed" && (
          <View className="flex-row gap-3 min-h-[100px]">
            <TimelineConnector />
            <View className="flex-1 pb-6">
              <HotelItem data={hotel.offer} />
            </View>
          </View>
        )}

        {/* TRANSFER: HOTEL -> EVENT */}
        {transfer.hotelToEvent?.offer &&
          transfer.hotelToEvent.status === "confirmed" && (
            <View className="flex-row gap-3 min-h-[100px]">
              {/* Last dot shouldn't have a trailing line if it's the end */}
              <View className="items-center w-6">
                <LinearGradient
                  colors={["#844AFF", "#C427E0"]}
                  className="w-4 h-4 rounded-full border-2 border-white shadow-md z-10"
                />
                <MaterialCommunityIcons
                  name="flag-checkered"
                  size={12}
                  color="#C427E0"
                  className="mt-1"
                />
              </View>
              <View className="flex-1 pb-6">
                <TransferItem data={transfer.hotelToEvent.offer} />
              </View>
            </View>
          )}
      </View>
    </View>
  );
};

export default EventDetailItinerary;
