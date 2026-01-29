import { fetchEvent } from "@/api/scripts/event";
import {
  Button,
  CountryPicker,
  DateTimePicker,
  Dropdown,
  FlightItem,
  HotelItem,
  Input,
  LocationPicker,
  Spinner,
} from "@/components/common";
import { TransferAvailabilityGroup } from "@/components/molecules";
import TravelerDetailInputGroup, {
  TFlightTraveler,
  THotelTraveler,
  TTraveler,
} from "@/components/molecules/TravelerDetailInputGroup";
import { BookingContainer } from "@/components/organisms";
import {
  setBookingFlightRequest,
  setBookingHotelRequest,
  setBookingTransferRequest,
} from "@/redux/slices/booking.slice";
import { RootState } from "@/redux/store";
import { TDropdownItem, TLocation, TTransfer } from "@/types";
import {
  TAmadeusFlightBookingRequest,
  TAmadeusFlightOffer,
  TAmadeusHotelBookingRequest,
  TAmadeusHotelOffer,
  TAmadeusTransferBookingRequest,
} from "@/types/amadeus";
import { IEvent } from "@/types/event";
import { Country } from "@/types/location.types";
import { formatDateTime } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
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
              source={event.images?.[0] as string}
              contentFit="cover"
              style={{ width: 100, height: 100, borderRadius: 6 }}
            />
            <View className="gap-4 flex-1">
              <Text className="font-poppins-semibold text-gray-700 line-clamp-2">
                {event.name as string}
              </Text>

              <View className="gap-2">
                <View className="flex flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={16}
                    color="#374151"
                  />
                  <Text className="font-dm-sans-medium text-sm text-gray-700">
                    {event?.location?.city
                      ? `${event.location.city.name}, ${event.location.country.name}`
                      : event?.location?.country.name}
                  </Text>
                </View>
                <View className="flex flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="calendar-outline"
                    size={16}
                    color="#374151"
                  />
                  <Text className="font-dm-sans-medium text-sm text-gray-700">
                    {event?.dates?.start.time} /{" "}
                    {formatDateTime(event?.dates?.start.date as string)}
                  </Text>
                </View>

                <View className="flex flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color="#374151"
                  />
                  <Text className="font-dm-sans-medium text-sm text-gray-700">
                    {event?.dates?.timezone ?? "--"}
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

type TPaymentDetails = {
  vendorCode: string;
  cardNumber: string;
  expiryDate: string;
  holderName: string;
  method: string;
  cvv?: string;
};

type TBillingAddress = {
  line: TLocation | null;
  zip: string;
  country: Country | null;
  cityName: string;
};

interface TravelerDetailsFormProps {
  travelers: number;
  onTravelerDetailsConfirm: (travelerDetails: TTraveler, id: number) => void;
  isConfirmed: boolean[];
  isHotel: boolean;
  isTransfer: boolean;
  paymentDetails: TPaymentDetails;
  setPaymentDetails: (paymentDetails: TPaymentDetails) => void;
  billingAddress: TBillingAddress;
  setBillingAddress: (billingAddress: TBillingAddress) => void;
}

