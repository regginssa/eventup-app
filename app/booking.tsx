import {
  checkHotelRoomRates,
  validateFlightFareMethod,
} from "@/api/scripts/booking";
import { fetchEvent } from "@/api/scripts/event";
import {
  Button,
  FlightItem,
  HotelItem,
  Input,
  Modal,
  Spinner,
  Textarea,
} from "@/components/common";
import {
  HotelGuestGroup,
  HotelRoomSelector,
  PassengerInputGroup,
} from "@/components/molecules";
import BookingContainer from "@/components/organisms/BookingContainer";
import { setBookingFlight } from "@/redux/slices/booking.slice";
import { RootState } from "@/redux/store";
import {
  TFlight,
  TFlightAvailability,
  THotel,
  THotelBookingRequest,
  THotelGuestGroup,
  THotelPaxDetail,
  TPassengerInfo,
  TPaxDetails,
} from "@/types";
import { IEvent } from "@/types/data";
import { formatEventDate } from "@/utils/format";
import {
  Feather,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const EventDetail = ({
  loading,
  event,
}: {
  loading: boolean;
  event: IEvent | null;
}) => {
  return (
    <View className="w-full bg-white rounded-xl p-4 gap-6">
      {loading ? (
        <View className="w-full h-40 flex flex-col items-center justify-center">
          <Spinner size="md" text="Loading Event Details..." />
        </View>
      ) : !event ? (
        <View className="flex-1 items-center justify-center">
          <View className="flex-1 items-center justify-center gap-2">
            <MaterialCommunityIcons
              name="emoticon-sad-outline"
              size={24}
              color="#1f2937"
            />
            <Text className="text-gray-700 font-poppins-semibold text-sm">
              No event data
            </Text>
          </View>
        </View>
      ) : (
        <>
          <View className="w-full flex flex-row items-center gap-4 overflow-hidden">
            <Image
              source={event.image}
              contentFit="cover"
              style={{ width: 100, height: 100, borderRadius: 6 }}
            />
            <View className="gap-4 flex-1">
              <Text className="font-poppins-semibold text-gray-700 line-clamp-2">
                {event.title}
              </Text>

              <View className="gap-2">
                <View className="flex flex-row items-center gap-2">
                  <Fontisto name="map-marker-alt" size={20} color="#374151" />
                  <Text className="font-dm-sans-medium text-sm text-gray-700">
                    {event?.venue?.city
                      ? `${event.venue.city}, ${event.country}`
                      : event?.country}
                  </Text>
                </View>
                <View className="flex flex-row items-center gap-2">
                  <Ionicons name="calendar-outline" size={16} color="#374151" />
                  <Text className="font-dm-sans-medium text-sm text-gray-700">
                    {formatEventDate(event?.opening_date as Date)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const FlightForm = ({
  flight,
  email,
  phone,
  note,
  paxDetails,
  setEmail,
  setPhone,
  setNote,
  setPaxDetails,
}: {
  flight: TFlight | null;
  email: string;
  phone: string;
  note: string;
  paxDetails: TPaxDetails | undefined;
  setEmail: (val: string) => void;
  setPhone: (val: string) => void;
  setNote: (val: string) => void;
  setPaxDetails: React.Dispatch<React.SetStateAction<TPaxDetails | undefined>>;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  const selected = flight?.recommend;

  const handlePaxChange = (
    type: "adults" | "child" | "infant",
    idx: number,
    val: any,
    label: keyof TPassengerInfo
  ) => {
    setPaxDetails((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        [type]: prev[type].map((p, i) =>
          i === idx ? { ...p, [label]: val } : p
        ),
      };
    });
  };

  return (
    <View className="w-full bg-white rounded-xl p-4 gap-6">
      <TouchableOpacity
        activeOpacity={0.8}
        className="w-full flex flex-row items-center justify-between"
        onPress={() => setIsOpen(!isOpen)}
      >
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons name="airplane" size={20} color="#374151" />
          <Text className="font-dm-sans-bold text-gray-700">Flight</Text>
        </View>

        <Feather
          name={`chevron-${isOpen ? "up" : "down"}`}
          size={24}
          color="#374151"
        />
      </TouchableOpacity>

      {isOpen && (
        <View className="w-full flex flex-col gap-3">
          <View className="w-full flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-1">
              <MaterialIcons name="edit-note" size={18} color="#374151" />
              <Text className="font-poppins-semibold text-gray-700 text-sm">
                Booking Information
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              className=""
              onPress={() => setIsDetailOpen(true)}
            >
              <Text className="font-poppins-semibold text-gray-700 text-xs">
                View details
              </Text>
            </TouchableOpacity>
          </View>

          {paxDetails && (
            <PassengerInputGroup
              type="adult"
              items={paxDetails?.adults ?? []}
              onChange={(i, val, label) =>
                handlePaxChange("adults", i, val, label)
              }
            />
          )}

          {paxDetails && (
            <PassengerInputGroup
              type="child"
              items={paxDetails?.child ?? []}
              onChange={(i, val, label) =>
                handlePaxChange("child", i, val, label)
              }
            />
          )}

          {paxDetails && (
            <PassengerInputGroup
              type="infant"
              items={paxDetails?.infant ?? []}
              onChange={(i, val, label) =>
                handlePaxChange("infant", i, val, label)
              }
            />
          )}

          <View className="w-full h-[1px] bg-gray-200"></View>
          {paxDetails ? (
            <View className="w-full">
              <View className="flex flex-row items-center gap-1">
                <MaterialCommunityIcons
                  name="account-outline"
                  size={18}
                  color="#374151"
                />
                <Text className="font-poppins-semibold text-sm text-gray-700">
                  Customer Information
                </Text>
              </View>
              <View className="w-full p-4 flex flex-col gap-3">
                <Input
                  type="string"
                  label="Customer email"
                  placeholder="you@example.com"
                  bordered={true}
                  className="rounded-lg"
                  value={email}
                  onChange={setEmail}
                />
                <Input
                  type="string"
                  label="Customer phone"
                  placeholder="+4811422424"
                  bordered={true}
                  className="rounded-lg"
                  value={phone}
                  onChange={setPhone}
                />
                <Textarea
                  label="Booking note"
                  placeholder="Note your booking"
                  bordered={true}
                  className="rounded-lg"
                  value={note}
                  onChange={setNote}
                />
              </View>
            </View>
          ) : (
            <View className="w-full flex flex-col items-center justify-center gap-2">
              <MaterialCommunityIcons
                name="airplane-off"
                size={24}
                color="#4b5563"
              />
              <Text className="font-poppins-semibold text-gray-600">
                No Flight
              </Text>
            </View>
          )}
        </View>
      )}

      <Modal
        title="Flight Details"
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        scrolled={true}
      >
        {!selected ? (
          <View className="w-full flex flex-col items-center justify-center gap-2">
            <MaterialCommunityIcons
              name="airplane-off"
              size={24}
              color="#4b5563"
            />
            <Text className="font-poppins-semibold text-gray-600">
              No Flight
            </Text>
          </View>
        ) : (
          <FlightItem flight={selected} hiddenHeader={true} />
        )}
      </Modal>
    </View>
  );
};

const HotelForm = ({
  hotel,
  email,
  phone,
  note,
  paxDetails,
  selectedRooms,
  setSelectedRooms,
  setEmail,
  setPhone,
  setNote,
  setPaxDetails,
}: {
  hotel: THotel | null;
  email: string;
  phone: string;
  note: string;
  paxDetails: THotelPaxDetail[];
  selectedRooms: number[];
  setSelectedRooms: (val: number[]) => void;
  setEmail: (val: string) => void;
  setPhone: (val: string) => void;
  setNote: (val: string) => void;
  setPaxDetails: React.Dispatch<React.SetStateAction<THotelPaxDetail[]>>;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);

  const selected = hotel?.recommend;

  const handleSelect = (roomNo: number, index: number) => {
    const updated = [...selectedRooms];
    updated[roomNo] = index;
    setSelectedRooms(updated);
  };

  return (
    <View className="w-full bg-white rounded-xl p-4 gap-6">
      <TouchableOpacity
        activeOpacity={0.8}
        className="w-full flex flex-row items-center justify-between"
        onPress={() => setIsOpen(!isOpen)}
      >
        <View className="flex flex-row items-center gap-2">
          <MaterialIcons name="hotel" size={20} color="#374151" />
          <Text className="font-dm-sans-bold text-gray-700">Hotel</Text>
        </View>

        <Feather
          name={`chevron-${isOpen ? "up" : "down"}`}
          size={24}
          color="#374151"
        />
      </TouchableOpacity>

      {isOpen && (
        <View className="w-full flex flex-col gap-3">
          <View className="w-full flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-1">
              <MaterialIcons name="edit-note" size={18} color="#374151" />
              <Text className="font-poppins-semibold text-gray-700 text-sm">
                Booking Information
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              className=""
              onPress={() => setIsDetailOpen(true)}
            >
              <Text className="font-poppins-semibold text-gray-700 text-xs">
                View details
              </Text>
            </TouchableOpacity>
          </View>

          {paxDetails.length > 0 && (
            <HotelGuestGroup items={paxDetails} onChange={setPaxDetails} />
          )}

          {selected?.roomRates && (
            <>
              <View className="w-full h-[1px] bg-gray-200 mt-4 mb-4"></View>
              {/* Room Details */}

              <View className="">
                <View className="flex flex-row items-center gap-1">
                  <Fontisto name="room" size={18} color="#374151" />
                  <Text className="font-poppins-semibold text-sm text-gray-700">
                    Rooms details
                  </Text>
                </View>

                <HotelRoomSelector
                  paxCount={1}
                  rooms={selected.roomRates}
                  selectedRooms={selectedRooms}
                  onSelect={handleSelect}
                />
              </View>
            </>
          )}

          <View className="w-full h-[1px] bg-gray-200 mt-4 mb-4"></View>
          {paxDetails.length > 0 ? (
            <View className="w-full">
              <View className="flex flex-row items-center gap-1">
                <MaterialCommunityIcons
                  name="account-outline"
                  size={18}
                  color="#374151"
                />
                <Text className="font-poppins-semibold text-sm text-gray-700">
                  Customer Information
                </Text>
              </View>
              <View className="w-full p-4 flex flex-col gap-3">
                <Input
                  type="string"
                  label="Customer email"
                  placeholder="you@example.com"
                  bordered={true}
                  className="rounded-lg"
                  value={email}
                  onChange={setEmail}
                />
                <Input
                  type="string"
                  label="Customer phone"
                  placeholder="+4811422424"
                  bordered={true}
                  className="rounded-lg"
                  value={phone}
                  onChange={setPhone}
                />
                <Textarea
                  label="Booking note"
                  placeholder="Note your booking"
                  bordered={true}
                  className="rounded-lg"
                  value={note}
                  onChange={setNote}
                />
              </View>
            </View>
          ) : (
            <View className="w-full flex flex-col items-center justify-center gap-2">
              <MaterialCommunityIcons
                name="bank-off-outline"
                size={24}
                color="#4b5563"
              />
              <Text className="font-poppins-semibold text-gray-600">
                No Hotel
              </Text>
            </View>
          )}
        </View>
      )}

      <Modal
        title="Hotel Details"
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        scrolled={true}
      >
        {!selected ? (
          <View className="w-full flex flex-col items-center justify-center gap-2">
            <MaterialCommunityIcons
              name="bank-off-outline"
              size={24}
              color="#4b5563"
            />
            <Text className="font-poppins-semibold text-gray-600">
              No Hotel
            </Text>
          </View>
        ) : (
          <HotelItem hotel={selected} hiddenHeader={true} />
        )}
      </Modal>
    </View>
  );
};

const BookingScreen = () => {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [flightCustomerEmail, setFlightCustomerEmail] = useState<string>("");
  const [flightCustomerPhone, setFlightCustomerPhone] = useState<string>("");
  const [flightBookingNote, setFlightBookingNote] = useState<string>("");
  const [flightPaxDetails, setFlightPaxDetails] = useState<
    TPaxDetails | undefined
  >(undefined);

  const [hotelCustomerEmail, setHotelCustomerEmail] = useState<string>("");
  const [hotelCustomerPhone, setHotelCustomerPhone] = useState<string>("");
  const [hotelBookingNote, setHotelBookingNote] = useState<string>("");
  const [hotelPaxDetails, setHotelPaxDetails] = useState<THotelPaxDetail[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [isCheckLoading, setIsCheckLoading] = useState<boolean>(false);

  const { eventId, packageType } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { flight, hotel } = useSelector((state: RootState) => state.booking);

  const dispatch = useDispatch();

  const init = useCallback(async () => {
    if (!eventId || typeof eventId !== "string") return;

    try {
      setLoading(true);

      const response = await fetchEvent(eventId);

      setEvent(response.data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (flight?.recommend?.details?.paxDetails) {
      setFlightPaxDetails(flight.recommend.details.paxDetails);
    }

    if (hotel?.bookingRequest.paxDetails) {
      setHotelPaxDetails(hotel.bookingRequest.paxDetails);
    }
  }, [
    flight?.recommend?.details?.paxDetails,
    hotel?.bookingRequest.paxDetails,
  ]);

  type ValidateResult = { valid: true } | { valid: false; message: string };

  const validate = (
    flight: TFlight | null,
    paxDetails: TPaxDetails | undefined,
    hotel: THotel | null,
    hotelPaxDetails: THotelPaxDetail[],
    selectedRooms: number[],
    hotelCustomerEmail: string,
    hotelCustomerPhone: string
  ): ValidateResult => {
    /** --------------------- FLIGHT VALIDATION --------------------- **/
    if (flight?.recommend) {
      if (!paxDetails)
        return { valid: false, message: "Passenger details missing" };

      const adultTitles = ["Mr", "Mrs"];
      const childTitles = ["Master", "Miss"];

      const validatePassenger = (
        p: TPassengerInfo,
        type: "adults" | "child" | "infant"
      ) => {
        if (
          !p.firstName?.trim() ||
          !p.lastName?.trim() ||
          !p.nationality?.trim()
        )
          return { ok: false, reason: "Required fields missing" };

        if (type === "adults") {
          if (!adultTitles.includes(p.title))
            return { ok: false, reason: "Invalid title for adult" };
        } else {
          if (!childTitles.includes(p.title))
            return { ok: false, reason: "Invalid title for child/infant" };
        }

        return { ok: true };
      };

      const groups: (keyof TPaxDetails)[] = ["adults", "child", "infant"];
      for (const group of groups) {
        for (let i = 0; i < paxDetails[group].length; i++) {
          const res = validatePassenger(paxDetails[group][i], group);
          if (!res.ok)
            return {
              valid: false,
              message: `FLIGHT — ${group.slice(0, -1).toUpperCase()} ${
                i + 1
              }: ${res.reason}`,
            };
        }
      }
    }

    /** --------------------- HOTEL VALIDATION --------------------- **/
    if (hotel?.recommend) {
      // 1 selected room only
      if (selectedRooms.length !== 1) {
        return { valid: false, message: "Please select exactly 1 hotel room" };
      }

      if (!hotelPaxDetails?.length) {
        return { valid: false, message: "Hotel guest details missing" };
      }

      for (let r = 0; r < hotelPaxDetails.length; r++) {
        const room = hotelPaxDetails[r];

        const validateGroup = (
          g?: THotelGuestGroup,
          type?: "Adult" | "Child"
        ) => {
          if (!g) return;

          const len = g.firstName.length;
          for (let i = 0; i < len; i++) {
            if (
              !g.title[i]?.trim() ||
              !g.firstName[i]?.trim() ||
              !g.lastName[i]?.trim()
            ) {
              throw `HOTEL — Room ${room.room_no} ${type} ${
                i + 1
              }: Required fields missing`;
            }
          }
        };

        try {
          validateGroup(room.adult, "Adult");
          validateGroup(room.child, "Child");
        } catch (message: any) {
          return { valid: false, message };
        }
      }

      if (!hotelCustomerEmail.trim()) {
        return { valid: false, message: "Hotel customer email is required" };
      }

      if (!hotelCustomerPhone.trim()) {
        return {
          valid: false,
          message: "Hotel customer phone number is required",
        };
      }
    }

    return { valid: true };
  };

  const buildRequestPayload = (
    sessionId: string,
    areaCode: string,
    countryCode: string,
    flight: TFlightAvailability,
    paxDetails: TPaxDetails,
    email: string,
    phone: string,
    bookingNote: string
  ) => {
    const group = (list: TPassengerInfo[], key: keyof TPassengerInfo) =>
      list.map((item) => item[key] ?? "");

    const paxFormatted = {
      adult: paxDetails.adults.length
        ? {
            title: group(paxDetails.adults, "title"),
            firstName: group(paxDetails.adults, "firstName"),
            lastName: group(paxDetails.adults, "lastName"),
            dob: group(paxDetails.adults, "dob"),
            nationality: group(paxDetails.adults, "nationality"),
            passportNo: group(paxDetails.adults, "passportNo"),
            passportIssueCountry: group(
              paxDetails.adults,
              "passportIssueCountry"
            ),
            passportExpiryDate: group(paxDetails.adults, "passportExpiryDate"),
          }
        : undefined,

      child: paxDetails.child.length
        ? {
            title: group(paxDetails.child, "title"),
            firstName: group(paxDetails.child, "firstName"),
            lastName: group(paxDetails.child, "lastName"),
            dob: group(paxDetails.child, "dob"),
            nationality: group(paxDetails.child, "nationality"),
            passportNo: group(paxDetails.child, "passportNo"),
            passportIssueCountry: group(
              paxDetails.child,
              "passportIssueCountry"
            ),
            passportExpiryDate: group(paxDetails.child, "passportExpiryDate"),
          }
        : undefined,

      infant: paxDetails.infant.length
        ? {
            title: group(paxDetails.infant, "title"),
            firstName: group(paxDetails.infant, "firstName"),
            lastName: group(paxDetails.infant, "lastName"),
            dob: group(paxDetails.infant, "dob"),
            nationality: group(paxDetails.infant, "nationality"),
            passportNo: group(paxDetails.infant, "passportNo"),
            passportIssueCountry: group(
              paxDetails.infant,
              "passportIssueCountry"
            ),
            passportExpiryDate: group(paxDetails.infant, "passportExpiryDate"),
          }
        : undefined,
    };

    return {
      flightBookingInfo: {
        flight_session_id: sessionId,
        fare_source_code:
          flight.FareItinerary.AirItineraryFareInfo.FareSourceCode,
        IsPassportMandatory: flight.FareItinerary.IsPassportMandatory ?? false,
        fareType: flight.FareItinerary.AirItineraryFareInfo.FareType,
        areaCode: areaCode ?? "",
        countryCode,
      },

      paxInfo: {
        customerEmail: email,
        customerPhone: phone,
        bookingNote,
        paxDetails: [paxFormatted],
      },
    };
  };

  const handleFlightCheckout = async () => {
    if (
      !flight?.session_id ||
      !flight.recommend.FareItinerary.AirItineraryFareInfo.FareSourceCode
    ) {
      return Alert.alert(
        "Invalid Flight Information",
        "Your Flight information is incorrect"
      );
    }

    const payload = buildRequestPayload(
      flight.session_id,
      user?.location.region_code as string,
      user?.location.country_code as string,
      flight?.recommend,
      flightPaxDetails!,
      flightCustomerEmail,
      flightCustomerPhone,
      flightBookingNote
    );

    try {
      setIsCheckLoading(true);

      const response = await validateFlightFareMethod(
        flight.session_id,
        flight.recommend.FareItinerary.AirItineraryFareInfo.FareSourceCode
      );

      const isValid = response.data;

      if (isValid) {
        dispatch(setBookingFlight({ ...flight, payload }));
        router.push({
          pathname: "/checkout",
          params: { eventId, packageType },
        });
      } else {
        Alert.alert(response.message);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      Alert.alert(message);
    } finally {
      setIsCheckLoading(false);
    }
  };

  const handleHotelCheckout = async () => {
    try {
      setIsCheckLoading(true);
      const bookingRequests: THotelBookingRequest = {
        sessionId: hotel?.session_id as string,
        paxDetails: hotelPaxDetails,
        customerEmail: hotelCustomerEmail,
        customerPhone: hotelCustomerPhone,
        bookingNote: hotelBookingNote,
        rateBasisId: hotel?.recommend?.roomRates[selectedRooms[0]]
          ?.rateBasisId as string,
        productId: hotel?.recommend?.productId as string,
        tokenId: hotel?.recommend?.tokenId as string,
      };

      const response = await checkHotelRoomRates({
        sessionId: bookingRequests.sessionId,
        productId: bookingRequests.productId,
        tokenId: bookingRequests.tokenId,
        rateBasisId: bookingRequests.rateBasisId,
      });

      console.log("check hotel room rates response: ", response);
    } catch (error: any) {
      const message = error?.response?.data?.message;
      Alert.alert(message);
    } finally {
      setIsCheckLoading(false);
    }
  };

  const handleCheckout = async () => {
    const result = validate(
      flight,
      flightPaxDetails,
      hotel,
      hotelPaxDetails,
      selectedRooms,
      hotelCustomerEmail,
      hotelCustomerPhone
    );
    if (!result.valid) return Alert.alert("Invalid Booking", result.message);

    if (flight?.recommend) {
      await handleFlightCheckout();
    }

    if (hotel?.recommend) {
      await handleHotelCheckout();
    }
  };

  return (
    <BookingContainer>
      <View className="flex-1 gap-4">
        <EventDetail loading={loading} event={event} />
        <FlightForm
          flight={flight}
          email={flightCustomerEmail}
          phone={flightCustomerPhone}
          note={flightBookingNote}
          setEmail={setFlightCustomerEmail}
          setPhone={setFlightCustomerPhone}
          setNote={setFlightBookingNote}
          paxDetails={flightPaxDetails}
          setPaxDetails={setFlightPaxDetails}
        />
        <HotelForm
          hotel={hotel}
          email={hotelCustomerEmail}
          phone={hotelCustomerPhone}
          note={hotelBookingNote}
          paxDetails={hotelPaxDetails}
          selectedRooms={selectedRooms}
          setSelectedRooms={setSelectedRooms}
          setEmail={setHotelCustomerEmail}
          setPhone={setHotelCustomerPhone}
          setNote={setHotelBookingNote}
          setPaxDetails={setHotelPaxDetails}
        />
      </View>

      <Button
        type="primary"
        label="Checkout"
        buttonClassName="h-12"
        loading={isCheckLoading}
        onPress={handleCheckout}
      />
    </BookingContainer>
  );
};

export default BookingScreen;
