import {
  CommunityTicketItem,
  FlightItem,
  HotelItem,
  OfficialTicketItem,
  TransferItem,
} from "@/components/common";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { IBooking } from "@/types/booking";
import { ICommunityTicket } from "@/types/ticket";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { Linking, Pressable, Text, TouchableOpacity, View } from "react-native";

interface EventDetailItineraryProps {
  booking: IBooking | null;
  communityTicket?: ICommunityTicket;
}

const TripSummary = ({
  services,
  totalPrice,
  currency,
  ticketStatus,
}: {
  services: string[];
  totalPrice: number;
  currency: string;
  ticketStatus: "pending" | "failed" | "completed";
}) => {
  return (
    <View className="w-full mt-4">
      {/* Receipt Top */}
      <View className="bg-slate-50 border-t border-l border-r border-slate-200 rounded-t-[24px] p-6 pb-4">
        <Text className="font-poppins-bold text-slate-400 text-[10px] uppercase tracking-[2px] mb-4">
          Cost Breakdown
        </Text>

        <View className="gap-3">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <View className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <Text className="text-slate-600 font-dm-sans-medium text-sm">
                Ticket
              </Text>
            </View>
            <Text
              className={`font-dm-sans-bold text-[10px] px-2 py-0.5 rounded ${ticketStatus === "pending" ? "text-yellow-600 bg-yellow-50" : "text-emerald-600 bg-emerald-50"}`}
            >
              {ticketStatus === "pending" ? "NEED TO PURCHASE" : "INCLUDED"}
            </Text>
          </View>
          {services.map((service, i) => (
            <View key={i} className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-2">
                <View className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                <Text className="text-slate-600 font-dm-sans-medium text-sm">
                  {service}
                </Text>
              </View>
              <Text className="text-emerald-600 font-dm-sans-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
                INCLUDED
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Punched Hole Divider Line */}
      <View className="flex-row items-center justify-between bg-slate-50 px-[2px]">
        <View className="w-4 h-8 rounded-r-full bg-white border-r border-t border-b border-slate-200 -ml-[1px]" />
        <View className="flex-1 h-[1px] border-b border-dashed border-slate-300 mx-2" />
        <View className="w-4 h-8 rounded-l-full bg-white border-l border-t border-b border-slate-200 -mr-[1px]" />
      </View>

      {/* Receipt Bottom */}
      <View className="bg-slate-50 border-b border-l border-r border-slate-200 rounded-b-[24px] p-6 pt-2">
        <View className="flex-row justify-between items-end mt-2">
          <View>
            <Text className="font-dm-sans-bold text-slate-400 text-[10px] uppercase tracking-widest mb-1">
              Total Paid
            </Text>
            <View className="flex flex-row items-end gap-1 mt-1">
              <Text className="text-lg text-slate-400">
                {currency.toUpperCase()}
              </Text>
              <Text className="font-poppins-bold text-slate-900 text-3xl">
                {totalPrice}
              </Text>
            </View>
          </View>

          <View className="bg-emerald-100 px-3 py-1.5 rounded-xl flex-row items-center gap-1">
            <MaterialCommunityIcons
              name="check-decagram"
              size={12}
              color="#10b981"
            />
            <Text className="text-[10px] font-poppins-bold text-emerald-600 ">
              SECURE PAYMENT
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const EventDetailItinerary: React.FC<EventDetailItineraryProps> = ({
  booking,
  communityTicket,
}) => {
  const { user } = useAuth();
  const toast = useToast();

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

  const selectedServices = [];
  if (booking.flight.offer) selectedServices.push("Round-trip Flight");
  if (booking.hotel.offer) selectedServices.push("Hotel Stay");
  if (booking.transfer.airportToHotel?.offer)
    selectedServices.push("Hotel Transfer");
  if (booking.transfer.hotelToEvent?.offer) {
    selectedServices.push("Event Transfer");
  }

  const copyBookingId = async () => {
    if (!booking?._id) return;

    await Clipboard.setStringAsync(`#BOK_${booking._id.toString()}`);

    toast.success("Booking ID copied");
  };

  const { flight, hotel, transfer, ticketStatus, event, paymentStatus } =
    booking;
  const isCompleted = [
    paymentStatus === "completed",
    !flight.offer || flight.status === "confirmed",
    !hotel.offer || hotel.status === "confirmed",
    !transfer.airportToHotel?.offer ||
      transfer.airportToHotel.status === "confirmed",
    !transfer.hotelToEvent?.offer ||
      transfer.hotelToEvent.status === "confirmed",
  ].every(Boolean);

  const shouldBuyTicket = event.type === "ai";

  const handleBuyTicket = async () => {
    if (!event?.tm?.url || !user?._id) return;

    const url = event.tm.url + `?subId=${user._id}`;
    await Linking.openURL(url);
  };

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
      <View className="mt-6 flex flex-row items-center justify-between">
        <Text className="font-poppins-bold text-slate-800 text-xl">
          BOOKING REF
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          className="px-8 py-3 rounded-2xl shadow-xl bg-slate-200 shadow-slate-200 border border-slate-50 flex flex-row gap-2 items-center"
          onPress={copyBookingId}
        >
          <Text className="font-dm-sans-medium text-slate-400 text-base">
            #BOK_{booking._id?.toString().slice(0, 8).toUpperCase()}
          </Text>

          <MaterialCommunityIcons
            name="clipboard-outline"
            size={18}
            color="#94a3b8"
          />
        </TouchableOpacity>
      </View>

      <View className="mb-6 gap-4 mt-6">
        <View className="flex-row items-center justify-between px-1">
          <View>
            <Text className="font-poppins-bold text-slate-800 text-xl">
              MY TICKET
            </Text>
          </View>
          {shouldBuyTicket ? (
            <Pressable
              onPress={handleBuyTicket}
              className="bg-[#844AFF] px-4 py-2 rounded-full flex-row items-center"
            >
              <MaterialCommunityIcons
                name="open-in-new"
                size={16}
                color="white"
              />
              <Text className="text-white font-dm-sans-bold text-xs ml-1 uppercase">
                Buy Ticket
              </Text>
            </Pressable>
          ) : (
            <View
              className={`${
                ticketStatus === "pending"
                  ? "bg-yellow-100"
                  : ticketStatus === "failed"
                    ? "bg-red-100"
                    : "bg-green-100"
              } px-3 py-1 rounded-full flex-row items-center`}
            >
              <MaterialCommunityIcons
                name={
                  ticketStatus === "pending"
                    ? "clock-outline"
                    : ticketStatus === "failed"
                      ? "close-circle"
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
                className={`${
                  ticketStatus === "pending"
                    ? "text-yellow-700"
                    : ticketStatus === "failed"
                      ? "text-red-700"
                      : "text-green-700"
                } font-dm-sans-bold text-[10px] ml-1 uppercase`}
              >
                {ticketStatus === "completed" ? "Confirmed" : ticketStatus}
              </Text>
            </View>
          )}
        </View>

        {event.type === "ai" ? <OfficialTicketItem event={event} /> : null}
        {event.type === "user" && event.fee?.type === "paid" && (
          <CommunityTicketItem item={communityTicket || null} />
        )}
      </View>

      {/* HEADER STATUS */}
      <View className="flex-row items-center justify-between mb-6 px-1">
        <View>
          <Text className="font-poppins-bold text-slate-800 text-xl">
            MY JOURNEY
          </Text>
          <Text className="font-dm-sans-medium text-blue-500 text-xs">
            Verified Itinerary
          </Text>
        </View>
      </View>

      <View className="gap-0">
        {/* FLIGHT SECTION */}
        {flight.offer && (
          <View className="flex-row gap-3 min-h-[100px]">
            <TimelineConnector />
            <View className="flex-1 pb-6">
              <FlightItem
                data={flight.offer}
                status={flight.status}
                reference={flight.booking?.reference}
              />
            </View>
          </View>
        )}

        {/* TRANSFER: AIRPORT -> HOTEL */}
        {transfer.airportToHotel?.offer && (
          <View className="flex-row gap-3 min-h-[100px]">
            <TimelineConnector />
            <View className="flex-1 pb-6">
              <TransferItem
                data={transfer.airportToHotel.offer}
                status={transfer.airportToHotel.status}
                reference={transfer.airportToHotel.booking?.reference}
              />
            </View>
          </View>
        )}

        {/* HOTEL SECTION */}
        {hotel.offer && (
          <View className="flex-row gap-3 min-h-[100px]">
            <TimelineConnector />
            <View className="flex-1 pb-6">
              <HotelItem
                data={hotel.offer}
                status={hotel.status}
                reference={hotel.booking?.reference}
              />
            </View>
          </View>
        )}

        {/* TRANSFER: HOTEL -> EVENT */}
        {transfer.hotelToEvent?.offer && (
          <View className="flex-row gap-3 min-h-[100px]">
            {/* Last dot shouldn't have a trailing line if it's the end */}
            <View className="items-center w-6">
              <LinearGradient
                colors={["#844AFF", "#C427E0"]}
                className="shadow-md"
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: "white",
                  zIndex: 10,
                }}
              />
              <MaterialCommunityIcons
                name="flag-checkered"
                size={12}
                color="#C427E0"
                className="mt-1"
              />
            </View>
            <View className="flex-1 pb-6">
              <TransferItem
                data={transfer.hotelToEvent.offer}
                status={transfer.hotelToEvent.status}
                reference={transfer.hotelToEvent.booking?.reference}
              />
            </View>
          </View>
        )}
      </View>

      <TripSummary
        totalPrice={booking?.price.totalAmount || 0}
        currency={booking?.price.currency || "EUR"}
        services={selectedServices}
        ticketStatus={booking?.ticketStatus || "pending"}
      />

      {/* If all components are completed, show a celebratory message */}
      {/* {!isCompleted && (
        <Button
          type="gradient-glass"
          label="Finialize Booking"
          buttonClassName="h-12"
          onPress={() => {
            const { paymentStatus } = booking;
            if (paymentStatus !== "completed") {
              router.push({
                pathname: "/booking/checkout",
                params: {
                  eventId: event._id,
                  packageType: booking.packageType,
                },
              });
            } else {
              router.push({
                pathname: "/booking/status",
                params: { id: booking._id },
              });
            }
          }}
        />
      )} */}
    </View>
  );
};

export default EventDetailItinerary;