const TravelerDetailsForm: React.FC<TravelerDetailsFormProps> = ({
  travelers,
  onTravelerDetailsConfirm,
  isConfirmed,
  isHotel,
  isTransfer,
  paymentDetails,
  setPaymentDetails,
  billingAddress,
  setBillingAddress,
}) => {
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isTransferBillingOpen, setIsTransferBillingOpen] = useState(false);

  const methods: TDropdownItem[] = [
    { label: "CREDIT CARD", value: "CREDIT_CARD" },
    { label: "CREDIT CARD AGENCY", value: "CREDIT_CARD_AGENCY" },
    { label: "CREDIT CARD TRAVELER", value: "CREDIT_CARD_TRAVELER" },
    { label: "AGENCY ACCOUNT", value: "AGENCY_ACCOUNT" },
    { label: "VCC BILLBACK", value: "VCC_BILLBACK" },
    { label: "VCC B2B WALLET", value: "VCC_B2B_WALLET" },
  ];

  return (
    <>
      <View className="w-full bg-white rounded-xl p-4 gap-6">
        <Text className="font-poppins-semibold text-lg text-gray-800">
          Traveler Details
        </Text>

        {Array.from({ length: travelers }).map((_, index) => (
          <TravelerDetailInputGroup
            key={index}
            id={index + 1}
            title={`Traveler ${index + 1}`}
            onConfirm={(travelerDetails) =>
              onTravelerDetailsConfirm(travelerDetails, index + 1)
            }
          />
        ))}
      </View>

      <View className="w-full bg-white rounded-xl p-4 gap-6">
        {Array.from({ length: travelers }).map((_, index) => (
          <View
            key={index}
            className="w-full flex flex-row items-center justify-between"
          >
            <Text className="font-poppins-semibold text-sm text-gray-800">
              Traveler {index + 1}
            </Text>

            {isConfirmed[index] ? (
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={24}
                color="green"
              />
            ) : (
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={24}
                color="red"
              />
            )}
          </View>
        ))}
      </View>

      {(isHotel || isTransfer) && (
        <View className="w-full bg-white rounded-xl p-4 gap-6">
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex flex-row items-center justify-between"
            onPress={() => setIsBillingOpen(!isBillingOpen)}
          >
            <Text className="font-poppins-semibold text-lg text-gray-800">
              Hotel / Transfer Billing Details
            </Text>
            <MaterialCommunityIcons
              name={isBillingOpen ? "chevron-up" : "chevron-down"}
              size={24}
              color="#4b5563"
            />
          </TouchableOpacity>

          {isBillingOpen && (
            <>
              <Dropdown
                label="Payment Method"
                items={methods}
                selectedItem={
                  methods.find(
                    (method) => method.value === paymentDetails.method
                  ) || null
                }
                onSelect={(item) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    method: item.value as string,
                  })
                }
                bordered
                className="rounded-md"
              />

              <Input
                type="string"
                label="Card Number"
                placeholder="1234567890123456"
                bordered
                className="rounded-md"
                value={paymentDetails.cardNumber}
                onChange={(text) =>
                  setPaymentDetails({ ...paymentDetails, cardNumber: text })
                }
              />
              <Input
                type="string"
                label="CVV"
                placeholder="123"
                bordered
                className="rounded-md"
                value={paymentDetails.cvv}
                onChange={(text) =>
                  setPaymentDetails({ ...paymentDetails, cvv: text })
                }
              />
              <DateTimePicker
                mode="date"
                label="Expiry Date"
                bordered
                className="rounded-md"
                value={new Date(paymentDetails.expiryDate)}
                onPick={(date) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    expiryDate: date.toISOString(),
                  })
                }
              />
              <Input
                type="string"
                label="Vener Code"
                placeholder="VI"
                bordered
                className="rounded-md"
                value={paymentDetails.vendorCode}
                onChange={(text) =>
                  setPaymentDetails({ ...paymentDetails, vendorCode: text })
                }
              />
              <Input
                type="string"
                label="Holder Name"
                placeholder="John Doe"
                bordered
                className="rounded-md"
                value={paymentDetails.holderName}
                onChange={(text) =>
                  setPaymentDetails({ ...paymentDetails, holderName: text })
                }
              />
            </>
          )}
        </View>
      )}

      {isTransfer && (
        <View className="w-full bg-white rounded-xl p-4 gap-6">
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex flex-row items-center justify-between"
            onPress={() => setIsTransferBillingOpen(!isTransferBillingOpen)}
          >
            <Text className="font-poppins-semibold text-lg text-gray-800">
              Transfer Billing Details
            </Text>
            <MaterialCommunityIcons
              name={isTransferBillingOpen ? "chevron-up" : "chevron-down"}
              size={24}
              color="#4b5563"
            />
          </TouchableOpacity>

          {isTransferBillingOpen && (
            <>
              <LocationPicker
                label="Billing Address"
                placeholder="123 Main St"
                bordered
                value={billingAddress.line}
                onPick={(location) =>
                  setBillingAddress({ ...billingAddress, line: location })
                }
              />
              <Input
                type="string"
                label="Zip"
                placeholder="12345"
                bordered
                className="rounded-md"
                value={billingAddress.zip}
                onChange={(text) =>
                  setBillingAddress({ ...billingAddress, zip: text })
                }
              />
              <CountryPicker
                label="Country Code"
                placeholder="US"
                bordered
                className="rounded-md"
                value={billingAddress.country}
                onPick={(country) =>
                  setBillingAddress({ ...billingAddress, country })
                }
              />
            </>
          )}
        </View>
      )}
    </>
  );
};

