import { fetchNearestAirports } from "@/api/scripts/airports";
import {
  fetchStandardFlightsAvailability,
  fetchStandardHotelsAvailability,
  fetchStandardTransfersAvailability,
} from "@/api/scripts/booking";
import {
  setBookingFlight,
  setBookingHotel,
} from "@/redux/slices/booking.slice";
import { RootState } from "@/redux/store";
import {
  IFlightDetail,
  TAirport,
  TFlightAvailability,
  THotelAvailability,
  TPassengerInfo,
} from "@/types";
import { IEvent } from "@/types/data";
import { normalizeDate } from "@/utils/format";
import { Entypo } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button, DateTimePicker, Spinner } from "../common";
import FlightAvailabilityGroup from "./FlightAvailabilityGroup";
import HotelAvailabilityGroup from "./HotelAvailabilityGroup";

interface BookSearchInputGroupProps {
  event: IEvent;
}

const BookSearchInputGroup: React.FC<BookSearchInputGroupProps> = ({
  event,
}) => {
  const [currentNearestAirports, setCurrentNearestAirports] = useState<
    TAirport[]
  >([]);
  const [originalNearestAirports, setOriginalNearestAirports] = useState<
    TAirport[]
  >([]);
  const [departureLocation, setDepartureLocation] = useState<
    "current" | "origin"
  >("current");
  const [departureDate, setDepartureDate] = useState<Date>(new Date());
  const [hotel, setHotel] = useState<{ rooms: number; data: any[] }>({
    rooms: 1,
    data: [{ adults: 1, childs: 0, child_age: [] }],
  });
  const [infants, setInfants] = useState<number>(0);
  const [searchBtnLabel, setSearchBtnLabel] = useState<string>("");
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const { flight, hotel: rdHotel } = useSelector(
    (state: RootState) => state.booking
  );
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

    const coords = await getUserLocationAndSave();

    const currentNearestAirports = await fetchNearestAirports(
      coords.latitude,
      coords.longitude
    );

    if (currentNearestAirports.data) {
      setCurrentNearestAirports(currentNearestAirports.data);
    }

    const originalNearestAirports = await fetchNearestAirports(
      user.location.coordinate.latitude,
      user.location.coordinate.longitude
    );

    if (originalNearestAirports.data) {
      setOriginalNearestAirports(originalNearestAirports.data);
    }
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

  const searchFlights = async () => {
    const payload = {
      departureDate,
      adults: hotel.data.reduce((sum, room) => sum + room.adults, 0),
      childs: hotel.data.reduce((sum, room) => sum + room.childs, 0),
      infants,
    };

    const response = await fetchStandardFlightsAvailability(
      event._id as string,
      payload
    );

    const { recommend } = response.data;
    if (!recommend) return null;

    const initialFlightDetails: IFlightDetail = {
      paxInfo: {
        customerEmail: "",
        customerPhone: "",
        bookingNote: "",
      },
      paxDetails: {
        adults: Array.from({ length: payload.adults }, createEmptyPassenger),
        child: Array.from({ length: payload.childs }, createEmptyPassenger),
        infant: Array.from({ length: payload.infants }, createEmptyPassenger),
      },
    };

    dispatch(
      setBookingFlight({
        ...response.data,
        recommend: { ...recommend, details: initialFlightDetails },
      })
    );

    return recommend;
  };

  const searchHotels = async (flightRecommend: any) => {
    if (!flightRecommend) {
      Alert.alert("Flight Not Selected", "Please select a flight first.");
      return null;
    }

    const flightArrivalDate =
      flightRecommend?.FareItinerary?.OriginDestinationOptions[0]
        ?.OriginDestinationOption[
        flightRecommend?.FareItinerary?.OriginDestinationOptions[0]
          ?.OriginDestinationOption.length - 1
      ]?.FlightSegment.ArrivalDateTime;

    const flightArrival = new Date(flightArrivalDate);
    const flightArrivalDateTime = normalizeDate(flightArrival);

    console.log("flightArrivalDateTime:", flightArrivalDateTime);
    console.log(
      "event.opening_date:",
      normalizeDate(new Date(event.opening_date as any))
    );

    if (
      flightArrivalDateTime < normalizeDate(new Date(event.opening_date as any))
    ) {
      Alert.alert(
        "Invalid Flight Arrival Date",
        "The flight arrival date cannot be before the event date."
      );
      return null;
    }

    const formattedHotelRooms = formatHotelRooms(hotel);
    const initialPaxDetails = buildInitialPaxDetails(formattedHotelRooms);

    const checkout = new Date(event.opening_date as any);
    checkout.setDate(checkout.getDate() + 1);

    const response = await fetchStandardHotelsAvailability(
      event._id as string,
      formattedHotelRooms,
      flightArrival,
      checkout
    );

    const hotelRecommend = response.data?.recommend;
    if (!hotelRecommend) return null;

    dispatch(
      setBookingHotel({
        ...response.data,
        checkin: flightArrival.toISOString(),
        checkout: checkout.toISOString(),
        bookingRequest: {
          customerEmail: "",
          customerPhone: "",
          rateBasisId: "",
          paxDetails: initialPaxDetails,
          sessionId: response.data.session_id,
          hotelId: hotelRecommend.hotelId,
          productId: hotelRecommend.productId,
          tokenId: hotelRecommend.tokenId,
        },
      })
    );

    return { hotelRecommend, hotelSessionId: response.data?.session_id };
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
      },
      heTransfer: {
        hotel: {
          hotelId: hotelRecommend.hotelId,
          tokenId: hotelRecommend.tokenId,
          sessionId: hotelSessionId,
          productId: hotelRecommend.productId,
        },
        arrivalDate: event.opening_date,
      },
    };

    const response = await fetchStandardTransfersAvailability(
      event._id as string,
      reqData
    );

    console.log("transfers availability response: ", response);
  };

  const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const handleSearch = async () => {
    if (!event._id) return Alert.alert("Event ID is missing.");

    const eventDateTime = normalizeDate(new Date(event.opening_date as any));
    const departureDateTime = normalizeDate(departureDate);

    if (eventDateTime < departureDateTime) {
      return Alert.alert(
        "Invalid Departure Date",
        "The departure date cannot be after the event date."
      );
    }

    try {
      setSearchLoading(true);
      setIsSearched(false);

      setSearchBtnLabel("Searching flights...");
      const flightRecommend = await searchFlights();
      if (!flightRecommend) throw new Error("No flight found");

      setSearchBtnLabel("Searching hotels...");
      const hotelResult = await searchHotels(flightRecommend);
      if (!hotelResult?.hotelRecommend) throw new Error("No hotel found");

      setSearchBtnLabel("Searching transfers...");
      await searchTransfers(
        hotelResult.hotelRecommend,
        hotelResult.hotelSessionId,
        flightRecommend
      );
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
      <View className="w-full"></View>
      <DateTimePicker
        label="Tell us when you will depart"
        className="rounded-md"
        value={departureDate}
        onPick={setDepartureDate}
      />

      <View className="w-full h-[1px] bg-gray-200"></View>
      <Text className="font-poppins-medium text-sm text-gray-700">
        Tell us who’s traveling and how many rooms you need.
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

      <View className="w-full flex flex-row items-center justify-between">
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
      </View>

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
          <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Children{" "}
              <Text className="font-poppins-medium text-gray-500">
                (2-11 years)
              </Text>
            </Text>

            <View className="flex flex-row items-center gap-4">
              {/* minus child */}
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

              {/* add child */}
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
          </View>

          {/* Children Age */}
          {dt.child_age.map((age: any, childIndex: number) => (
            <View
              key={childIndex}
              className="w-full flex flex-row items-center justify-between pl-4"
            >
              <Text className="font-dm-sans-medium text-sm text-gray-600">
                Child {childIndex + 1} Age
              </Text>

              <View className="flex flex-row items-center gap-4">
                {/* minus age */}
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

                {/* plus age */}
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
          ))}
        </View>
      ))}

      {isSearched && (
        <>
          <View className="w-full h-[1px] bg-gray-200"></View>

          <FlightAvailabilityGroup
            recommend={flight?.recommend}
            availabilities={flight?.availabilities || []}
            isSearched={isSearched}
            onSelect={(availability: TFlightAvailability) => {
              if (flight) {
                dispatch(
                  setBookingFlight({ ...flight, recommend: availability })
                );
              }
            }}
          />
        </>
      )}

      {isSearched && (
        <>
          <View className="w-full h-[1px] bg-gray-200"></View>

          <HotelAvailabilityGroup
            sessionId={rdHotel?.session_id}
            recommend={rdHotel?.recommend}
            availabilities={rdHotel?.availabilities || []}
            isSearched={isSearched}
            onSelect={(availability: THotelAvailability) => {
              if (rdHotel) {
                dispatch(
                  setBookingHotel({
                    ...rdHotel,
                    recommend: availability,
                  })
                );
              }
            }}
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
