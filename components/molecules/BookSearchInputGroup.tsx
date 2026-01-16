import {
  fetchFlightOffers,
  fetchHotelOffers,
  fetchTransfersAvailability,
} from "@/api/scripts/booking";
import {
  setBookingFlight,
  setBookingHotel,
  setBookingTransfer,
} from "@/redux/slices/booking.slice";
import { RootState } from "@/redux/store";
import { TPackageType, TPassengerInfo } from "@/types";
import { TAmadeusHotelOffer } from "@/types/amadeus";
import { IEvent } from "@/types/data";
import {
  formatBookingDate,
  formatTravelproDateTime,
  normalizeDateUTC,
} from "@/utils/format";
import {
  mapAmadeusFlightOfferToFlightItemData,
  mapAmadeusHotelOfferToHotelItemData,
} from "@/utils/map";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button, DateTimePicker, RadioButton, Spinner } from "../common";
import { TFlightItemData } from "../common/FlightItem";
import { THotelItemData } from "../common/HotelItem";
import FlightAvailabilityGroup from "./FlightAvailabilityGroup";
import HotelAvailabilityGroup from "./HotelAvailabilityGroup";
import TransferAvailabilityGroup from "./TransferAvailabilityGroup";

interface BookSearchInputGroupProps {
  event: IEvent;
  packageType: TPackageType;
}

