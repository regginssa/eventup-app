import bookingServices from "@/api/services/booking";
import {
  Button,
  CommunityTicketItem,
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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useRef, useState } from "react";
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
  const [items, setItems] = useState<any[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    if (!event) return;

    let items = [
      {
        label: event.name,
        icon: "calendar-badge-outline",
      },
      {
        label: `${event.dates?.start.time} / ${formatDateTime(
          event.dates?.start.date as string,
        )} (${event.dates?.timezone ?? "--"})`,
        icon: "calendar-clock-outline",
      },
      {
        label: event.location?.city
          ? `${event.location.city.name}, ${event.location.country.code}`
          : event.location?.country.name,
        icon: "map-marker-outline",
      },
      {
        label:
          packageType === "standard"
            ? "Economy (Standard Package)"
            : "VIP (Gold Package)",
        icon: "check-decagram-outline",
      },
    ];

    if (packageType === "gold") {
      items.push({
        label: "VIP Lane - Zone A",
        icon: "shield-airplane-outline",
      });
    }

    setItems(items);
  }, [event]);

  return (
    <View
      className={`w-full ${
        theme === "light" ? "bg-white" : "bg-[#171C1C]"
      } rounded-xl p-4 gap-3 overflow-hidden`}
    >
      <View className="flex-row items-center mb-3">
        <Text className="font-poppins-semibold text-gray-800 text-sm uppercase tracking-wider">
          Event Ticket
        </Text>
      </View>

      {event?.type === "user" && communityTicket ? (
        <CommunityTicketItem item={communityTicket} />
      ) : (
        <View className="w-full flex flex-row gap-3">
          <TicketQR size={120} />

          <View className="flex-1 items-start justify-between gap-1">
            {items.map((item, index) => (
              <View key={index} className="flex flex-row items-start gap-1.5">
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={16}
                  color={theme === "light" ? "#4b5563" : "#9ca3af"}
                />
                <Text
                  className={`font-dm-sans text-sm ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  } line-clamp-3`}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
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
    <View className="bg-white rounded-xl p-4 border border-slate-200">
      <View className="flex-row items-center mb-3">
        <Text className="font-poppins-semibold text-gray-800 text-sm uppercase tracking-wider">
          Trip Summary
        </Text>
      </View>

      <View className="gap-3 mt-2">
        {services.map((service: string, i: number) => (
          <View key={i} className="flex-row justify-between items-center">
            <Text className="text-slate-500 font-dm-sans text-sm">
              {service}
            </Text>
            <View className="h-[1px] flex-1 bg-slate-200 mx-3 italic opacity-50" />
            <Text className="text-slate-400 text-xs font-dm-sans">
              Included
            </Text>
          </View>
        ))}

        <View className="h-[1px] bg-slate-200 w-full my-2" />

        <View className="flex-row justify-between items-center mt-4">
          <Text className="font-poppins-bold text-slate-900 text-base">
            Total Amount
          </Text>
          <View className="flex flex-row items-start">
            <Text className="font-poppins-semibold text-green-600 text-sm">
              $
            </Text>
            <Text className="font-poppins-bold text-green-600 text-2xl">
              {totalPrice}
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
  const [communityTicket, setCommunityTicket] =
    useState<ICommunityTicket | null>(null);
  const lottieRef = useRef<LottieView>(null);

  const { id: bookingId } = useLocalSearchParams();

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
        if (booking.flight.offer) selectedServices.push("Flight");
        if (booking.hotel.offer) selectedServices.push("Hotel");
        setServices(selectedServices);
        setHasLoadedSuccessfully(true);
      } catch (error: any) {
        setHasLoadedSuccessfully(false);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [bookingId]);

  return (
    <SimpleContainer title="Booking Confirmation" scrolled>
      {loading ? (
        <Spinner size="md" />
      ) : (
        <>
          <View className="flex-1 gap-4">
            <View className="relative w-[381px] h-[221px]">
              <Image
                source={BookedLightImage}
                alt="Booking "
                contentFit="cover"
                style={styles.image}
              />
              {hasLoadedSuccessfully && (
                <LottieView
                  ref={lottieRef}
                  autoPlay
                  source={require("@/assets/animations/cong.json")}
                  loop={false}
                  style={styles.lottie}
                />
              )}
            </View>

            <EventTicket
              event={event}
              packageType={booking?.packageType || "standard"}
              communityTicket={communityTicket}
            />

            <View className="h-1"></View>

            <FlightItem data={booking?.flight.offer || null} />
            <HotelItem data={booking?.hotel.offer || null} />
            <TransferItem
              data={booking?.transfer.airportToHotel?.offer || null}
            />
            <TransferItem
              data={booking?.transfer.hotelToEvent?.offer || null}
            />

            <TripSummary
              totalPrice={booking?.price.totalAmount || 0}
              currency={booking?.price.currency || "USD"}
              services={services}
            />
          </View>

          <View className="w-full gap-4">
            <Button
              type="primary"
              label="Download Itinerary"
              buttonClassName="h-12"
            />
            <Button
              type="primary"
              label="Share with Friends"
              buttonClassName="h-12"
            />
          </View>
        </>
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
