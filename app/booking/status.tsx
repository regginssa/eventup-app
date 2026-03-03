import bookingServices from "@/api/services/booking";
import { BookingStatusItem, Spinner } from "@/components";
import { SimpleContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { useFlight } from "@/components/providers/FlightProvider";
import { useSocket } from "@/components/providers/SocketProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { IBooking } from "@/types/booking";
import { IFlightBookingResponse } from "@/types/flight";
import { TTransactionStatus } from "@/types/transaction";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const BookingStatus = () => {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [initLoading, setInitLoading] = useState<boolean>(false);
  const { id: bookingId } = useLocalSearchParams();
  const { socket } = useSocket();
  const { user } = useAuth();
  const { book: bookFlight } = useFlight();
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
      setInitLoading(false);
    };
    init();
  }, [bookingId]);

  useEffect(() => {
    const handleFlight = async (): Promise<
      IFlightBookingResponse | undefined
    > => {
      if (
        !booking ||
        !booking.flight.offer ||
        !user ||
        booking.flight.status === "confirmed"
      )
        return;

      const offer = booking.flight.offer;

      if (!offer || offer.passengerIds.length === 0 || !offer.totalAmount)
        return;

      const bodyData = {
        offerId: offer.id,
        passengers: [
          {
            id: offer.passengerIds[0],
            type: "adult",
            given_name: "Amelia", // user.firstName
            family_name: "Earhart", // user.lastName
            gender: "f", // user.gener (mr or ms)
            born_on: "1997-07-24", // user.birthday
            email: user.email,
            phone_number: "+442080160509", // user.phone
            title: "ms", // user.gender
          },
        ],
        totalAmount: Number(offer.totalAmount),
        currency: offer.currency,
      };

      const bookingData = await bookFlight(bodyData);
      setBooking({
        ...booking,
        flight: {
          ...booking.flight,
          booking: bookingData,
          status: bookingData.status,
        },
      });
      console.log("[flight booking response data]: ", bookingData);
    };
    handleFlight();
  }, [booking]);

  if (!booking) return null;

  const { flight, hotel, transfer, price } = booking;

  return (
    <SimpleContainer title="Booking Status" scrolled>
      {initLoading ? (
        <Spinner size="md" text="Loading Booking..." />
      ) : (
        <>
          {/* Total Card */}
          <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex-row justify-between items-center">
            <View>
              <Text className="font-dm-sans-medium text-gray-400 text-xs">
                Total Amount Paid
              </Text>
              <View className="flex-row items-start">
                <Text className="font-poppins-bold text-sm text-gray-600"></Text>
                <Text className="font-poppins-bold text-3xl text-green-600 ml-1">
                  {price.totalAmount}
                </Text>
              </View>
            </View>
            <View className="bg-green-100 px-3 py-1 rounded-full">
              <Text className="text-green-700 font-dm-sans-bold text-[10px]">
                SECURE
              </Text>
            </View>
          </View>

          {/* Progress List */}
          <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <Text className="font-poppins-semibold text-gray-800 mb-6">
              Reservation Progress
            </Text>

            <BookingStatusItem
              label="Payment"
              icon="credit-card-outline"
              status={
                booking.paymentStatus === "completed"
                  ? "confirmed"
                  : "processing"
              }
              value={booking._id}
            />

            <BookingStatusItem
              label="Flight"
              icon="airplane"
              status={flight?.status}
              value={flight?.offer?.id}
            />

            <BookingStatusItem
              label="Hotel"
              icon="office-building"
              status={hotel?.status}
              value={hotel?.offer?.id}
            />

            <BookingStatusItem
              label="Airport Transfer"
              icon="car"
              status={transfer?.airportToHotel?.status}
              value={transfer?.airportToHotel?.offer?.id}
            />

            <BookingStatusItem
              label="Event Transfer"
              icon="bus-clock"
              status={transfer?.hotelToEvent.status}
              value={transfer?.airportToHotel?.offer?.id}
            />
          </View>

          {/* Support Footer */}
          <View className="mt-8 items-center">
            <Text className="font-dm-sans-medium text-gray-400 text-xs">
              Ref ID: #BOK_{booking._id?.slice(0, 8).toUpperCase()}
            </Text>
          </View>
        </>
      )}
    </SimpleContainer>
  );
};

export default BookingStatus;