const BookSearchInputGroup: React.FC<BookSearchInputGroupProps> = ({
  event,
  packageType,
}) => {
  const [departureLocation, setDepartureLocation] = useState<
    "current" | "home"
  >("current");
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [hotelDepartureDate, setHotelDepartureDate] = useState<Date>(
    new Date()
  );
  const [hotel, setHotel] = useState<{ rooms: number; data: any[] }>({
    rooms: 1,
    data: [{ adults: 1, childs: 0, child_age: [] }],
  });
  const [infants, setInfants] = useState<number>(0);
  const [searchBtnLabel, setSearchBtnLabel] = useState<string>("");
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [currentCountryCode, setCurrentCountryCode] = useState<string | null>(
    null
  );
  const [currentLocationCoords, setCurrentLocationCoords] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);
  const {
    flight,
    hotel: rdHotel,
    transfer: rdTransfer,
  } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();

  const getUserLocationAndSave = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Location permission not granted");
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  const init = useCallback(async () => {
    if (!user?.location.coordinate) return;
    setLoading(true);
    const coords = await getUserLocationAndSave();

    setCurrentLocationCoords(coords);

    // Reverse geocode to get city and country from current location
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        setCurrentCity(address.city || address.region || null);
        setCurrentCountryCode(address.isoCountryCode || null);
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    init();
  }, [init]);

  const createEmptyPassenger = (): TPassengerInfo => ({
    title: "Mr",
    firstName: "",
    lastName: "",
    dob: "1991-11-12",
    nationality: "",
    passportNo: "",
    passportIssueCountry: "",
    passportExpiryDate: "",
  });

  const formatHotelRooms = (hotel: any) => {
    return hotel.data.map((room: any, index: number) => ({
      room_no: index + 1,
      adult: room.adults,
      child: room.childs,
      child_age: room.child_age.length > 0 ? room.child_age : [0],
    }));
  };

  const buildInitialPaxDetails = (formattedRooms: any[]) => {
    return formattedRooms.map((room) => ({
      room_no: room.room_no,
      adult: {
        title: Array(room.adult).fill("Mr"),
        firstName: Array(room.adult).fill(""),
        lastName: Array(room.adult).fill(""),
      },
      child:
        room.child > 0
          ? {
              title: Array(room.child).fill("Mr"),
              firstName: Array(room.child).fill(""),
              lastName: Array(room.child).fill(""),
            }
          : undefined,
    }));
  };

  // childs: hotel.data.reduce((sum, room) => sum + room.childs, 0),
  // infants,
  // airports:
  //   departureLocation === "current"
  //     ? currentNearestAirports
  //     : homeNearestAirports,

  const searchFlights = async () => {
    const params = {
      type: packageType,
      eventId: event._id,
      departureDate: formatBookingDate(departureDate),
      adults: hotel.data.reduce((sum, room) => sum + room.adults, 0),
      originLocationCoordsLatitude:
        departureLocation === "current"
          ? currentLocationCoords?.latitude
          : user?.location.coordinate.latitude,
      originLocationCoordsLongitude:
        departureLocation === "current"
          ? currentLocationCoords?.longitude
          : user?.location.coordinate.longitude,
    };

    console.log("flight offers params: ", params);

    const response = await fetchFlightOffers(params);

    if (!response.data) {
      return null;
    }

    const data = response.data.map((offer) =>
      mapAmadeusFlightOfferToFlightItemData(offer)
    );

    dispatch(setBookingFlight({ ...flight, data }));

    return data[0];
  };

  const searchHotels = async (flight: TFlightItemData) => {
    if (!flight) {
      Alert.alert("Flight Not Selected", "Please select a flight first.");
      return null;
    }

    const flightArrivalDate = flight.arrivalDate;
    console.log("flightArrivalDate: ", flightArrivalDate);

    const flightArrival = new Date(flightArrivalDate);
    const flightArrivalDateTime = normalizeDateUTC(flightArrival);
    const eventOpeningDateTime = normalizeDateUTC(
      new Date(event.opening_date as any)
    );

    if (flightArrivalDateTime > eventOpeningDateTime) {
      Alert.alert(
        "Invalid Flight Arrival Date",
        "The flight arrival date cannot be before the event date."
      );
      return null;
    }

    const checkout = new Date(event.opening_date as any);
    checkout.setDate(checkout.getDate() + 1);

    const params = {
      type: packageType,
      eventId: event._id,
      checkInDate: formatBookingDate(flightArrival),
      checkOutDate: formatBookingDate(checkout),
      adults: 1,
      roomQuantity: hotel.rooms,
    };

    const response = await fetchHotelOffers(params);

    if (!response.data) {
      return null;
    }

    const data = response.data.map((offer: TAmadeusHotelOffer) =>
      mapAmadeusHotelOfferToHotelItemData(offer)
    );

    dispatch(setBookingHotel({ ...rdHotel, data }));
  };

  const searchTransfers = async (
    hotelRecommend: any,
    hotelSessionId: any,
    flightRecommend: any
  ) => {
    if (!flightRecommend) {
      Alert.alert("Flight Not Selected");
      return;
    }
    if (!hotelRecommend) {
      Alert.alert("Hotel Not Selected");
      return;
    }

    const flightArrivalDate =
      flightRecommend?.FareItinerary?.OriginDestinationOptions[0]
        ?.OriginDestinationOption[
        flightRecommend?.FareItinerary?.OriginDestinationOptions[0]
          ?.OriginDestinationOption.length - 1
      ]?.FlightSegment.ArrivalDateTime;
    const flightArrival = new Date(flightArrivalDate);
    const flightArrivalDateTime = normalizeDateUTC(flightArrival);
    const hotelDepartureDateTime = normalizeDateUTC(hotelDepartureDate);

    if (flightArrivalDateTime > hotelDepartureDateTime) {
      Alert.alert(
        "Invalid Hotel Departure Date",
        "The hotel departure date cannot be before the flight arrival date."
      );
      return;
    }

    const lastSegment =
      flightRecommend?.FareItinerary?.OriginDestinationOptions[0]?.OriginDestinationOption?.slice(
        -1
      )[0];

    const arrivalDate = lastSegment?.FlightSegment.ArrivalDateTime;

    const reqData = {
      ahTransfer: {
        airportCode: lastSegment?.FlightSegment.ArrivalAirportLocationCode,
        hotel: {
          hotelId: hotelRecommend.hotelId,
          tokenId: hotelRecommend.tokenId,
          sessionId: hotelSessionId,
          productId: hotelRecommend.productId,
        },
        arrivalDate,
        adults: hotel.data.reduce((sum, room) => sum + room.adults, 0),
        childs: hotel.data.reduce((sum, room) => sum + room.childs, 0),
        infants,
      },
      heTransfer: {
        hotel: {
          hotelId: hotelRecommend.hotelId,
          tokenId: hotelRecommend.tokenId,
          sessionId: hotelSessionId,
          productId: hotelRecommend.productId,
        },
        arrivalDate: event.opening_date,
        adults: hotel.data.reduce((sum, room) => sum + room.adults, 0),
        childs: hotel.data.reduce((sum, room) => sum + room.childs, 0),
        infants,
        pickupDate: formatTravelproDateTime(hotelDepartureDate).date,
        pickupTime: formatTravelproDateTime(hotelDepartureDate).time,
      },
      packageType,
    };

    const response = await fetchTransfersAvailability(
      event._id as string,
      reqData
    );

    if (response.data.ah.error) {
      return Alert.alert(
        "Transfer from airport to hotel",
        response.data.ah.error
      );
    }

    if (response.data.he.error) {
      return Alert.alert(
        "Transfer from hotel to event",
        response.data.he.error
      );
    }

    console.log("Transfer available response: ", response.data);

    dispatch(setBookingTransfer(response.data));
  };

  const handleSearch = async () => {
    dispatch(setBookingFlight(null));
    dispatch(setBookingHotel(null));
    if (!event._id) return Alert.alert("Event ID is missing.");

    const eventDateTime = normalizeDateUTC(new Date(event.opening_date as any));
    const departureDateTime = normalizeDateUTC(departureDate);

    const hotelDepartureDateTime = normalizeDateUTC(hotelDepartureDate);

    if (eventDateTime < departureDateTime) {
      return Alert.alert(
        "Invalid Departure Date",
        "The departure date cannot be after the event date."
      );
    }

    if (hotelDepartureDateTime > eventDateTime) {
      Alert.alert(
        "Invalid Hotel Departure Date",
        "The hotel departure date cannot be after the event date."
      );
      return;
    }

    try {
      setSearchLoading(true);
      setIsSearched(false);

      setSearchBtnLabel("Searching flights...");
      const flightData = await searchFlights();
      if (!flightData) throw new Error("No flight found");

      setSearchBtnLabel("Searching hotels...");
      const hotelData = await searchHotels(flightData);
      if (!hotelData) throw new Error("No hotel found");

      // setSearchBtnLabel("Searching transfers...");
      // await searchTransfers(
      //   hotelResult.hotelRecommend,
      //   hotelResult.hotelSessionId,
      //   flightRecommend
      // );
    } catch (error) {
      console.log("handleSearch error: ", error);
    } finally {
      setSearchLoading(false);
      setSearchBtnLabel("");
      setIsSearched(true);
    }
  };

  if (loading) {
    return <Spinner size="md" />;
  }

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

            {/* {departureLocation === "current" && (
              <View className="px-2 mt-2">
                {currentNearestAirports.map((airport, index) => (
                  <Text
                    key={`current-location-nearest-airport-${index}`}
                    className="line-clamp-2 text-gray-600 font-dm-sans-medium text-xs"
                  >
                    {index + 1}. {airport.name}
                  </Text>
                ))}
              </View>
            )} */}
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
                  Home region / Saved location ({user?.location.region},{" "}
                  {user?.location.country_code || ""})
                </Text>
              </View>

              <RadioButton
                checked={departureLocation === "home"}
                onPress={() => setDepartureLocation("home")}
              />
            </View>

            {/* {departureLocation === "home" && (
              <View className="px-2 mt-2">
                {homeNearestAirports.map((airport, index) => (
                  <Text
                    key={`current-location-nearest-airport-${index}`}
                    className="line-clamp-2 text-gray-600 font-dm-sans-medium text-xs"
                  >
                    {index + 1}. {airport.name}
                  </Text>
                ))}
              </View>
            )} */}
          </View>
        </View>
      </View>
      <View className="w-full h-[1px] bg-gray-200"></View>
      <DateTimePicker
        label="Tell us when you will leave the airport in your location"
        className="rounded-md"
        value={departureDate}
        onPick={setDepartureDate}
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
          Hotel Rooms
        </Text>

        <View className="flex flex-row items-center gap-4">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
            disabled={hotel.rooms <= 1}
            onPress={() => {
              const newData = hotel.data.slice(0, -1);
              setHotel({
                ...hotel,
                rooms: hotel.rooms - 1,
                data: newData,
              });
            }}
          >
            <Entypo name="minus" size={14} color="#1f2937" />
          </TouchableOpacity>
          <Text className="font-poppins-semibold text-gray-800">
            {hotel.rooms}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
            disabled={hotel.rooms >= 5}
            onPress={() =>
              setHotel({
                ...hotel,
                rooms: hotel.rooms + 1,
                data: [...hotel.data, { adults: 1, childs: 0, child_age: [] }],
              })
            }
          >
            <Entypo name="plus" size={14} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* <View className="w-full flex flex-row items-center justify-between">
        <Text className="font-dm-sans-medium text-sm text-gray-600">
          Infant{" "}
          <Text className="font-poppins-medium text-gray-500">(0-2 years)</Text>
        </Text>

        <View className="flex flex-row items-center gap-4">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
            disabled={infants <= 0}
            onPress={() => setInfants(infants - 1)}
          >
            <Entypo name="minus" size={14} color="#1f2937" />
          </TouchableOpacity>
          <Text className="font-poppins-semibold text-gray-800">{infants}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
            disabled={infants >= 1}
            onPress={() => setInfants(infants + 1)}
          >
            <Entypo name="plus" size={14} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View> */}

      {hotel.data.map((dt, index) => (
        <View key={index} className="w-full gap-4">
          <View className="w-full h-[1px] bg-gray-200"></View>

          <Text className="font-poppins-semibold text-sm text-gray-700">
            Room No {index + 1}
          </Text>

          <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Adults{" "}
              <Text className="font-poppins-medium text-gray-500">
                (12 years+)
              </Text>
            </Text>

            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={dt.adults <= 1}
                onPress={() =>
                  setHotel({
                    ...hotel,
                    data: hotel.data.map((da, i) =>
                      i === index ? { ...da, adults: da.adults - 1 } : da
                    ),
                  })
                }
              >
                <Entypo name="minus" size={14} color="#1f2937" />
              </TouchableOpacity>
              <Text className="font-poppins-semibold text-gray-800">
                {dt.adults}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={dt.adults >= 8}
                onPress={() =>
                  setHotel({
                    ...hotel,
                    data: hotel.data.map((da, i) =>
                      i === index ? { ...da, adults: da.adults + 1 } : da
                    ),
                  })
                }
              >
                <Entypo name="plus" size={14} color="#1f2937" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Children */}
          {/* <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Children{" "}
              <Text className="font-poppins-medium text-gray-500">
                (2-11 years)
              </Text>
            </Text>

            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={dt.childs <= 0}
                onPress={() =>
                  setHotel({
                    ...hotel,
                    data: hotel.data.map((da, i) =>
                      i === index
                        ? {
                            ...da,
                            childs: da.childs - 1,
                            child_age: da.child_age.slice(0, -1),
                          }
                        : da
                    ),
                  })
                }
              >
                <Entypo name="minus" size={14} color="#1f2937" />
              </TouchableOpacity>

              <Text className="font-poppins-semibold text-gray-800">
                {dt.childs}
              </Text>

              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={dt.childs >= 4}
                onPress={() =>
                  setHotel({
                    ...hotel,
                    data: hotel.data.map((da, i) =>
                      i === index
                        ? {
                            ...da,
                            childs: da.childs + 1,
                            child_age: [...da.child_age, 2], // default age
                          }
                        : da
                    ),
                  })
                }
              >
                <Entypo name="plus" size={14} color="#1f2937" />
              </TouchableOpacity>
            </View>
          </View> */}

          {/* Children Age */}
          {/* {dt.child_age.map((age: any, childIndex: number) => (
            <View
              key={childIndex}
              className="w-full flex flex-row items-center justify-between pl-4"
            >
              <Text className="font-dm-sans-medium text-sm text-gray-600">
                Child {childIndex + 1} Age
              </Text>

              <View className="flex flex-row items-center gap-4">
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                  disabled={age <= 2}
                  onPress={() =>
                    setHotel({
                      ...hotel,
                      data: hotel.data.map((da, i) =>
                        i === index
                          ? {
                              ...da,
                              child_age: da.child_age.map((ag: any, ai: any) =>
                                ai === childIndex ? ag - 1 : ag
                              ),
                            }
                          : da
                      ),
                    })
                  }
                >
                  <Entypo name="minus" size={14} color="#1f2937" />
                </TouchableOpacity>

                <Text className="font-poppins-semibold text-gray-800">
                  {age}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                  disabled={age >= 11}
                  onPress={() =>
                    setHotel({
                      ...hotel,
                      data: hotel.data.map((da, i) =>
                        i === index
                          ? {
                              ...da,
                              child_age: da.child_age.map((ag: any, ai: any) =>
                                ai === childIndex ? ag + 1 : ag
                              ),
                            }
                          : da
                      ),
                    })
                  }
                >
                  <Entypo name="plus" size={14} color="#1f2937" />
                </TouchableOpacity>
              </View>
            </View>
          ))} */}
        </View>
      ))}

      {isSearched && (
        <>
          <View className="w-full h-[1px] bg-gray-200"></View>

          <FlightAvailabilityGroup
            selected={flight?.data[0]}
            items={flight?.data || []}
            isSearched={isSearched}
            onSelect={(availability: TFlightItemData) => {
              if (flight) {
                dispatch(setBookingFlight({ ...flight }));
              }
            }}
          />
        </>
      )}

      {isSearched && (
        <>
          <View className="w-full h-[1px] bg-gray-200"></View>

          <HotelAvailabilityGroup
            items={rdHotel?.data || []}
            selected={rdHotel?.data[0]}
            isSearched={isSearched}
            onSelect={(selected: THotelItemData) => {
              if (rdHotel) {
                const reorderedData = [
                  selected,
                  ...rdHotel.data.filter(
                    (item) => item.hotelId !== selected.hotelId
                  ),
                ];
                dispatch(setBookingHotel({ ...rdHotel, data: reorderedData }));
              }
            }}
          />
        </>
      )}

      {isSearched && (
        <>
          <View className="w-full h-[1px] bg-gray-200"></View>

          <TransferAvailabilityGroup
            transfer={rdTransfer}
            isSearched={isSearched}
            available={true}
          />
        </>
      )}

      <View className="w-full h-[1px] bg-gray-200"></View>

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
