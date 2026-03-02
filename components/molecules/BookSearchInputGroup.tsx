import { TCoordinate, TPackageType } from "@/types";
import { IEvent } from "@/types/event";
import df from "@/utils/date";
import { normalizeDateUTC } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import {
  Button,
  DateTimePicker,
  FlightItem,
  HotelItem,
  RadioButton,
} from "../common";
import { useAuth } from "../providers/AuthProvider";
import { useFlights } from "../providers/FlightsProvider";
import { useHotels } from "../providers/HotelsProvider";
import { useToast } from "../providers/ToastProvider";

interface BookSearchInputGroupProps {
  event: IEvent;
  packageType: TPackageType;
  currentLocationCoords: TCoordinate | null;
  currentCity: string | null;
  currentCountryCode: string | null;
}

const BookSearchInputGroup: React.FC<BookSearchInputGroupProps> = ({
  event,
  packageType,
  currentLocationCoords,
  currentCity,
  currentCountryCode,
}) => {
  const [departureLocation, setDepartureLocation] = useState<
    "current" | "home"
  >("current");
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [hotelDepartureDate, setHotelDepartureDate] = useState<Date>(
    new Date(),
  );
  const [hotelCheckoutDate, setHotelCheckoutDate] = useState<Date>(new Date());
  const [searchBtnLabel, setSearchBtnLabel] = useState<string>("Search");
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const { user } = useAuth();
  const { offer: flightOffer, search: searchFlight } = useFlights();
  const { offer: hotelOffer, search: searchHotel } = useHotels();
  const toast = useToast();

  const handleFlight = async () => {
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
    };

    await searchFlight(params);
  };

  const handleHotel = async () => {
    if (!flightOffer) return toast.warn("Airline isn't selected");
    const hotelGeo = event.location?.coordinate;
    if (!hotelGeo) return;

    const params = {
      lat: hotelGeo.latitude,
      lng: hotelGeo.longitude,
      checkIn: df.toISOString(new Date(flightOffer.arrivalTime)),
      checkOut: df.toISOString(hotelCheckoutDate),
      packageType,
    };

    await searchHotel(params);
  };

  const handleSearch = async () => {
    if (!event._id) return toast.warn("Event ID is missing.");

    if (!event.dates?.timezone) return toast.warn("Event timezone is missing.");

    const eventDateTime = normalizeDateUTC(
      new Date(event.dates?.start?.date as string),
    );
    const departureDateTime = normalizeDateUTC(departureDate);
    const hotelDepartureDateTime = normalizeDateUTC(hotelDepartureDate);
    const hotelCheckoutDateTime = normalizeDateUTC(hotelCheckoutDate);

    if (eventDateTime < departureDateTime) {
      return toast.warn("The departure date cannot be after the event date.");
    }

    if (eventDateTime > hotelCheckoutDateTime) {
      return toast.warn(
        "The hotel checkout date cannot be after the event date.",
      );
    }

    if (hotelDepartureDateTime > eventDateTime) {
      return toast.warn(
        "The hotel departure date cannot be after the event date.",
      );
    }

    try {
      setSearchLoading(true);
      setIsSearched(false);

      setSearchBtnLabel("Searching flights...");
      await handleFlight();

      setSearchBtnLabel("Searching hotels...");
      await handleHotel();
      // if (!hotelData) throw new Error("No hotel found");

      // setSearchBtnLabel("Searching transfers...");
      // await searchTransfers(flightData, hotelData);
    } catch (error) {
      console.log("handleSearch error: ", error);
      toast.error("Search failed");
    } finally {
      setSearchLoading(false);
      setSearchBtnLabel("Search");
      setIsSearched(true);
    }
  };

  return (
    <View className="w-full flex flex-col gap-3">
      <View className="">
        <Text className="font-poppins-medium text-sm text-gray-700">
          Where will you be departing from?
        </Text>

        <View className="w-full flex flex-col gap-2 mt-2">
          <View>
            <View className="w-full flex flex-row items-center gap-2">
              <View className="flex flex-row items-start gap-1 flex-1">
                <MaterialCommunityIcons
                  name="map-marker-radius-outline"
                  size={16}
                  color="#4b5563"
                />
                <Text className="font-dm-sans-medium text-gray-600 text-sm line-clamp-2">
                  Current Location ({currentCity}, {currentCountryCode})
                </Text>
              </View>

              <RadioButton
                checked={departureLocation === "current"}
                onPress={() => setDepartureLocation("current")}
              />
            </View>
          </View>

          <View>
            <View className="w-full flex flex-row items-center gap-2">
              <View className="flex flex-row items-start gap-1 flex-1">
                <MaterialCommunityIcons
                  name="map-marker-account-outline"
                  size={16}
                  color="#4b5563"
                />
                <Text className="font-dm-sans-medium text-gray-600 text-sm line-clamp-2">
                  Home region / Saved location ({user?.location.city.name},{" "}
                  {user?.location.country.name || ""})
                </Text>
              </View>

              <RadioButton
                checked={departureLocation === "home"}
                onPress={() => setDepartureLocation("home")}
              />
            </View>
          </View>
        </View>
      </View>

      <View className="w-full h-[1px] bg-gray-200"></View>

      <View className="w-full p-4 rounded-xl flex flex-row items-start gap-2 bg-blue-200 border border-blue-600">
        <MaterialCommunityIcons
          name="information-outline"
          size={24}
          color="#2563eb"
        />
        <Text className="font-dm-sans-semibold text-sm text-blue-600">
          All of your bookings will be based on event timezone:{" "}
          <Text className="font-dm-sans-bold">
            {event.dates?.timezone || "UTC"}
          </Text>
        </Text>
      </View>

      <View className="w-full h-[1px] bg-gray-200"></View>

      <DateTimePicker
        label="Tell us when you will leave the airport in your location"
        className="rounded-md"
        value={departureDate}
        onPick={setDepartureDate}
      />
      <DateTimePicker
        label="Tell us when you will check out of the hotel"
        className="rounded-md"
        mode="date"
        value={hotelCheckoutDate}
        onPick={setHotelCheckoutDate}
      />
      <DateTimePicker
        label="Tell us when you will leave the hotel for the event"
        className="rounded-md"
        mode="datetime"
        value={hotelDepartureDate}
        onPick={setHotelDepartureDate}
      />

      <View className="w-full h-[1px] bg-gray-200"></View>

      {isSearched && (
        <>
          <View className="w-full h-[1px] bg-gray-300"></View>
          <FlightItem data={flightOffer} />
        </>
      )}

      {isSearched && (
        <>
          <View className="w-full h-[1px] bg-gray-300"></View>
          <HotelItem data={hotelOffer} />
        </>
      )}

      {/* {isSearched && (
        <>
          <View className="w-full h-[1px] bg-gray-300"></View>

          <TransferAvailabilityGroup
            transfer={rdTransfer}
            isSearched={isSearched}
            available={true}
          />
        </>
      )} */}

      <View className="w-full h-[1px] bg-gray-300"></View>

      <Button
        type="primary"
        label={searchBtnLabel}
        loading={searchLoading}
        onPress={handleSearch}
        buttonClassName="h-12"
      />
    </View>
  );
};

export default BookSearchInputGroup;
