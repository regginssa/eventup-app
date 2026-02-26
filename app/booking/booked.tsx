import { fetchBooking } from "@/api/services/booking";
import eventServices from "@/api/services/event";
import { Button, Spinner, TicketQR, UserTicketItem } from "@/components/common";
import { BookedContainer } from "@/components/organisms";
import { useTheme } from "@/components/providers/ThemeProvider";
import { TCurrency, TPackageType } from "@/types";
import {
  IBooking,
  TBookingFlight,
  TBookingHotel,
  TBookingTransfer,
} from "@/types/booking";
import { IEvent } from "@/types/event";
import { ITicket } from "@/types/ticket";
import { formatDateTime, getCurrencySymbol } from "@/utils/format";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const BookedLightImage = require("@/assets/images/booked_image.png");
const BookedDarkImage = require("@/assets/images/booked_image_dark.png");

const EventTicket = ({
  event,
  packageType,
  userTicket,
}: {
  event: IEvent | null;
  packageType: TPackageType;
  userTicket: ITicket | null;
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
      <Text
        className={`font-poppins-semibold ${
          theme === "light" ? "text-gray-700" : "text-gray-200"
        }`}
      >
        Event Ticket
      </Text>

      {event?.type === "user" && userTicket ? (
        <UserTicketItem item={userTicket} />
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

const FlightDetails = ({
  flight,
  packageType,
}: {
  flight: TBookingFlight | undefined;
  packageType: TPackageType;
}) => {
  const { theme } = useTheme();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!flight) return;

    const departure = flight.itineraries[0].segments[0].departure;
    const arrival =
      flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1]
        .arrival;

    const items = [
      {
        label: `Airline: ${flight.validatingAirline}`,
        icon: (
          <MaterialIcons
            name="airlines"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: `Departure: ${departure.airport} - ${
          departure.datetime.split("T")[1]
        } / ${formatDateTime(departure.datetime.split("T")[0] as string)}`,
        icon: (
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: `Arrival: ${arrival.airport} - ${
          arrival.datetime.split("T")[1]
        } / ${formatDateTime(arrival.datetime as string)}`,
        icon: (
          <MaterialCommunityIcons
            name="airplane-landing"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: `Class: ${packageType === "standard" ? "Economy/Standard" : "VIP/Gold"}`,
        icon: (
          <MaterialIcons
            name="flight-class"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: `PNR / Record Locator: ${flight.associatedRecord.reference}`,
        icon: (
          <MaterialIcons
            name="event-seat"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
    ];

    setItems(items);
  }, [flight]);

  return (
    <View
      className={`w-full ${
        theme === "light" ? "bg-white" : "bg-[#171C1C]"
      } rounded-xl p-4 gap-3 overflow-hidden`}
    >
      {!flight ? (
        <View className="w-full flex flex-col items-center justify-center gap-2">
          <MaterialCommunityIcons
            name="airplane-off"
            size={24}
            color="#4b5563"
          />
          <Text className="font-poppins-semibold text-gray-600">No flight</Text>
        </View>
      ) : (
        <>
          <Text
            className={`font-poppins-semibold ${
              theme === "light" ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Flight Details
          </Text>

          <View className="w-full flex flex-col items-start gap-2">
            {items.map((item, index) => (
              <View key={index} className="flex flex-row items-start gap-1.5">
                {item.icon}
                <Text
                  className={`font-dm-sans text-sm ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  } line-clamp-2`}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const HotelDetails = ({ hotel }: { hotel: TBookingHotel | undefined }) => {
  const { theme } = useTheme();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!hotel) return;

    const items = [
      {
        label: `Hotel: ${hotel.hotel.name}`,
        icon: (
          <MaterialIcons
            name="hotel"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: `Check-in: ${formatDateTime(hotel.checkIn as string)}`,
        icon: (
          <MaterialCommunityIcons
            name="clock"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: `Check-out: ${formatDateTime(hotel.checkOut as string)}`,
        icon: (
          <MaterialCommunityIcons
            name="clock"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: `Room: ${
          hotel.rooms.map((room) => room.roomType).join(" / ") || "-"
        }`,
        icon: (
          <MaterialIcons
            name="bed"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: `Confirmation Number: ${hotel.rooms
          .map((room) => room.confirmationNumber)
          .join(", ")}`,
        icon: (
          <MaterialCommunityIcons
            name="ticket-confirmation-outline"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
    ];

    setItems(items);
  }, [hotel]);

  return (
    <View
      className={`w-full ${
        theme === "light" ? "bg-white" : "bg-[#171C1C]"
      } rounded-xl p-4 gap-3 overflow-hidden`}
    >
      {items.length > 0 ? (
        <>
          <Text
            className={`font-poppins-semibold ${
              theme === "light" ? "text-gray-700" : "text-gray-200"
            }`}
          >
            Hotel Details
          </Text>

          <View className="w-full flex flex-col items-start gap-2 overflow-hidden">
            {items.map((item, index) => (
              <View key={index} className="flex flex-row items-start gap-1.5">
                {item.icon}
                <Text
                  className={`font-dm-sans text-sm ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  } line-clamp-2`}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </>
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
    </View>
  );
};

const TrasferDetails = ({
  transfer,
  title,
}: {
  transfer: TBookingTransfer | undefined;
  title: string;
}) => {
  const { theme } = useTheme();

  if (!transfer)
    return (
      <View
        className={`w-full ${
          theme === "light" ? "bg-white" : "bg-[#171C1C]"
        } rounded-xl p-4 gap-3 overflow-hidden`}
      >
        <View className="w-full flex flex-col items-center justify-center gap-2">
          <MaterialCommunityIcons name="car-off" size={24} color="#4b5563" />
          <Text className="font-poppins-semibold text-gray-600">
            No {title}
          </Text>
        </View>
      </View>
    );

  const driver = transfer.provider.name;
  const car = transfer.vehicle.description;
  const pickup = transfer.start.locationCode;
  const destination = transfer.end.address?.line;
  const contact = transfer.provider.contacts?.phoneNumber;

  const items = [
    {
      label: `Driver: ${driver}`,
      icon: (
        <MaterialCommunityIcons
          name="account"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: `Car: ${car}`,
      icon: (
        <MaterialIcons
          name="directions-car"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: `Pickup from: ${pickup} to: ${destination ?? "-"}`,
      icon: (
        <MaterialIcons
          name="luggage"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: `Contact: ${contact}`,
      icon: (
        <MaterialIcons
          name="phone-in-talk"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: `Confirmation Number: ${transfer.confirmationNumber}`,
      icon: (
        <MaterialIcons
          name="event-seat"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
  ];

  return (
    <View
      className={`w-full ${
        theme === "light" ? "bg-white" : "bg-[#171C1C]"
      } rounded-xl p-4 gap-3 overflow-hidden`}
    >
      <Text
        className={`font-poppins-semibold ${
          theme === "light" ? "text-gray-700" : "text-gray-200"
        }`}
      >
        {title}
      </Text>

      <View className="w-full flex flex-col items-start gap-2">
        {items.map((item, index) => (
          <View key={index} className="flex flex-row items-start gap-1.5">
            {item.icon}
            <Text
              className={`font-dm-sans text-sm ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              } line-clamp-2`}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const TripSummary = ({
  services,
  totalPrice,
  basePrice,
  comissionPrice,
  currency,
}: {
  services: string[];
  totalPrice: number;
  basePrice: number;
  comissionPrice: number;
  currency: TCurrency;
}) => {
  const { theme } = useTheme();
  const currencySymbol = getCurrencySymbol(currency as any);

  return (
    <View
      className={`w-full ${
        theme === "light" ? "bg-white" : "bg-[#171C1C]"
      } rounded-xl p-4 gap-3 overflow-hidden`}
    >
      <View className="w-full flex flex-row items-center justify-between">
        <Text
          className={`font-poppins-semibold ${
            theme === "light" ? "text-gray-700" : "text-gray-200"
          }`}
        >
          Trip Summary
        </Text>
        <Text className="font-poppins-semibold text-green-500">Confirmed</Text>
      </View>

      <View className="w-full gap-2">
        <View className="w-full flex flex-row items-start justify-between">
          <View className="grid grid-cols-1 gap-2">
            {services.map((service, index) => (
              <View key={index} className="flex flex-row items-center gap-1">
                <View className="w-2 h-2 rounded-full bg-gray-400"></View>
                <Text
                  className={`font-dm-sans ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {service}
                </Text>
              </View>
            ))}
          </View>
          <Text
            className={`font-poppins-medium text-lg ${
              theme === "light" ? "text-gray-500" : "text-gray-200"
            }`}
          >
            {currencySymbol}
            {basePrice}
          </Text>
        </View>

        <View className="w-full flex flex-row items-start gap-6">
          <View className="flex-1 flex-row items-center gap-4">
            <View className="flex flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-gray-400"></View>
              <Text
                className={`font-dm-sans ${
                  theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Charlie commission
              </Text>
            </View>
          </View>
          <Text
            className={`font-poppins-medium text-lg ${
              theme === "light" ? "text-gray-500" : "text-gray-200"
            }`}
          >
            {currencySymbol}
            {comissionPrice}
          </Text>
        </View>
      </View>

      <View
        className={`w-full h-[1px] ${
          theme === "light" ? "bg-gray-200" : "bg-gray-700"
        }`}
      ></View>

      <View className="w-full flex flex-row items-center justify-between">
        <Text
          className={`font-poppins-semibold text-lg ${
            theme === "light" ? "text-gray-700" : "text-gray-200"
          }`}
        >
          Total
        </Text>

        <Text
          className={`font-poppins-semibold text-lg ${
            theme === "light" ? "text-gray-700" : "text-gray-200"
          }`}
        >
          {currencySymbol}
          {totalPrice}
        </Text>
      </View>
    </View>
  );
};

const BookedScreen = () => {
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [commissionPrice, setCommissionPrice] = useState<number>(0);
  const [services, setServices] = useState<string[]>([]);
  const [currency, setCurrency] = useState<TCurrency>("usd");
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasLoadedSuccessfully, setHasLoadedSuccessfully] =
    useState<boolean>(false);
  const [userTicket, setUserTicket] = useState<ITicket | null>(null);
  const lottieRef = useRef<LottieView>(null);

  const { bookingId, eventId, packageType } = useLocalSearchParams();
  const { theme } = useTheme();

  const init = useCallback(async () => {
    if (
      !eventId ||
      typeof eventId !== "string" ||
      !bookingId ||
      typeof bookingId !== "string"
    )
      return;

    try {
      setLoading(true);

      const eventRes = await eventServices.get(eventId);

      setEvent(eventRes.data);

      const bookingRes = await fetchBooking(bookingId);

      const booking = bookingRes.data;

      setBooking(booking);
      setBasePrice(booking.price.base);
      setCommissionPrice(booking.price.comission);
      setTotalPrice(booking.price.total);
      setCurrency(booking.price.currency as TCurrency);
      setUserTicket(booking.userTicket || null);

      const selectedServices = [];
      if (booking.flight) selectedServices.push("Flight");
      if (booking.hotel) selectedServices.push("Hotel");
      if (booking.transfer.ah) selectedServices.push("Transfer(A/H)");
      if (booking.transfer.he) selectedServices.push("Transfer(H/E)");
      setServices(selectedServices);
      setHasLoadedSuccessfully(true);
    } catch (error: any) {
      // console.error(error);
      setHasLoadedSuccessfully(false);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    init();
  }, []);

  return (
    <BookedContainer>
      {loading ? (
        <View className="flex-1 flex-col items-center justify-center">
          <Spinner size="md" />
        </View>
      ) : (
        <>
          <View className="relative w-[381px] h-[221px]">
            <Image
              source={theme === "light" ? BookedLightImage : BookedDarkImage}
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
            packageType={(packageType as any) || "standard"}
            userTicket={userTicket}
          />
          <FlightDetails flight={booking?.flight} packageType="standard" />
          <HotelDetails hotel={booking?.hotel} />
          <TrasferDetails
            transfer={booking?.transfer?.ah}
            title="Aiport To Hotel Transfer Details"
          />
          <TrasferDetails
            transfer={booking?.transfer?.he}
            title="Hotel To Event Transfer Details"
          />
          <TripSummary
            basePrice={basePrice}
            comissionPrice={commissionPrice}
            totalPrice={totalPrice}
            services={services}
            currency={currency}
          />

          <View className="w-full gap-4 mb-24">
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
    </BookedContainer>
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
