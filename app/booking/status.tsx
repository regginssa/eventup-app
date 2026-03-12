import bookingServices from "@/api/services/booking";
import { BookingStatusItem, Button, Spinner } from "@/components";
import { SimpleContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { useFlight } from "@/components/providers/FlightProvider";
import { useHotel } from "@/components/providers/HotelProvider";
import { useSocket } from "@/components/providers/SocketProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { useTransfer } from "@/components/providers/TransferProvider";
import { IBooking } from "@/types/booking";
import { IEvent } from "@/types/event";
import { TTransactionStatus } from "@/types/transaction";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

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
  const { book: bookFlight } = useFlight();
  const { book: bookHotel } = useHotel();
  const { book: bookTransfer } = useTransfer();
  const toast = useToast();
  const flightBookingRef = useRef(false);
  const hotelBookingRef = useRef(false);
  const transferBookingRef = useRef(false);

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

    socket.on("booking_payment_status_updated", bookingPaymentStatus);

    return () => {
      socket.off("booking_payment_status_updated", bookingPaymentStatus);
    };
  }, [socket, booking]);

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
  //
  // ✈️ Flight Booking
  //
  useEffect(() => {
    if (booking?.paymentStatus !== "completed") return;

    const handleFlight = async () => {
      if (
        flightBookingRef.current ||
        !booking?.flight?.offer ||
        !user ||
        booking.flight.status === "confirmed"
      )
        return;

      flightBookingRef.current = true;

      const result = await bookFlight(booking.flight.offer);

      if (!result.orderId) {
        flightBookingRef.current = false;
        return toast.error(result.message);
      }

      const bookingBodyData: IBooking = {
        ...booking,
        flight: {
          ...booking.flight,
          booking: result,
          status: "confirmed",
        },
      };

      await updateBooking(bookingBodyData);
    };

    handleFlight();
  }, [booking?.flight?.status, booking?.paymentStatus, user]);

  //
  // 🏨 Hotel Booking
  //
  useEffect(() => {
    if (booking?.paymentStatus !== "completed") return;

    const handleHotel = async () => {
      if (
        hotelBookingRef.current ||
        !booking?.hotel?.offer ||
        !user ||
        booking.hotel.status === "confirmed"
      )
        return;

      hotelBookingRef.current = true;

      const result = await bookHotel(booking.hotel.offer.id);

      if (result.status !== "confirmed") {
        hotelBookingRef.current = false;
        return toast.error(result.message);
      }

      const bookingBodyData: IBooking = {
        ...booking,
        hotel: {
          ...booking.hotel,
          booking: result,
          status: result.status,
        },
      };

      await updateBooking(bookingBodyData);
    };

    handleHotel();
  }, [booking?.hotel?.status, booking?.paymentStatus, user]);

  //
  // 🚗 Transfer Booking
  //
  useEffect(() => {
    if (booking?.paymentStatus !== "completed") return;

    const handleTransfer = async () => {
      if (
        transferBookingRef.current ||
        !booking?.transfer ||
        !event?.location ||
        !user
      )
        return;

      transferBookingRef.current = true;

      const { airportToHotel, hotelToEvent } = booking.transfer;

      //
      // Airport → Hotel
      //
      if (
        airportToHotel?.offer &&
        airportToHotel.status !== "confirmed" &&
        booking.flight?.offer &&
        booking.hotel?.offer
      ) {
        const flightOffer = booking.flight.offer;
        const hotelOffer = booking.hotel.offer;
        const transferOffer = airportToHotel.offer;

        const body = {
          quoteId: transferOffer.id,
          offerHash: transferOffer.offerHash,
          passenger: {
            title: user.gender,
            firstName: user.firstName,
            lastName: user.lastName,
            countryCode: user.location.country.code,
            email: user.email,
            phone: user.phone,
          },
          offer: transferOffer,
          outward: {
            flight: {
              airline_code: flightOffer.airlineName,
              flight_number:
                flightOffer.flightNumbers[flightOffer.flightNumbers.length - 1],
              airport_code: flightOffer.destinationIata,
              flight_date_time: flightOffer.arrivalTime,
            },
          },
          destination: {
            accommodation: {
              name: hotelOffer.name,
              address: hotelOffer.address,
            },
          },
        };

        const result = await bookTransfer(body);

        if (result.status !== "confirmed") {
          transferBookingRef.current = false;
          return toast.error(result.message);
        }

        await updateBooking({
          ...booking,
          transfer: {
            ...booking.transfer,
            airportToHotel: {
              ...booking.transfer.airportToHotel,
              booking: result,
              status: "confirmed",
            },
          },
        });
      }

      //
      // Hotel → Event
      //
      if (
        hotelToEvent?.offer &&
        hotelToEvent.status !== "confirmed" &&
        booking.hotel?.offer &&
        booking.event
      ) {
        const hotelOffer = booking.hotel.offer;
        const transferOffer = hotelToEvent.offer;
        const eventData = booking.event;

        const body = {
          quoteId: transferOffer.id,
          offerHash: transferOffer.offerHash,
          passenger: {
            title: user.gender,
            firstName: user.firstName,
            lastName: user.lastName,
            countryCode: user.location.country.code,
            email: user.email,
            phone: user.phone,
          },
          offer: transferOffer,
          outward: {
            accommodation: {
              name: hotelOffer.name,
              address: hotelOffer.address,
              pickup_date_time: transferOffer.pickupDateTime,
            },
          },
          destination: {
            accommodation: {
              name: eventData.name,
              address: eventData.location?.address,
            },
          },
        };

        const result = await bookTransfer(body);

        if (result.status !== "confirmed") {
          transferBookingRef.current = false;
          return toast.error(result.message);
        }

        await updateBooking({
          ...booking,
          transfer: {
            ...booking.transfer,
            hotelToEvent: {
              ...booking.transfer.hotelToEvent,
              booking: result,
              status: "confirmed",
            },
          },
        });
      }
    };

    handleTransfer();
  }, [booking?.transfer, booking?.paymentStatus, user, event]);

  useEffect(() => {
    if (!booking) return;

    const check = (service?: { offer?: any; status?: string }) => {
      if (!service?.offer) return true;
      return service.status === "confirmed";
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

  const { flight, hotel, transfer, price } = booking;

  const updateBooking = async (body: IBooking) => {
    const response = await bookingServices.update(body._id as string, body);
    if (!response.data) return;
    setBooking(response.data);
  };

  const handleView = async () => {
    setViewLoading(true);
    await updateBooking({ ...booking, status: "confirmed" });
    setViewLoading(false);
    router.replace({
      pathname: "/booking/booked",
      params: { id: booking._id },
    });
  };

  const handleBuyTicket = async () => {
    if (!event?.tm?.url || !user?._id) return;

    const url = event.tm.url + `?subId=${user._id}`;
    await WebBrowser.openBrowserAsync(url);
  };

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
      status: flight.status,
    },
    hotel?.offer && {
      label: "Hotel",
      icon: "office-building",
      status: hotel.status,
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
                      <Text className="text-white font-poppins-bold text-3xl">
                        ${price.totalAmount}
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

              {bookingItems.map((item, index) => (
                <BookingStatusItem
                  key={item.label}
                  label={item.label}
                  icon={item.icon as any}
                  status={item.status}
                  isLast={index === bookingItems.length - 1}
                />
              ))}
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

          {booking.ticketStatus === "pending" && (
            <Button
              type="gradient-glass"
              label="Buy Ticket"
              icon={
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={16}
                  color="white"
                />
              }
              iconPosition="right"
              buttonClassName="h-12"
              onPress={handleBuyTicket}
            />
          )}

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
