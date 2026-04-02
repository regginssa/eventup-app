import { TCoordinate, TDropdownItem, TPackageType } from "@/types";
import { IBooking } from "@/types/booking";
import { IEvent } from "@/types/event";
import { IFlightOffer } from "@/types/flight";
import { IHotelOffer } from "@/types/hotel";
import df from "@/utils/date";
import { normalizeDateUTC } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import {
  Button,
  DateTimePicker,
  Dropdown,
  FlightItem,
  HotelItem,
  RadioButton,
  TransferItem,
} from "../common";
import { useAuth } from "../providers/AuthProvider";
import { useFlight } from "../providers/FlightProvider";
import { useHotel } from "../providers/HotelProvider";
import { useToast } from "../providers/ToastProvider";
import { useTransfer } from "../providers/TransferProvider";

interface BookSearchInputGroupProps {
  event: IEvent;
  packageType: TPackageType;
  currentLocationCoords: TCoordinate | null;
  currentCity: string | null;
  currentCountryCode: string | null;
  booking?: IBooking;
}

const BookSearchInputGroup: React.FC<BookSearchInputGroupProps> = ({
  event,
  packageType,
  currentLocationCoords,
  currentCity,
  currentCountryCode,
  booking,
}) => {
  const [includes, setIncludes] = useState({
    flight: true,
    hotel: true,
    transferAirport: true,
    transferEvent: true,
  });
  const [departureLocation, setDepartureLocation] = useState<
    "current" | "home"
  >("current");
  const [booked, setBooked] = useState({
    flight: false,
    hotel: false,
    transferAirport: false,
    transferEvent: false,
  });
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [hotelDepartureDate, setHotelDepartureDate] = useState<Date>(
    new Date(),
  );
  const [hotelCheckInDate, setHotelCheckInDate] = useState<Date>(new Date());
  const [hotelCheckoutDate, setHotelCheckoutDate] = useState<Date>(new Date());
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [refreshLoading, setRefreshLoading] = useState<Map<string, boolean>>(
    new Map(),
  );
  const [tripType, setTripType] = useState<TDropdownItem>({
    label: "One Way",
    value: "one_way",
  });
  const [flightReturnDate, setFlightReturnDate] = useState<Date>(new Date());

  const { user } = useAuth();
  const {
    offer: flightOffer,
    search: searchFlight,
    initialize: initializeFlight,
  } = useFlight();
  const {
    offer: hotelOffer,
    search: searchHotel,
    initialize: initializeHotel,
  } = useHotel();
  const {
    airportToHotelOffer,
    hotelToEventOffer,
    search: searchTransfer,
    initialize: initializeTransfer,
  } = useTransfer();
  const toast = useToast();
  const router = useRouter();

  const initialize = () => {
    initializeFlight();
    initializeHotel();
    initializeTransfer();
  };

  const setLoading = (key: string, value: boolean) => {
    setRefreshLoading((prev) => {
      const next = new Map(prev);
      next.set(key, value);
      return next;
    });
  };

  const handleFlight = async () => {
    if (!includes.flight || booked.flight) return null;

    // const eventDateTime = normalizeDateUTC(
    //   new Date(event.dates?.start?.date as string),
    // );
    // const departureDateTime = normalizeDateUTC(departureDate);

    // if (eventDateTime < departureDateTime) {
    //   toast.info("The departure date cannot be after the event date.");
    //   return null;
    // }

    setLoading("flight", true);
    const originGeo =
      departureLocation === "current"
        ? currentLocationCoords
        : user?.location.coordinate;
    const destGeo = event.location?.coordinate;

    const params = {
      originLat: originGeo?.latitude,
      originLng: originGeo?.longitude,
      destLat: destGeo?.latitude,
      destLng: destGeo?.longitude,
      departureDate: df.toISOString(departureDate),
      packageType,
      tripType: tripType.value,
      returnDate: df.toISOString(flightReturnDate),
    };

    const data = await searchFlight(params);
    setLoading("flight", false);
    return data;
  };

  const handleHotel = async (
    flightOffer: IFlightOffer | null,
  ): Promise<IHotelOffer | null> => {
    if (!includes.hotel || booked.hotel) return null;

    const eventDate = normalizeDateUTC(
      new Date(event.dates?.start?.date as string),
    );
    const checkOut = normalizeDateUTC(hotelCheckoutDate);

    // Shared coordinates
    const hotelGeo = event.location?.coordinate;

    // Validate checkout vs event date
    // if (eventDate > checkOut) {
    //   toast.info("The hotel checkout date cannot be after the event date.");
    //   return null;
    // }

    // let checkIn: any;

    // // If flights are included, ensure flight is selected and use its arrival time
    // if (includes.flight) {
    //   if (!flightOffer) {
    //     return null;
    //   }
    //   checkIn = new Date(flightOffer.arrivalTime);
    // } else {
    //   // When no flight: validate check-in vs event
    //   const checkInDate = normalizeDateUTC(hotelCheckInDate);
    //   // if (eventDate < checkInDate) {
    //   //   toast.info("The hotel checkIn date cannot be after the event date.");
    //   //   return null;
    //   // }
    //   checkIn = hotelCheckInDate;
    // }

    // Build params
    const params = {
      lat: hotelGeo?.latitude,
      lng: hotelGeo?.longitude,
      checkIn: df.toISOString(hotelCheckInDate),
      checkOut: df.toISOString(hotelCheckoutDate),
      packageType,
    };

    // Execute search
    setLoading("hotel", true);
    const data = await searchHotel(params);
    setLoading("hotel", false);

    return data;
  };

  const handleAirportToHotel = async (
    flightOffer: IFlightOffer | null,
    hotelOffer: IHotelOffer | null,
  ) => {
    if (!includes.transferAirport || booked.transferAirport) return;

    if (flightOffer && hotelOffer) {
      const destinationIata = flightOffer.slices[0].originIata;
      setLoading("airportToHotel", true);
      const params = {
        from: {
          type: "IATA",
          code: destinationIata,
        },
        to: {
          type: "GPS",
          code: `${hotelOffer.latitude},${hotelOffer.longitude}`,
        },
        departureDateTime: flightOffer.arrivalTime,
        packageType,
      };

      await searchTransfer(params, "ah");
      setLoading("airportToHotel", false);
    }
  };

  const handleHotelToEvent = async (hotelOffer: IHotelOffer | null) => {
    if (!includes.transferEvent || booked.transferEvent) return;

    const eventGeo = event.location?.coordinate;
    if (!eventGeo) return toast.warn("Event isn't selected");

    let fromParams: any = {};

    // Determine the "from" location
    if (includes.hotel) {
      if (!hotelOffer) return;

      fromParams = {
        type: "GPS",
        code: `${hotelOffer.latitude},${hotelOffer.longitude}`,
      };
    } else {
      if (departureLocation === "current" && !currentLocationCoords) return;
      if (departureLocation === "home" && !user?.location.coordinate) return;

      if (departureLocation === "current") {
        fromParams = {
          type: "GPS",
          code: `${currentLocationCoords?.latitude},${currentLocationCoords?.longitude}`,
        };
      } else {
        fromParams = {
          type: "GPS",
          code: `${user?.location.coordinate?.latitude},${user?.location.coordinate?.longitude}`,
        };
      }
    }

    const toParams = {
      type: "GPS",
      code: `${eventGeo.latitude},${eventGeo.longitude}`,
    };

    const params = {
      from: fromParams,
      to: toParams,
      departureDateTime: df.toTransferDate(hotelDepartureDate),
      packageType,
    };

    setLoading("hotelToEvent", true);
    await searchTransfer(params, "he");
    setLoading("hotelToEvent", false);
  };

  const handleSearch = async () => {
    if (!event._id) return toast.warn("Event ID is missing.");

    if (!event.dates?.timezone) return toast.warn("Event timezone is missing.");

    if (!user?._id) {
      toast.warn("You should log in first");
      return router.replace("/auth/login");
    }

    try {
      setSearchLoading(true);
      initialize();

      const flightData = await handleFlight();

      const hotelData = await handleHotel(flightData);

      if (includes.transferAirport || includes.transferEvent) {
        // const eventDateTime = normalizeDateUTC(
        //   new Date(event.dates?.start?.date as string),
        // );
        // const hotelDepartureDateTime = normalizeDateUTC(hotelDepartureDate);

        // if (hotelDepartureDateTime > eventDateTime) {
        //   return toast.warn(
        //     "The hotel departure date cannot be after the event date.",
        //   );
        // }
        await handleAirportToHotel(flightData, hotelData);
        await handleHotelToEvent(hotelData);
      }
    } catch (error) {
      console.log("handleSearch error: ", error);
      toast.error("Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!booking) return;

    const { flight, hotel, transfer } = booking;
    const { airportToHotel, hotelToEvent } = transfer || {};

    setBooked({
      flight: !!flight?.booking?.id,
      hotel: !!hotel?.booking?.id,
      transferAirport: !!airportToHotel?.booking?.id,
      transferEvent: !!hotelToEvent?.booking?.id,
    });
  }, [booking]);

  useEffect(() => {
    setIncludes((prev) => ({
      ...prev,
      flight: booked.flight ? true : prev.flight,
      hotel: booked.hotel ? true : prev.hotel,
      transferAirport: booked.transferAirport ? true : prev.transferAirport,
      transferEvent: booked.transferEvent ? true : prev.transferEvent,
    }));
  }, [booked]);

  useEffect(() => {
    const canHaveTransfer =
      (includes.flight || booked.flight) && (includes.hotel || booked.hotel);

    if (!canHaveTransfer && includes.transferAirport) {
      setIncludes((prev) => ({ ...prev, transferAirport: false }));
    }
  }, [includes.flight, includes.hotel, booked]);

  const toggleInclude = (key: keyof typeof includes) => {
    if (booked[key]) return; // 🔒 prevent changes

    const canHaveAirportTransfer = includes.flight && includes.hotel;

    if (key === "transferAirport" && !canHaveAirportTransfer) return;

    setIncludes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getAirportTransferDescription = () => {
    if (!booking?.flight || !booking?.hotel) return null;

    const flight = booking.flight;
    const hotel = booking.hotel;

    const airport =
      flight?.offer?.slices[flight.offer.slices.length - 1].destinationIata ||
      "Arrival Airport";

    const hotelName = hotel?.offer?.name || "Hotel";

    return `From ${airport} → ${hotelName}`;
  };

  const getCardStyle = (isActive: boolean) => [
    {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      padding: 12,
      borderWidth: 1,
      backgroundColor: isActive ? "#FFFFFF" : "rgba(241, 245, 249, 0.5)", // bg-slate-100/50
      borderColor: isActive ? "#844AFF" : "transparent",
      // Shadow only for active state
      elevation: isActive ? 2 : 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isActive ? 0.05 : 0,
      shadowRadius: 4,
    },
  ];

  const GradientCheckbox = ({
    checked,
    onPress,
  }: {
    checked: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      {checked ? (
        <LinearGradient
          colors={["#C427E0", "#844AFF", "#12A9FF"]}
          style={{
            borderRadius: 6,
            width: 20,
            height: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name="check" size={14} color="white" />
        </LinearGradient>
      ) : (
        <View className="w-5 h-5 rounded-md border-2 border-slate-200 bg-white" />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="w-full flex flex-col gap-2">
      {/* SECTION 0: INCLUSIONS */}
      <View className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
        <View className="flex-row items-center gap-2 mb-4">
          <View className="w-6 h-6 rounded-full bg-[#844AFF10] items-center justify-center">
            <MaterialCommunityIcons
              name="layers-outline"
              size={14}
              color="#844AFF"
            />
          </View>
          <Text className="font-poppins-semibold text-sm text-slate-800">
            What's included?
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {[
            { key: "flight", label: "Flight", icon: "airplane" },
            { key: "hotel", label: "Hotel", icon: "bed-outline" },
            {
              key: "transferAirport",
              label: "Airport Transfer",
              icon: "car-back",
            },
            {
              key: "transferEvent",
              label: "Event Transfer",
              icon: "map-marker-distance",
            },
          ]
            .filter((item) => !booked[item.key as keyof typeof booked])
            .map((item) => (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.7}
                onPress={() => toggleInclude(item.key as any)}
                className="rounded-full"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "white",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: includes[item.key as keyof typeof includes]
                    ? "#844AFF30"
                    : "#f1f5f9",
                }}
              >
                <GradientCheckbox
                  checked={includes[item.key as keyof typeof includes]}
                  onPress={() => toggleInclude(item.key as any)}
                />
                <Text className="ml-2 font-dm-sans-medium text-[12px] text-slate-700">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      {(includes.transferAirport || booked.transferAirport) &&
        booked.flight &&
        booked.hotel && (
          <View className="p-3 rounded-xl bg-[#844AFF08] border border-[#844AFF20] flex-row items-center">
            <MaterialCommunityIcons
              name="information-outline"
              size={16}
              color="#844AFF"
            />
            <Text className="ml-2 text-xs text-slate-700 font-dm-sans-medium flex-1">
              {getAirportTransferDescription()}
            </Text>
          </View>
        )}

      {/* TIMEZONE INFO BOX */}
      {/* <View className="overflow-hidden rounded-2xl">
        <LinearGradient
          colors={["#12A9FF15", "#12A9FF05"]}
          start={{ x: 0, y: 0 }}
          className="p-4 flex-row items-center border border-[#12A9FF30]"
        >
          <MaterialCommunityIcons
            name="clock-outline"
            size={20}
            color="#12A9FF"
          />
          <Text className="font-dm-sans-medium text-[11px] text-blue-600 ml-3 flex-1">
            Scheduling is synced to event local time:
            <Text className="font-dm-sans-bold">
              {" "}
              {event.dates?.timezone || "UTC"}
            </Text>
          </Text>
        </LinearGradient>
      </View> */}

      {/* SECTION 1: ORIGIN (Only if Flight is checked) */}
      {includes.flight && !booked.flight && (
        <View className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-6 h-6 rounded-full bg-[#844AFF20] items-center justify-center">
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={14}
                color="#844AFF"
              />
            </View>
            <Text className="font-poppins-semibold text-sm text-slate-800">
              Departure Point
            </Text>
          </View>

          <View className="gap-3">
            {/* Current Location Option */}
            <TouchableOpacity
              style={getCardStyle(departureLocation === "current")}
              className="rounded-full"
              onPress={() => setDepartureLocation("current")}
              activeOpacity={0.7}
            >
              <View className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
                <MaterialCommunityIcons
                  name="map-marker-radius"
                  size={22}
                  color={
                    departureLocation === "current" ? "#844AFF" : "#94a3b8"
                  }
                />
              </View>

              <View className="flex-1 ml-3">
                <Text
                  style={{
                    color:
                      departureLocation === "current" ? "#844AFF" : "#94a3b8",
                  }}
                  className="font-dm-sans-bold text-[10px] uppercase tracking-[1.5px]"
                >
                  Current Location
                </Text>
                <Text className="font-dm-sans-medium text-slate-700 text-xs mt-0.5">
                  {currentCity}, {currentCountryCode}
                </Text>
              </View>

              <RadioButton
                checked={departureLocation === "current"}
                onPress={() => setDepartureLocation("current")}
              />
            </TouchableOpacity>

            {/* Home Location Option */}
            {user?._id && (
              <TouchableOpacity
                style={getCardStyle(departureLocation === "home")}
                className="rounded-full"
                onPress={() => setDepartureLocation("home")}
                activeOpacity={0.7}
              >
                <View className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
                  <MaterialCommunityIcons
                    name="home-map-marker"
                    size={22}
                    color={departureLocation === "home" ? "#844AFF" : "#94a3b8"}
                  />
                </View>

                <View className="flex-1 ml-3">
                  <Text
                    style={{
                      color:
                        departureLocation === "home" ? "#844AFF" : "#94a3b8",
                    }}
                    className="font-dm-sans-bold text-[10px] uppercase tracking-[1.5px]"
                  >
                    Saved Home
                  </Text>
                  <Text className="font-dm-sans-medium text-slate-700 text-xs mt-0.5">
                    {user?.location.city.name}, {user?.location.country.code}
                  </Text>
                </View>

                <RadioButton
                  checked={departureLocation === "home"}
                  onPress={() => setDepartureLocation("home")}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* SECTION 2: SCHEDULE (Dynamic Date Pickers) */}
      <View className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
        <View className="flex-row items-center gap-2 mb-4">
          <View className="w-6 h-6 rounded-full bg-[#844AFF20] items-center justify-center">
            <MaterialCommunityIcons
              name="calendar-clock-outline"
              size={14}
              color="#844AFF"
            />
          </View>
          <Text className="font-poppins-semibold text-sm text-slate-800">
            Itinerary Schedule
          </Text>
        </View>

        <View className="gap-4">
          {includes.flight && !booked.flight && (
            <>
              <Dropdown
                label="Flight Trip Type"
                bordered
                items={[
                  { label: "One Way", value: "one_way" },
                  { label: "Round", value: "round" },
                ]}
                selectedItem={tripType}
                onSelect={setTripType}
              />

              <DateTimePicker
                label="Flight Departure Date"
                className="rounded-xl"
                bordered
                value={departureDate}
                onPick={setDepartureDate}
              />

              {tripType.value === "round" && (
                <DateTimePicker
                  label="Flight return date"
                  className="rounded-xl"
                  bordered
                  value={flightReturnDate}
                  onPick={setFlightReturnDate}
                />
              )}
            </>
          )}

          {includes.hotel && !booked.hotel && (
            <>
              <DateTimePicker
                label="Hotel CheckIn Date"
                className="rounded-xl"
                bordered
                mode="date"
                value={hotelCheckInDate}
                onPick={setHotelCheckInDate}
              />
              <DateTimePicker
                label="Hotel Checkout Date"
                className="rounded-xl"
                bordered
                mode="date"
                value={hotelCheckoutDate}
                onPick={setHotelCheckoutDate}
              />
            </>
          )}

          {includes.transferEvent && !booked.transferEvent && (
            <DateTimePicker
              label="Transfer date time to Event"
              className="rounded-xl"
              bordered
              mode="datetime"
              value={hotelDepartureDate}
              onPick={setHotelDepartureDate}
            />
          )}
        </View>
      </View>

      {/* SECTION 3: OFFERS (Only show what's checked) */}
      {(flightOffer ||
        hotelOffer ||
        airportToHotelOffer ||
        hotelToEventOffer) && (
        <View className="gap-3 ">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-6 h-6 rounded-full bg-[#844AFF20] items-center justify-center">
              <MaterialCommunityIcons
                name="ticket-outline"
                size={14}
                color="#844AFF"
              />
            </View>
            <Text className="font-poppins-semibold text-sm text-slate-800">
              Selected Itinerary
            </Text>
          </View>

          <View className="gap-2">
            {includes.flight && (
              <FlightItem
                data={flightOffer}
                refreshLoading={refreshLoading.get("flight")}
                onRefresh={async () => {
                  await handleFlight();
                }}
              />
            )}
            {includes.hotel && (
              <HotelItem
                data={hotelOffer}
                refreshLoading={refreshLoading.get("hotel")}
                onRefresh={async () => {
                  await handleHotel(flightOffer);
                }}
              />
            )}
            {includes.transferAirport && (
              <TransferItem
                data={airportToHotelOffer}
                refreshLoading={refreshLoading.get("airportToHotel")}
                onRefresh={() => handleAirportToHotel(flightOffer, hotelOffer)}
              />
            )}
            {includes.transferEvent && (
              <TransferItem
                data={hotelToEventOffer}
                refreshLoading={refreshLoading.get("hotelToEvent")}
                onRefresh={() => handleHotelToEvent(hotelOffer)}
              />
            )}
          </View>
        </View>
      )}

      {Platform.OS === "ios" && <View className="h-4"></View>}

      {/* SEARCH BUTTON */}
      <Button
        type="primary"
        label={searchLoading ? "Searching..." : "Search"}
        buttonClassName="h-12 rounded-2xl"
        loading={searchLoading}
        onPress={handleSearch}
      />
    </View>
  );
};

export default BookSearchInputGroup;
