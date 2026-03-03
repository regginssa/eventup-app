import bookingServices from "@/api/services/booking";
import { BookingStatusItem } from "@/components";
import { SimpleContainer } from "@/components/organisms/layout";
import { IBooking } from "@/types/booking";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const BookingStatus = () => {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const { id: bookingId } = useLocalSearchParams();

  useEffect(() => {
    console.log("[bookingId]: ");
    const init = async () => {
      if (!bookingId) return;
      const response = await bookingServices.get(bookingId as string);
      setBooking(response.data);
    };
    init();
  }, [bookingId]);

  if (!booking) return null;

  const { flight, hotel, transfer, price } = booking;

  return (
    <SimpleContainer title="Booking Status" scrolled>
      <View className="flex-1 px-4 pt-6">
        {/* Total Card */}
        <View className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-8 flex-row justify-between items-center">
          <View>
            <Text className="font-dm-sans-medium text-gray-400 text-xs">
              Total Amount Paid
            </Text>
            <View className="flex-row items-start">
              <Text className="font-poppins-bold text-2xl text-gray-800">
                $
              </Text>
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
      </View>
    </SimpleContainer>
  );
};

export default BookingStatus;
