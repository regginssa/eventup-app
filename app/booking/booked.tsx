import bookingServices from "@/api/services/booking";
import {
  Button,
  FlightItem,
  HotelItem,
  OfficialTicketItem,
  Spinner,
  TransferItem,
} from "@/components/common";
import { SimpleContainer } from "@/components/organisms/layout";
import { IBooking } from "@/types/booking";
import { IEvent } from "@/types/event";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const BookedLightImage = require("@/assets/images/booked_image.png");

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
            <Text className="font-poppins-bold text-slate-900 text-3xl">
              <Text className="text-lg text-slate-400">{currency}</Text>
              {totalPrice}
            </Text>
          </View>
          <View className="items-end">
            <MaterialCommunityIcons
              name="check-decagram"
              size={24}
              color="#10b981"
            />
            <Text className="text-[10px] font-dm-sans-bold text-emerald-600 mt-1">
              SECURE PAYMENT
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const BookedScreen = () => {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasLoadedSuccessfully, setHasLoadedSuccessfully] =
    useState<boolean>(false);

  const { id: bookingId } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      if (!bookingId) return;
      try {
        setLoading(true);
        const bookingRes = await bookingServices.get(bookingId as string);
        const booking = bookingRes.data;
        setBooking(booking);
        setEvent(booking.event);

        const selectedServices = [];
        if (booking.flight.offer) selectedServices.push("Round-trip Flight");
        if (booking.hotel.offer) selectedServices.push("Hotel Stay");
        if (booking.transfer.airportToHotel?.offer)
          selectedServices.push("Hotel Transfer");
        if (booking.transfer.hotelToEvent?.offer) {
          selectedServices.push("Event Transfer");
        }

        setServices(selectedServices);
        setHasLoadedSuccessfully(true);
      } catch (error) {
        setHasLoadedSuccessfully(false);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [bookingId]);

  return (
    <SimpleContainer title="Confirmation" scrolled hiddenBack>
      {loading ? (
        <Spinner size="md" />
      ) : (
        <View className="flex-1 px-1">
          {/* Header Animation Section */}
          <View className="items-center justify-center mb-6">
            <View className="w-full h-48 rounded-[32px] overflow-hidden">
              <Image
                source={BookedLightImage}
                style={styles.image}
                contentFit="cover"
              />
              {hasLoadedSuccessfully && (
                <LottieView
                  autoPlay
                  source={require("@/assets/animations/cong.json")}
                  loop={false}
                  style={styles.lottie}
                />
              )}
            </View>
            <View className="bg-white -mt-8 px-8 py-3 rounded-2xl shadow-xl shadow-slate-200 border border-slate-50 items-center">
              <Text className="font-poppins-bold text-slate-800 text-lg">
                Booking Confirmed!
              </Text>
              <Text className="font-dm-sans-medium text-slate-400 text-xs">
                Itinerary #BOK_{bookingId?.toString().slice(0, 8).toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Ticket Section */}
          {event?.type === "ai" ? <OfficialTicketItem event={event} /> : null}

          {/* Itinerary Details */}
          <View className="mt-8 gap-4">
            <Text className="font-poppins-bold text-slate-800 text-sm ml-1 uppercase tracking-widest">
              Your Itinerary
            </Text>
            <FlightItem
              data={booking?.flight.offer || null}
              reference={booking?.flight?.booking?.bookingReference}
            />
            <HotelItem
              data={booking?.hotel.offer || null}
              reference={booking?.hotel?.booking?.reference}
            />
            <TransferItem
              data={booking?.transfer.airportToHotel?.offer || null}
              reference={booking?.transfer.airportToHotel.booking?.reference}
            />
            <TransferItem
              data={booking?.transfer.hotelToEvent?.offer || null}
              reference={booking?.transfer.hotelToEvent.booking?.reference}
            />
          </View>

          {/* Trip Summary Section */}
          <TripSummary
            totalPrice={booking?.price.totalAmount || 0}
            currency={booking?.price.currency || "USD"}
            services={services}
            ticketStatus={booking?.ticketStatus || "pending"}
          />

          {/* Actions */}
          <View className="my-10 gap-4">
            {/* <Button
              type="primary"
              label="Download Itinerary PDF"
              buttonClassName="h-14 rounded-2xl"
              icon={<Feather name="download" size={18} color="white" />}
              iconPosition="right"
            /> */}
            <Button
              type="gradient-soft"
              label="Return to Event"
              buttonClassName="h-14 rounded-2xl"
              onPress={() => {
                if (!event?._id) return;
                router.replace({
                  pathname: `/event/details/${event.type}` as any,
                  params: { id: event._id },
                });
              }}
            />
          </View>
        </View>
      )}
    </SimpleContainer>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  lottie: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});

export default BookedScreen;