interface SummaryProps {
  flight?: TAmadeusFlightOffer;
  hotel?: TAmadeusHotelOffer;
  transfer?: TTransfer;
}

const Summary: React.FC<SummaryProps> = ({ flight, hotel, transfer }) => {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

  return (
    <View className="w-full bg-white rounded-xl p-4 gap-6">
      <TouchableOpacity
        activeOpacity={0.8}
        className="flex flex-row items-center justify-between"
        onPress={() => setIsSummaryOpen(!isSummaryOpen)}
      >
        <Text className="font-poppins-semibold text-lg text-gray-800">
          Summary
        </Text>

        <MaterialCommunityIcons
          name={isSummaryOpen ? "chevron-up" : "chevron-down"}
          size={24}
          color="#4b5563"
        />
      </TouchableOpacity>

      {isSummaryOpen && (
        <>
          {flight && <FlightItem data={flight} />}

          <View className="w-full h-[1px] bg-gray-200"></View>

          {hotel && <HotelItem data={hotel} hiddenImages={true} />}

          <View className="w-full h-[1px] bg-gray-200"></View>

          {transfer && <TransferAvailabilityGroup transfer={transfer} />}
        </>
      )}
    </View>
  );
};

const BookingScreen = () => {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [flightTravelers, setFlightTravelers] = useState<TFlightTraveler[]>([]);
  const [hotelTravelers, setHotelTravelers] = useState<THotelTraveler[]>([]);
  const [paymentDetails, setPaymentDetails] = useState<TPaymentDetails>({
    vendorCode: "VI",
    cardNumber: "4065129432541853",
    expiryDate: new Date().toISOString(),
    holderName: "Vladislav Gostiuc",
    method: "CREDIT_CARD",
    cvv: "991",
  });
  const [billingAddress, setBillingAddress] = useState<TBillingAddress>({
    line: null,
    zip: "123456",
    country: null,
    cityName: "",
  });

  const { eventId, packageType } = useLocalSearchParams();
  const router = useRouter();

  const { flight, hotel, transfer, travelers } = useSelector(
    (state: RootState) => state.booking
  );

  const [isConfirmed, setIsConfirmed] = useState<boolean[]>(
    Array.from({ length: travelers }, () => false)
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
  }, []);

  const handleTravelerDetailsConfirm = (
    travelerDetails: TTraveler,
    id: number
  ) => {
    setFlightTravelers((prev) => {
      const newFlightTravelers = [...prev];
      newFlightTravelers[id - 1] = travelerDetails.flightTravelerDetails;
      return newFlightTravelers;
    });

    setHotelTravelers((prev) => {
      const newHotelTravelers = [...prev];
      newHotelTravelers[id - 1] = travelerDetails.hotelTravelerDetails;
      return newHotelTravelers;
    });

    setIsConfirmed((prev) => {
      const newIsConfirmed = [...prev];
      newIsConfirmed[id - 1] = true;
      return newIsConfirmed;
    });
  };

  const handleCheckout = async () => {
    if (isConfirmed.some((confirmed) => !confirmed))
      return Alert.alert("Error", "Please confirm all passenger details");

    const flightBookingRequest: TAmadeusFlightBookingRequest = {
      flightOffers: [flight?.offers[0]] as any,
      travelers: flightTravelers,
      contacts: [
        {
          addresseeName: {
            firstName: "Lukasz",
            lastName: "Szymborski",
          },
          companyName: "CHARLIE UNICORN AI",
          purpose: "STANDARD",
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "48",
              number: "504412991",
            },
          ],
          emailAddress: "team@charlieunicornai.eu",
          address: {
            lines: ["Kolejowa 10/12"],
            postalCode: "00-811",
            cityName: "Warsaw",
            countryCode: "PL",
          },
        },
      ],
      remarks: {
        general: [
          {
            subType: "GENERAL_MISCELLANEOUS",
            text: "ONLINE BOOKING FROM CHARLIE UNICORN AI",
          },
        ],
      },
    };

    const paymentExpiryDateSplit = paymentDetails.expiryDate
      .split("T")[0]
      .split("-");

    const hotelBookingRequest: TAmadeusHotelBookingRequest = {
      guests: hotelTravelers.map((traveler) => traveler.info) as any,
      travelAgent: {
        contact: {
          email: "team@charlieunicornai.eu",
        },
      },
      roomAssociations: hotelTravelers.map((traveler) => ({
        guestReferences: [{ guestReference: traveler.info.tid.toString() }],
        hotelOfferId: traveler.offerId,
      })),
      payment: {
        method: paymentDetails.method as any,
        paymentCard: {
          paymentCardInfo: {
            vendorCode: paymentDetails.vendorCode,
            cardNumber: paymentDetails.cardNumber,
            expiryDate:
              paymentExpiryDateSplit[0] + "-" + paymentExpiryDateSplit[1],
            holderName: paymentDetails.holderName,
          },
        },
      },
    };

    const expiryDate = paymentDetails.expiryDate.split("T")[0];
    const expiryDateMMYY =
      expiryDate.split("-")[1] + expiryDate.split("-")[0].slice(2, 4);

    const ahTransfer = transfer?.ah[0];
    const heTransfer = transfer?.he[0];

    const ahTransferBookingRequest: TAmadeusTransferBookingRequest = {
      id: transfer?.ah[0].id as string,
      passengers: hotelTravelers.map((traveler) => {
        const { firstName, lastName, phone, email, title } = traveler.info;
        return {
          firstName,
          lastName,
          title,
          contacts: {
            phoneNumber: phone,
            email,
          },
          billingAddress: {
            line: billingAddress.line?.description ?? "",
            zip: billingAddress.zip,
            countryCode: billingAddress.country?.cca2 ?? "",
            cityName: billingAddress.line?.cityName ?? "",
          },
        };
      }),
      payment: {
        methodOfPayment: paymentDetails.method as any,
        creditCard: {
          number: paymentDetails.cardNumber,
          holderName: paymentDetails.holderName,
          vendorCode: paymentDetails.vendorCode,
          expiryDate: expiryDateMMYY,
          cvv: paymentDetails.cvv as string,
        },
      },
      startConnectedSegment: {
        transportationType:
          ahTransfer?.startConnectedSegment?.transportationType ?? "",
        transportationNumber:
          ahTransfer?.startConnectedSegment?.transportationNumber ?? "",
        departure: {
          iataCode: ahTransfer?.start?.locationCode ?? "",
          localDateTime: ahTransfer?.start?.dateTime ?? "",
        },
        arrival: {
          iataCode: ahTransfer?.end?.locationCode ?? "",
          localDateTime: ahTransfer?.end?.dateTime ?? "",
        },
      },
      extraServices:
        ahTransfer?.extraServices?.map((extraService) => ({
          code: extraService.code,
          itemId: extraService.itemId,
        })) ?? [],
      equipment:
        ahTransfer?.equipment?.map((equipment) => ({
          code: equipment.code,
        })) ?? [],
      agency: {
        contacts: [
          {
            email: {
              address: "team@charlieunicornai.eu",
            },
          },
        ],
      },
    };

    const heTransferBookingRequest: TAmadeusTransferBookingRequest = {
      id: transfer?.he[0].id as string,
      passengers: hotelTravelers.map((traveler) => {
        const { firstName, lastName, phone, email, title } = traveler.info;
        return {
          firstName,
          lastName,
          title,
          contacts: {
            phoneNumber: phone,
            email,
          },
          billingAddress: {
            line: billingAddress.line?.description ?? "",
            zip: billingAddress.zip,
            countryCode: billingAddress.country?.cca2 ?? "",
            cityName: billingAddress.line?.cityName ?? "",
          },
        };
      }),
      payment: {
        methodOfPayment: paymentDetails.method as any,
        creditCard: {
          number: paymentDetails.cardNumber,
          holderName: paymentDetails.holderName,
          vendorCode: paymentDetails.vendorCode,
          expiryDate: expiryDateMMYY,
          cvv: paymentDetails.cvv as string,
        },
      },
      startConnectedSegment: {
        transportationType:
          heTransfer?.startConnectedSegment?.transportationType ?? "",
        transportationNumber:
          heTransfer?.startConnectedSegment?.transportationNumber ?? "",
        departure: {
          iataCode: heTransfer?.start?.locationCode ?? "",
          localDateTime: heTransfer?.start?.dateTime ?? "",
        },
        arrival: {
          iataCode: heTransfer?.end?.locationCode ?? "",
          localDateTime: heTransfer?.end?.dateTime ?? "",
        },
      },
      extraServices:
        heTransfer?.extraServices?.map((extraService) => ({
          code: extraService.code,
          itemId: extraService.itemId,
        })) ?? [],
      equipment:
        heTransfer?.equipment?.map((equipment) => ({
          code: equipment.code,
        })) ?? [],
      agency: {
        contacts: [
          {
            email: {
              address: "team@charlieunicornai.eu",
            },
          },
        ],
      },
    };

    dispatch(setBookingFlightRequest(flightBookingRequest));
    dispatch(setBookingHotelRequest(hotelBookingRequest));
    dispatch(
      setBookingTransferRequest([
        ahTransferBookingRequest,
        heTransferBookingRequest,
      ])
    );

    router.push({
      pathname: "/checkout",
      params: { eventId, packageType },
    });
  };

  const isPaymentDetailsValid = useMemo(() => {
    return (
      paymentDetails.vendorCode.trim().length > 0 &&
      paymentDetails.cardNumber.trim().length > 0 &&
      paymentDetails.holderName.trim().length > 0 &&
      paymentDetails.expiryDate.trim().length > 0 &&
      paymentDetails.cvv &&
      paymentDetails.cvv.trim().length > 0
    );
  }, [paymentDetails]);

  return (
    <BookingContainer>
      <View className="flex-1 gap-4">
        <EventDetail loading={loading} event={event} />

        <TravelerDetailsForm
          travelers={travelers}
          onTravelerDetailsConfirm={handleTravelerDetailsConfirm}
          isConfirmed={isConfirmed}
          isHotel={!!hotel}
          isTransfer={!!transfer?.ah[0] || !!transfer?.he[0]}
          paymentDetails={paymentDetails}
          setPaymentDetails={setPaymentDetails}
          billingAddress={billingAddress}
          setBillingAddress={setBillingAddress}
        />

        <Summary
          flight={flight?.offers[0] as TAmadeusFlightOffer}
          hotel={hotel?.offers[0] as TAmadeusHotelOffer}
          transfer={transfer ?? undefined}
        />
      </View>

      <Button
        type="primary"
        label="Checkout"
        buttonClassName="h-12"
        disabled={
          isConfirmed.some((confirmed) => !confirmed) || !isPaymentDetailsValid
        }
        onPress={handleCheckout}
      />
    </BookingContainer>
  );
};

export default BookingScreen;
