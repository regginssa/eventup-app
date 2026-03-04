import bookingServices from "@/api/services/booking";
import {
  Button,
  FlightItem,
  HotelItem,
  Spinner,
  TicketQR,
  TransferItem,
} from "@/components/common";
import { SimpleContainer } from "@/components/organisms/layout";
import { useTheme } from "@/components/providers/ThemeProvider";
import { TPackageType } from "@/types";
import { IBooking } from "@/types/booking";
import { IEvent } from "@/types/event";
import { ICommunityTicket } from "@/types/ticket";
import { formatDateTime } from "@/utils/format";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const BookedLightImage = require("@/assets/images/booked_image.png");

const EventTicket = ({
  event,
  packageType,
  communityTicket,
}: {
  event: IEvent | null;
  packageType: TPackageType;
  communityTicket: ICommunityTicket | null;
}) => {
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <View
      className={`w-full ${isLight ? "bg-white" : "bg-slate-900"} rounded-[24px] overflow-hidden border border-slate-100 shadow-sm`}
    >
      <LinearGradient
        colors={
          packageType === "gold"
            ? ["#FACC1520", "transparent"]
            : ["#844AFF10", "transparent"]
        }
        className="p-5"
      >
        <View className="flex-row justify-between items-center mb-4">
          <View className="bg-slate-100 px-3 py-1 rounded-full">
            <Text className="text-[10px] font-poppins-bold text-slate-500 uppercase tracking-tighter">
              Confirmed Admission
            </Text>
          </View>
          {packageType === "gold" && (
            <View className="flex-row items-center bg-yellow-400 px-2 py-1 rounded-md">
              <MaterialCommunityIcons name="crown" size={12} color="white" />
              <Text className="text-[10px] font-poppins-bold text-white ml-1">
                GOLD VIP
              </Text>
            </View>
          )}
        </View>

        <View className="flex-row gap-4">
          <View className="bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
            <TicketQR size={90} />
          </View>

          <View className="flex-1 justify-center">
            <Text
              className="font-poppins-bold text-slate-800 text-lg leading-6 mb-1"
              numberOfLines={2}
            >
              {event?.name}
            </Text>
            <View className="flex-row items-center mb-1">
              <Feather name="calendar" size={12} color="#844AFF" />
              <Text className="font-dm-sans-medium text-slate-500 text-xs ml-1">
                {formatDateTime(event?.dates?.start.date as string)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="map-pin" size={12} color="#844AFF" />
              <Text
                className="font-dm-sans-medium text-slate-500 text-xs ml-1"
                numberOfLines={1}
              >
                {event?.location?.city?.name || event?.location?.country?.name}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const TripSummary = ({
  services,
  totalPrice,
  currency,
}: {
  services: string[];
  totalPrice: number;
  currency: string;
}) => {
  return (
    <View className="w-full mt-4">
      {/* Receipt Top */}
      <View className="bg-slate-50 border-t border-l border-r border-slate-200 rounded-t-[24px] p-6 pb-4">
        <Text className="font-poppins-bold text-slate-400 text-[10px] uppercase tracking-[2px] mb-4">
          Cost Breakdown
        </Text>

        <View className="gap-3">
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
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <View className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <Text className="text-slate-600 font-dm-sans-medium text-sm">
                Event Admission
              </Text>
            </View>
            <Text className="text-emerald-600 font-dm-sans-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded">
              INCLUDED
            </Text>
          </View>
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
              <Text className="text-lg text-slate-400">$</Text>
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
        if (booking.hotel.offer) selectedServices.push("Luxury Hotel Stay");
        if (booking.transfer.airportToHotel?.offer)
          selectedServices.push("Airport Transfer");

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
    <SimpleContainer title="Confirmation" scrolled>
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
                Itinerary #BOK_{bookingId?.toString().slice(-6).toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Ticket Section */}
          <EventTicket
            event={event}
            packageType={booking?.packageType || "standard"}
            communityTicket={null}
          />

          {/* Itinerary Details */}
          <View className="mt-8 gap-4">
            <Text className="font-poppins-bold text-slate-800 text-sm ml-1 uppercase tracking-widest">
              Your Itinerary
            </Text>
            <FlightItem data={booking?.flight.offer || null} />
            <HotelItem data={booking?.hotel.offer || null} />
            <TransferItem
              data={booking?.transfer.airportToHotel?.offer || null}
            />
            <TransferItem
              data={booking?.transfer.hotelToEvent?.offer || null}
            />
          </View>

          {/* Trip Summary Section */}
          <TripSummary
            totalPrice={booking?.price.totalAmount || 0}
            currency={booking?.price.currency || "USD"}
            services={services}
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
