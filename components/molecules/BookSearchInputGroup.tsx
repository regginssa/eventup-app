import { TCoordinate, TPackageType } from "@/types";
import { IEvent } from "@/types/event";
import { IFlightOffer } from "@/types/flight";
import df from "@/utils/date";
import { normalizeDateUTC } from "@/utils/format";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button, DateTimePicker, RadioButton } from "../common";
import { useAuth } from "../providers/AuthProvider";
import { useFlights } from "../providers/FlightsProvider";
import { useToast } from "../providers/ToastProvider";
import FlightsOffersGroup from "./FlightsOffersGroup";

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
  const [hotelRooms, setHotelRooms] = useState<number>(1);
  const [searchBtnLabel, setSearchBtnLabel] = useState<string>("");
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const [travelers, setTravelers] = useState<number>(1);

  const { user } = useAuth();
  const { offers, search: searchFlights } = useFlights();
  const toast = useToast();

  const handleFlights = async () => {
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

    await searchFlights(params);
  };

  // const searchHotels = async (flight: TFlightItemData) => {
  //   if (!flight) {
  //     Alert.alert("Flight Not Selected", "Please select a flight first.");
  //     return null;
  //   }

  //   const flightArrivalDate = flight.arrivalDate;

  //   const flightArrival = new Date(flightArrivalDate);
  //   const flightArrivalDateTime = normalizeDateUTC(flightArrival);
  //   const eventOpeningDateTime = normalizeDateUTC(
  //     new Date(event.dates?.start?.date as string),
  //   );

  //   if (flightArrivalDateTime > eventOpeningDateTime) {
  //     Alert.alert(
  //       "Invalid Flight Arrival Date",
  //       "The flight arrival date cannot be before the event date.",
  //     );
  //     return null;
  //   }

  //   const params = {
  //     type: packageType,
  //     eventId: event._id,
  //     checkInDate: formatBookingDate(flightArrival),
  //     checkOutDate: formatBookingDate(hotelCheckoutDate),
  //     adults: travelers,
  //     roomQuantity: hotelRooms,
  //   };

  //   const response = await fetchHotelOffers(params);

  //   if (!response.data) {
  //     return null;
  //   }

  //   setBookingHotel({
  //     ...rdHotel,
  //     offers: response.data,
  //   });
  //   setBookingHotelRooms(hotelRooms);

  //   const hotelOffer = mapAmadeusHotelOfferToHotelItemData(response.data[0]);

  //   return hotelOffer;
  // };

  // const searchTransfers = async (
  //   flight: TFlightItemData,
  //   hotel: THotelItemData,
  // ) => {
  //   if (!flight) {
  //     Alert.alert("Flight Not Selected");
  //     return;
  //   }
  //   if (!hotel) {
  //     Alert.alert("Hotel Not Selected");
  //     return;
  //   }

  //   const flightArrival = new Date(flight.arrivalDate);
  //   const flightArrivalDateTime = normalizeDateUTC(flightArrival);
  //   const hotelDepartureDateTime = normalizeDateUTC(hotelDepartureDate);

  //   if (flightArrivalDateTime > hotelDepartureDateTime) {
  //     Alert.alert(
  //       "Invalid Hotel Departure Date",
  //       "The hotel departure date cannot be before the flight arrival date.",
  //     );
  //     return;
  //   }

  //   const params = {
  //     eventId: event._id,
  //     airportCode: flight.to,
  //     airportLeaveDateTime: flight.arrivalDate,
  //     hotelAddressLine: hotel.address.lines.join(", "),
  //     hotelCityName: hotel.address.cityName,
  //     hotelZipCode: hotel.address.postalCode,
  //     hotelCountryCode: hotel.address.countryCode,
  //     hotelName: hotel.hotelName,
  //     hotelGeoCode: `${hotel.latitude},${hotel.longitude}`,
  //     hotelCode: hotel.hotelId,
  //     transferType: packageType === "standard" ? "SHARED" : "PRIVATE",
  //     hotelLeaveDateTime: toLocalISOString(hotelDepartureDate),
  //     passengers: hotel.adults,
  //   };

  //   const response = await fetchTransferOffers(params);

  //   if (!response.data) {
  //     return null;
  //   }

  //   console.log("[transfer offer data]: ", response.data);

  //   setBookingTransfer({
  //     ...rdTransfer,
  //     ah: response.data.airportToHotel,
  //     he: response.data.hotelToEvent,
  //   });
  // };

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

    if (travelers < hotelRooms) {
      return toast.warn(
        "The number of travelers cannot be less than the number of hotel rooms.",
      );
    }

    try {
      setSearchLoading(true);
      setIsSearched(false);

      setSearchBtnLabel("Searching flights...");
      await handleFlights();

      // setSearchBtnLabel("Searching hotels...");
      // const hotelData = await searchHotels(flightData);
      // if (!hotelData) throw new Error("No hotel found");

      // setSearchBtnLabel("Searching transfers...");
      // await searchTransfers(flightData, hotelData);
    } catch (error) {
      console.log("handleSearch error: ", error);
      toast.error("Search failed");
    } finally {
      setSearchLoading(false);
      setSearchBtnLabel("");
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

      <Text className="font-poppins-medium text-sm text-gray-700">
        Tell us who's traveling and how many rooms you need.
      </Text>

      <View className="w-full flex flex-row items-center justify-between">
        <Text className="font-dm-sans-medium text-sm text-gray-600">
          Travelers
        </Text>

        <View className="flex flex-row items-center gap-4">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
            disabled={travelers <= 1}
            onPress={() => travelers > 1 && setTravelers(travelers - 1)}
          >
            <Entypo name="minus" size={14} color="#1f2937" />
          </TouchableOpacity>
          <Text className="font-poppins-semibold text-gray-800">
            {travelers}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
            disabled={travelers >= 8}
            onPress={() => travelers < 8 && setTravelers(travelers + 1)}
          >
            <Entypo name="plus" size={14} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="w-full flex flex-row items-center justify-between">
        <Text className="font-dm-sans-medium text-sm text-gray-600">
          Hotel Rooms
        </Text>

        <View className="flex flex-row items-center gap-4">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
            disabled={hotelRooms <= 1}
            onPress={() => {
              hotelRooms > 1 && setHotelRooms(hotelRooms - 1);
            }}
          >
            <Entypo name="minus" size={14} color="#1f2937" />
          </TouchableOpacity>
          <Text className="font-poppins-semibold text-gray-800">
            {hotelRooms}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
            disabled={hotelRooms >= 5}
            onPress={() => hotelRooms < 5 && setHotelRooms(hotelRooms + 1)}
          >
            <Entypo name="plus" size={14} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {isSearched && (
        <>
          <View className="w-full h-[1px] bg-gray-300"></View>

          <FlightsOffersGroup
            selected={offers[0]}
            items={offers}
            isSearched={isSearched}
            onSelect={(selected: IFlightOffer) => {}}
          />
        </>
      )}

      {/* {isSearched && (
        <>
          <View className="w-full h-[1px] bg-gray-300"></View>

          <HotelAvailabilityGroup
            items={rdHotel?.offers || []}
            selected={rdHotel?.offers[0]}
            isSearched={isSearched}
            onSelect={(selected: TAmadeusHotelOffer) => {
              if (rdHotel) {
                const reorderedData = [
                  selected,
                  ...rdHotel.offers.filter(
                    (item) => item.hotel?.hotelId !== selected.hotel?.hotelId,
                  ),
                ];
                setBookingHotel({ ...rdHotel, offers: reorderedData });
              }
            }}
          />
        </>
      )}

      {isSearched && (
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

      {searchBtnLabel !== "" && (
        <Text className="font-poppins-medium text-sm text-gray-800">
          {searchBtnLabel}
        </Text>
      )}

      <Button
        type="primary"
        label="Search"
        loading={searchLoading}
        onPress={handleSearch}
        buttonClassName="h-12"
      />
    </View>
  );
};

export default BookSearchInputGroup;
