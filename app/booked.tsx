import { fetchBooking } from "@/api/scripts/booking";
import { fetchEvent } from "@/api/scripts/event";
import { Button, Spinner, TicketQR } from "@/components/common";
import { BookedContainer } from "@/components/organisms";
import { useTheme } from "@/components/providers/ThemeProvider";
import {
  setBookingFlight,
  setBookingHotel,
  setBookingHotelSelectedRoomRate,
} from "@/redux/slices/booking.slice";
import { RootState } from "@/redux/store";
import { TCurrency, TPackageType } from "@/types";
import { IBooking, IEvent, IHotel, TripDetails } from "@/types/data";
import {
  formatDateTime,
  formatEventDate,
  getCurrencySymbol,
} from "@/utils/format";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const BookedLightImage = require("@/assets/images/booked_image.png");
const BookedDarkImage = require("@/assets/images/booked_image_dark.png");

const EventTicket = ({
  event,
  packageType,
}: {
  event: IEvent | null;
  packageType: TPackageType;
}) => {
  const [items, setItems] = useState<any[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    if (!event) return;

    let items = [
      {
        label: event.title,
        icon: "calendar-badge-outline",
      },
      {
        label: formatEventDate(new Date(event.opening_date as any)),
        icon: "calendar-clock-outline",
      },
      {
        label: event.venue?.city
          ? `${event.venue.city}, ${event.country_code}`
          : event.country,
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
    </View>
  );
};

const FlightDetails = ({
  flight,
  packageType,
}: {
  flight: TripDetails | undefined;
  packageType: TPackageType;
}) => {
  const { theme } = useTheme();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!flight) return;

    const reservationItems =
      flight?.TravelItinerary?.ItineraryInfo?.ReservationItems;

    // Pick first segment for display
    const firstSegment = reservationItems?.[0]?.ReservationItem;
    const lastSegment =
      reservationItems?.[reservationItems.length - 1]?.ReservationItem;

    const airlineLabel = firstSegment
      ? `Airline: ${firstSegment.MarketingAirlineCode} ${firstSegment.FlightNumber}`
      : "Airline: N/A";

    const departureLabel = firstSegment
      ? `Departure: ${
          firstSegment.DepartureAirportLocationCode
        } - ${formatDateTime(firstSegment.DepartureDateTime as any)}`
      : "Departure: N/A";

    const arrivalLabel = lastSegment
      ? `Arrival: ${lastSegment.ArrivalAirportLocationCode} - ${formatDateTime(
          lastSegment.ArrivalDateTime as any
        )}`
      : "Arrival: N/A";

    const classLabel = firstSegment
      ? `Class: ${packageType === "standard" ? "Economy/Standard" : "VIP/Gold"}`
      : "Class: N/A";

    const confirmationCode = firstSegment?.AirlinePNR || "N/A";

    const items = [
      {
        label: airlineLabel,
        icon: (
          <MaterialIcons
            name="airlines"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: departureLabel,
        icon: (
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: arrivalLabel,
        icon: (
          <MaterialCommunityIcons
            name="airplane-landing"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: classLabel,
        icon: (
          <MaterialIcons
            name="flight-class"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: `Confirmation Code: ${confirmationCode}`,
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

const HotelBooking = ({ hotel }: { hotel: IHotel | undefined }) => {
  const { theme } = useTheme();
  const [items, setItems] = useState<any[]>([]);

  const details = hotel?.roomBookDetails;

  useEffect(() => {
    if (!hotel) return;

    const roomsLabel = details?.rooms
      ?.map((r) => r.name)
      .filter(Boolean)
      .join(" / ");

    const items = [
      {
        label: `Hotel: ${details?.hotelName ?? "-"}`,
        icon: (
          <MaterialIcons
            name="hotel"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: `Check-in: ${
          details?.checkIn ? formatDateTime(details?.checkIn as any) : "-"
        }`,
        icon: (
          <MaterialCommunityIcons
            name="clock"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: `Check-out: ${
          details?.checkOut ? formatDateTime(details?.checkOut as any) : "-"
        }`,
        icon: (
          <MaterialCommunityIcons
            name="clock"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: `Room: ${roomsLabel || "-"}`,
        icon: (
          <MaterialIcons
            name="bed"
            size={16}
            color={theme === "light" ? "#4b5563" : "#9ca3af"}
          />
        ),
      },
      {
        label: `Reservation Number: ${hotel?.supplierConfirmationNum ?? "-"}`,
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
            Hotel Booking
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

const ChauffeurPickupInfo = () => {
  const { theme } = useTheme();

  const items = [
    {
      label: "Driver: Alexandre B.",
      icon: (
        <MaterialCommunityIcons
          name="account"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Car: Black Mercedes S-Class",
      icon: (
        <MaterialIcons
          name="directions-car"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Pickup: Brussels Airport - Arrivals Terminal",
      icon: (
        <MaterialIcons
          name="luggage"
          size={16}
          color={theme === "light" ? "#4b5563" : "#9ca3af"}
        />
      ),
    },
    {
      label: "Contact: +32 478 123 456",
      icon: (
        <MaterialIcons
          name="phone-in-talk"
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
        Chauffeur Pickup Info (Gold Package Only)
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
  const currencySymbol = getCurrencySymbol(currency);

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
        <View className="w-full flex flex-row items-start gap-6">
          <View className="flex-1 flex-row items-center gap-4">
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
  const lottieRef = useRef<LottieView>(null);

  const { bookingId, eventId, packageType } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { bookings } = useSelector((state: RootState) => state.booking);

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

      const eventRes = await fetchEvent(eventId);

      setEvent(eventRes.data);

      const bookingRes = await fetchBooking(bookingId);

      const booking = bookingRes.data;

      setBooking(booking);

      const flightPrice =
        Number(
          booking.flight.TravelItinerary.ItineraryInfo.ItineraryPricing
            .TotalFare.Amount
        ) || 0;
      const hotelPrice = booking.hotel.roomBookDetails.NetPrice || 0;

      const base = flightPrice + hotelPrice;
      const comm = base * 0.1;
      const total = base + comm;

      setBasePrice(Number(base.toFixed(2)));
      setCommissionPrice(Number(comm.toFixed(2)));
      setTotalPrice(Number(total.toFixed(2)));

      setCurrency(
        (booking.hotel.roomBookDetails.currency?.toLowerCase() || "usd") as any
      );

      const selectedServices = [];
      if (booking.flight) selectedServices.push("Flight");
      if (booking.hotel) selectedServices.push("Hotel");
      setServices(selectedServices);
      setHasLoadedSuccessfully(true);
    } catch (error: any) {
      console.error(error);
      setHasLoadedSuccessfully(false);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    init();

    dispatch(setBookingHotelSelectedRoomRate(undefined));
    dispatch(setBookingFlight(null));
    dispatch(setBookingHotel(null));
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
          />
          <FlightDetails flight={booking?.flight} packageType="standard" />
          <HotelBooking hotel={booking?.hotel} />
          <ChauffeurPickupInfo />
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
              label="Add to Calendar"
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
