import bookingServices from "@/api/services/booking";
import {
  BookingStatusItem,
  Button,
  Spinner,
  TicketBookingStatusItem,
} from "@/components";
import { SimpleContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { useSocket } from "@/components/providers/SocketProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { IBooking } from "@/types/booking";
import { IEvent } from "@/types/event";
import { TTransactionStatus } from "@/types/transaction";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Linking, Text, View } from "react-native";

const BookingStatus = () => {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [event, setEvent] = useState<IEvent | null>(null);
  const [initLoading, setInitLoading] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const { id: bookingId } = useLocalSearchParams();
  const router = useRouter();
  const { socket } = useSocket();
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (!socket) return;

    const bookingPaymentStatus = ({
      bookingId: id,
      status,
    }: {
      bookingId: string;
      status: TTransactionStatus;
    }) => {
      if (id !== bookingId || !booking) return;
      setBooking({ ...booking, paymentStatus: status });
      toast.success(`Payment is ${status}`);
    };

    const bookingFlightStatus = ({
      bookingId,
      result,
      currentTotalAmount,
    }: any) => {
      console.log("booking flight status changed: ", result);
      if (!booking?._id || bookingId !== booking?._id) return;
      setBooking((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          flight: {
            ...prev.flight,
            booking: result,
          },
          price: {
            ...prev.price,
            totalAmount: currentTotalAmount,
          },
        };
      });
    };

    const bookingHotelStatus = ({
      bookingId,
      result,
      currentTotalAmount,
    }: any) => {
      console.log("booking hotel status changed: ", result);
      if (!booking?._id || bookingId !== booking?._id) return;
      setBooking((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          hotel: {
            ...prev.hotel,
            booking: result,
          },
          price: {
            ...prev.price,
            totalAmount: currentTotalAmount,
          },
        };
      });
    };

    const bookingAirportTransferStatus = ({
      bookingId,
      result,
      currentTotalAmount,
    }: any) => {
      console.log("booking airport transfer status changed: ", result);
      if (!booking?._id || bookingId !== booking?._id) return;
      setBooking((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          transfer: {
            ...prev.transfer,
            airportToHotel: {
              ...prev.transfer.airportToHotel,
              booking: result,
            },
          },
          price: {
            ...prev.price,
            totalAmount: currentTotalAmount,
          },
        };
      });
    };

    const bookingEventTransferStatus = ({
      bookingId,
      result,
      currentTotalAmount,
    }: any) => {
      console.log("booking event transfer status changed: ", result);
      if (!booking?._id || bookingId !== booking?._id) return;
      setBooking((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          transfer: {
            ...prev.transfer,
            hotelToEvent: {
              ...prev.transfer.hotelToEvent,
              booking: result,
            },
          },
          price: {
            ...prev.price,
            totalAmount: currentTotalAmount,
          },
        };
      });
    };

    socket.on("booking_payment_status_updated", bookingPaymentStatus);
    socket.on("booking_flight_status_changed", bookingFlightStatus);
    socket.on("booking_hotel_status_changed", bookingHotelStatus);
    socket.on(
      "booking_transfer_airport_status_changed",
      bookingAirportTransferStatus,
    );
    socket.on(
      "booking_transfer_event_status_changed",
      bookingEventTransferStatus,
    );

    return () => {
      socket.off("booking_payment_status_updated", bookingPaymentStatus);
      socket.off("booking_flight_status_changed", bookingFlightStatus);
      socket.off("booking_hotel_status_changed", bookingHotelStatus);
      socket.off(
        "booking_transfer_airport_status_changed",
        bookingAirportTransferStatus,
      );
      socket.off(
        "booking_transfer_event_status_changed",
        bookingEventTransferStatus,
      );
    };
  }, [socket]);

  useEffect(() => {
    const init = async () => {
      if (!bookingId) return;
      setInitLoading(true);
      const response = await bookingServices.get(bookingId as string);
      setBooking(response.data);
      setEvent(response.data?.event || null);
      setInitLoading(false);
    };
    init();
  }, [bookingId]);

  useEffect(() => {
    if (!booking) return;

    const check = (service?: any) => {
      if (!service?.offer) return true;
      return !!service?.booking;
    };

    const allConfirmed =
      check(booking.flight) &&
      check(booking.hotel) &&
      check(booking.transfer?.airportToHotel) &&
      check(booking.transfer?.hotelToEvent) &&
      booking.paymentStatus === "completed";

    setCompleted(allConfirmed);
  }, [booking]);

  if (!booking) return null;

  const handleView = async () => {
    setViewLoading(true);

    // const bodyData: IBooking = {
    //   ...booking,
    //   flight: flight.booking?.status === "failed" ? undefined : (flight as any),
    //   hotel: hotel.booking?.status === "faild" ? undefined : (hotel as any),
    //   transfer: {
    //     airportToHotel:
    //       transfer.airportToHotel?.booking?.status === "faild"
    //         ? undefined
    //         : (transfer.airportToHotel as any),
    //     hotelToEvent:
    //       transfer.hotelToEvent?.booking?.status === "faild"
    //         ? undefined
    //         : (transfer.hotelToEvent as any),
    //   },
    //   status: "confirmed",
    // };

    // console.log(
    //   "body data: ",
    //   bodyData.flight,
    //   bodyData.hotel,
    //   bodyData.transfer,
    // );

    // await updateBooking(bodyData);
    setViewLoading(false);
    router.replace({
      pathname: "/booking/booked",
      params: { id: booking._id },
    });
  };

  const handleBuyTicket = async () => {
    if (!event?.tm?.url || !user?._id) return;

    const url = event.tm.url + `?subId=${user._id}`;
    await Linking.openURL(url);
  };

  const { flight, hotel, transfer, price } = booking;

  const bookingItems = [
    {
      label: "Payment",
      icon: "credit-card-check-outline",
      status:
        booking.paymentStatus === "completed" ? "confirmed" : "processing",
    },
    {
      label: "Ticket",
      icon: "ticket-outline",
      status: booking.ticketStatus,
    },
    flight.offer && {
      label: "Flight",
      icon: "airplane-takeoff",
      status: flight.booking?.status,
    },
    hotel?.offer && {
      label: "Hotel",
      icon: "office-building",
      status: hotel.booking?.status,
    },
    transfer?.airportToHotel?.offer && {
      label: "Airport Transfer",
      icon: "car-wash",
      status: transfer.airportToHotel.status,
    },
    transfer?.hotelToEvent?.offer && {
      label: "Event Transfer",
      icon: "bus-side",
      status: transfer.hotelToEvent.status,
    },
  ].filter(Boolean);

  return (
    <SimpleContainer title="Booking Status" scrolled>
      {initLoading ? (
        <Spinner size="lg" text="Syncing..." />
      ) : (
        <>
          <View className="flex-1">
            {/* Header Summary Card */}
            <View className="shadow-xl shadow-purple-200">
              <LinearGradient
                colors={["#C427E0", "#844AFF", "#12A9FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 32, padding: 24 }}
              >
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="text-white/60 font-dm-sans-medium text-[10px] uppercase tracking-[2px]">
                      Booking Reference
                    </Text>
                    <Text className="text-white font-poppins-bold text-2xl mt-1">
                      #BOK_{booking._id?.slice(0, 8).toUpperCase()}
                    </Text>
                  </View>
                  <View className="bg-white/20 px-3 py-1 rounded-full border border-white/30">
                    <Text className="text-white font-dm-sans-bold text-[10px]">
                      {booking.paymentStatus?.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Glassmorphism Divider */}
                <View className="h-[1px] bg-white/20 my-6" />

                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white/60 font-dm-sans-medium text-xs">
                      Total Investment
                    </Text>
                    <View className="flex-row items-baseline mt-1">
                      <Text className="text-slate-200 font-poppins-bold text-sm">
                        {price.currency}
                      </Text>
                      <Text className="text-white font-poppins-bold text-3xl">
                        {price.totalAmount}
                      </Text>
                    </View>
                  </View>
                  <View className="bg-white rounded-2xl p-3">
                    <MaterialCommunityIcons
                      name="shield-check"
                      size={24}
                      color="#844AFF"
                    />
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Timeline Section */}
            <View className="mt-8 bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm shadow-slate-200">
              <View className="flex-row justify-between items-center mb-8">
                <Text className="font-poppins-bold text-slate-900 text-lg">
                  Timeline
                </Text>
                <View className="bg-slate-50 px-3 py-1 rounded-lg">
                  <Text className="text-slate-500 font-dm-sans-medium text-[10px]">
                    LIVE UPDATES
                  </Text>
                </View>
              </View>

              {bookingItems.map((item, index) =>
                index === 1 ? (
                  <TicketBookingStatusItem
                    key={item.label}
                    label={item.label}
                    status={item.status}
                    isLast={index === bookingItems.length - 1}
                    onPress={handleBuyTicket}
                  />
                ) : (
                  <BookingStatusItem
                    key={item.label + index}
                    label={item.label}
                    icon={item.icon as any}
                    status={item.status}
                    isLast={index === bookingItems.length - 1}
                  />
                ),
              )}
            </View>

            {!completed && (
              <LinearGradient
                colors={["#844AFF15", "#12A9FF15"]}
                start={{ x: 0, y: 0 }}
                style={{
                  marginTop: 24,
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "#844AFF20",
                }}
              >
                <View className="flex-row items-center">
                  <View className="bg-[#844AFF] w-12 h-12 rounded-xl items-center justify-center mr-4 shadow-lg shadow-purple-300">
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={24}
                      color="white"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-poppins-semibold uppercase text-slate-900 text-sm">
                      Important Notice
                    </Text>
                    <Text className="font-dm-sans-bold text-slate-500 text-xs">
                      Stay here until all bookings are confirmed
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            )}

            {completed && booking.ticketStatus === "pending" && (
              <LinearGradient
                colors={["#844AFF15", "#12A9FF15"]}
                start={{ x: 0, y: 0 }}
                style={{
                  marginTop: 24,
                  borderRadius: 20,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: "#844AFF20",
                }}
              >
                <View className="flex-row items-center">
                  <View className="bg-[#844AFF] w-12 h-12 rounded-xl items-center justify-center mr-4 shadow-lg shadow-purple-300">
                    <MaterialCommunityIcons
                      name="ticket-outline"
                      size={24}
                      color="white"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-poppins-semibold uppercase text-slate-900 text-sm">
                      TICKET PURCHASE NOTICE
                    </Text>
                    <Text className="font-dm-sans-bold text-slate-500 text-xs">
                      Ticket purchases aren't available in the app yet. To buy a
                      ticket, please visit the ticket provider's website and
                      complete your purchase there.
                    </Text>
                  </View>
                  {/* <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color="#844AFF"
                /> */}
                </View>
              </LinearGradient>
            )}
          </View>

          {completed && (
            <Button
              type="primary"
              label="View Itinerary"
              icon={
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={16}
                  color="white"
                />
              }
              iconPosition="right"
              buttonClassName="h-12"
              loading={viewLoading}
              onPress={handleView}
            />
          )}
          <View className="h-4"></View>
        </>
      )}
    </SimpleContainer>
  );
};

export default BookingStatus;
