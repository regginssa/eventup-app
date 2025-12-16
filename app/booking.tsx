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
import {
  setBookingFlight,
  setBookingHotel,
  setBookingHotelSelectedRoomRate,
  setBookingTransferBookingRequest,
} from "@/redux/slices/booking.slice";
import { RootState } from "@/redux/store";
import {
  ITransferAvailability,
  ITransferBookingRequest,
  ITransferPaxDetails,
  TFlight,
  TFlightAvailability,
  THotel,
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

const CustomerInfoForm = ({
  email,
  phone,
  note,
  setEmail,
  setPhone,
  setNote,
}: {
  email: string;
  phone: string;
  note: string;
  setEmail: (val: string) => void;
  setPhone: (val: string) => void;
  setNote: (val: string) => void;
}) => {
  return (
    <View className="w-full bg-white rounded-xl p-4">
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
  );
};

const FlightForm = ({
  flight,

  paxDetails,

  setPaxDetails,
}: {
  flight: TFlight | null;

  paxDetails: TPaxDetails | undefined;

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

  paxDetails,
  selectedRooms,
  setSelectedRooms,

  setPaxDetails,
}: {
  hotel: THotel | null;

  paxDetails: THotelPaxDetail[];
  selectedRooms: number[];
  setSelectedRooms: (val: number[]) => void;
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
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [bookingNote, setBookingNote] = useState<string>("");
  const [flightPaxDetails, setFlightPaxDetails] = useState<
    TPaxDetails | undefined
  >(undefined);

  const [hotelPaxDetails, setHotelPaxDetails] = useState<THotelPaxDetail[]>([]);
  const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
  const [isCheckLoading, setIsCheckLoading] = useState<boolean>(false);

  const { eventId, packageType } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { flight, hotel, transfer } = useSelector(
    (state: RootState) => state.booking
  );

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
    dispatch(setBookingHotelSelectedRoomRate(undefined));
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
    selectedRooms: number[]
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
    }

    if (flight?.recommend || hotel?.recommend) {
      if (!customerEmail.trim()) {
        return { valid: false, message: "Customer email is required" };
      }

      if (!customerPhone.trim()) {
        return {
          valid: false,
          message: "Customer phone number is required",
        };
      }
    }

    return { valid: true };
  };

  const buildFlightBookingRequestPayload = (
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

  /**
   * Build Transfer Booking Request payload from search availability
   * @param transfer - Search availability response object
   * @param paxDetails - Lead passenger details
   * @returns ITransferBookingRequest
   */
  const buildTransferBookingRequestPayload = (
    transfer: ITransferAvailability,
    paxDetails: ITransferPaxDetails
  ): ITransferBookingRequest => {
    if (!transfer?.travelling?.products?.[0]) {
      throw new Error("No products available in transfer.");
    }

    const product = transfer.travelling.products[0];

    const request: ITransferBookingRequest = {
      session_id: transfer.sessionId, // Session from search
      product_id: product.general.productId, // Selected product id
      booking_type_id: product.general.bookingTypeId, // Booking type id
      pax_details: paxDetails, // Provided separately
      accomodation_details: {
        accomodation_name: transfer.searchResult.endName || "",
        accomodation_address01: transfer.searchResult.endDetails || "",
      },
      payment_details: {
        card_type: "VISA",
        card_no: "4242 4242 4242 4242",
        card_cvv: "123",
        expiry_date: "2025-12",
        card_holder_name: `${paxDetails.lead_first_name} ${paxDetails.lead_last_name}`,
      },
      departure_airline:
        transfer.searchResult.originType === "AP"
          ? {
              airport_code: transfer.searchResult.originCode,
              airline_code: "AI", // placeholder, can be dynamic
              airline_number: "101", // placeholder, can be dynamic
            }
          : undefined,
      arrival_airline:
        transfer.searchResult.endType === "AP"
          ? {
              airport_code: transfer.searchResult.endCode,
              airline_code: "EY", // placeholder
              airline_number: "220", // placeholder
            }
          : undefined,
      extras:
        product.pricing.extras?.map((e) => ({
          code: e.extra.typeCode || e.extra.type,
          quantity: 1, // default quantity, can be dynamic if needed
        })) || [],
      remark: "Auto-booked transfer", // Optional remark
    };

    return request;
  };

  const processFlightCheckout = async (): Promise<boolean> => {
    try {
      if (
        !flight?.session_id ||
        !flight.recommend?.FareItinerary?.AirItineraryFareInfo?.FareSourceCode
      ) {
        Alert.alert(
          "Invalid Flight Information",
          "Your flight information is incorrect"
        );
        return false;
      }

      const response = await validateFlightFareMethod(
        flight.session_id,
        flight.recommend.FareItinerary.AirItineraryFareInfo.FareSourceCode
      );

      if (!response.data) {
        Alert.alert(response.message);
        return false;
      }

      const payload = buildFlightBookingRequestPayload(
        flight.session_id,
        user?.location.region_code as string,
        user?.location.country_code as string,
        flight.recommend,
        flightPaxDetails!,
        customerEmail,
        customerPhone,
        bookingNote
      );

      dispatch(setBookingFlight({ ...flight, payload }));
      return true;
    } catch (error: any) {
      Alert.alert(error?.response?.data?.message || "Flight checkout failed");
      return false;
    }
  };

  const processHotelCheckout = async (): Promise<boolean> => {
    try {
      const rateBasisId =
        hotel?.recommend?.roomRates[selectedRooms[0]]?.rateBasisId;

      if (!hotel?.session_id || !rateBasisId) {
        Alert.alert(
          "Invalid Hotel Information",
          "Your hotel information is incorrect"
        );
        return false;
      }

      const response = await checkHotelRoomRates({
        sessionId: hotel.session_id,
        productId: hotel.recommend?.productId as string,
        tokenId: hotel.recommend?.tokenId as string,
        rateBasisId,
      });
      dispatch(
        setBookingHotel({
          ...hotel,
          bookingRequest: {
            ...hotel.bookingRequest,
            rateBasisId: response.data[0].rateBasisId,
            customerEmail,
            customerPhone,
            bookingNote,
          },
        })
      );

      dispatch(setBookingHotelSelectedRoomRate(response.data[0]));
      return true;
    } catch (error: any) {
      Alert.alert(error?.response?.data?.message || "Hotel checkout failed");
      return false;
    }
  };

  const processTransferCheckout = () => {
    if (!transfer?.ah || !transfer.he) return;

    const paxDetails: ITransferPaxDetails = {
      lead_first_name: user?.name as string,
      lead_last_name: user?.name as string,
      address01: user?.location.address as string,
      email_id: user?.email as string,
      lead_title: "Mr",
      phone: "+44 7386964640",
      zip_code: "IP13EW",
      address02: "",
    };

    const ahRequest = buildTransferBookingRequestPayload(
      transfer.ah,
      paxDetails
    );
    const heRequest = buildTransferBookingRequestPayload(
      transfer.he,
      paxDetails
    );

    dispatch(
      setBookingTransferBookingRequest({ request: ahRequest, type: "ah" })
    );
    dispatch(
      setBookingTransferBookingRequest({ request: heRequest, type: "he" })
    );
  };

  const handleCheckout = async () => {
    const validation = validate(
      flight,
      flightPaxDetails,
      hotel,
      hotelPaxDetails,
      selectedRooms
    );

    if (!validation.valid) {
      return Alert.alert("Invalid Booking", validation.message);
    }

    setIsCheckLoading(true);

    try {
      // Process flight if selected
      if (flight?.recommend) {
        const flightSuccess = await processFlightCheckout();
        if (!flightSuccess) return;
      }

      // Process hotel if selected
      if (hotel?.recommend) {
        const hotelSuccess = await processHotelCheckout();
        if (!hotelSuccess) return;
      }

      if (transfer) {
        processTransferCheckout();
      }

      // Navigate only if all required processes succeeded
      router.push({
        pathname: "/checkout",
        params: { eventId, packageType },
      });
    } catch (error: any) {
      Alert.alert(error?.response?.data?.message || "Something went wrong");
    } finally {
      setIsCheckLoading(false);
    }
  };

  return (
    <BookingContainer>
      <View className="flex-1 gap-4">
        <EventDetail loading={loading} event={event} />
        <FlightForm
          flight={flight}
          paxDetails={flightPaxDetails}
          setPaxDetails={setFlightPaxDetails}
        />
        <HotelForm
          hotel={hotel}
          paxDetails={hotelPaxDetails}
          selectedRooms={selectedRooms}
          setSelectedRooms={setSelectedRooms}
          setPaxDetails={setHotelPaxDetails}
        />

        {(flight?.recommend || hotel?.recommend) && (
          <CustomerInfoForm
            email={customerEmail}
            phone={customerPhone}
            note={bookingNote}
            setEmail={setCustomerEmail}
            setPhone={setCustomerPhone}
            setNote={setBookingNote}
          />
        )}
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
