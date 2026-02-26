import {
  createBooking,
  createFlightOrder,
  createHotelOrder,
  createTransferOrder,
} from "@/api/services/booking";
import eventServices from "@/api/services/event";
import { createStripePaymentIntent } from "@/api/services/stripe";
import userServices from "@/api/services/user";
import { Button, Spinner } from "@/components/common";
import { PaymentMethodGroup } from "@/components/molecules";
import { SimpleContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { useBooking } from "@/components/providers/BookingProvider";
import { useTicket } from "@/components/providers/TicketProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { TCurrency, TPackageType, TPaymentMethod } from "@/types";
import { TAmadeusFlightOrder, TAmadeusHotelOrder } from "@/types/amadeus";
import {
  IBooking,
  TBookingFlight,
  TBookingHotel,
  TBookingTransfer,
} from "@/types/booking";
import { IEvent } from "@/types/event";
import { ITicket } from "@/types/ticket";
import { IUser } from "@/types/user";
import { formatDateTime, formatName, getCurrencySymbol } from "@/utils/format";
import {
  mapAmadeusFlightOrderToBookingFlightData,
  mapAmadeusHotelOrderToBookingHotelData,
  mapAmadeusTransferOrderToBookingTransferData,
} from "@/utils/map";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { confirmPayment } from "@stripe/stripe-react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";

const EventDetail = ({
  event,
  loading,
  packageType,
  totalPrice,
}: {
  event?: IEvent;
  loading: boolean;
  packageType: "standard" | "gold";
  totalPrice: number;
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
            {event.images?.length === 0 ? (
              <View className="w-[100px] h-[100px] flex flex-col items-center justify-center gap-2">
                <MaterialCommunityIcons
                  name="image-off-outline"
                  size={24}
                  color="#4b5563"
                />
                <Text className="font-dm-sans-medium text-sm text-gray-600">
                  No Picture
                </Text>
              </View>
            ) : (
              <Image
                source={event.images?.[0] as string}
                contentFit="cover"
                style={{ width: 100, height: 100, borderRadius: 6 }}
              />
            )}
            <View className="gap-2 flex-1">
              <Text className="font-poppins-semibold text-gray-700 line-clamp-2">
                {event.name as string}
              </Text>

              <View className="gap-2">
                <View className="flex flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={20}
                    color="#374151"
                  />
                  <Text className="font-dm-sans-medium text-sm text-gray-700">
                    {event?.location?.city
                      ? `${event.location.city.name}, ${event.location.country.name}`
                      : event?.location?.country?.name}
                  </Text>
                </View>

                <View className="flex flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="calendar-outline"
                    size={16}
                    color="#374151"
                  />
                  <Text className="font-dm-sans-medium text-sm text-gray-700">
                    {event.dates?.start.time} /{" "}
                    {formatDateTime(event.dates?.start.date as string)}
                  </Text>
                </View>

                <View className="flex flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color="#374151"
                  />
                  <Text className="font-dm-sans-medium text-sm text-gray-700">
                    {event.dates?.timezone ?? "--"}
                  </Text>
                </View>

                {event.type === "user" &&
                  event.fee &&
                  event.fee.type === "paid" && (
                    <View className="flex flex-row items-center gap-2">
                      <MaterialCommunityIcons
                        name="cart-outline"
                        size={16}
                        color="#374151"
                      />
                      <Text className="font-dm-sans-medium text-sm text-gray-700">
                        {getCurrencySymbol(event.fee.currency as any)}
                        {event.fee.amount}
                      </Text>
                    </View>
                  )}
              </View>
            </View>
          </View>

          <View className="w-full h-[1px] bg-gray-200"></View>

          <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-poppins-semibold text-lg text-gray-700">
              {formatName(packageType)} Package
            </Text>

            <View className="flex flex-row items-start">
              <Text className="font-dm-sans-medium text-sm text-gray-600">
                $
              </Text>
              <Text className="font-poppins-bold text-lg text-gray-800">
                {totalPrice}
              </Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const PriceDetail = ({
  services,
  totalPrice,
  basePrice,
  comissionPrice,
}: {
  services: string[];
  totalPrice: number;
  basePrice: number;
  comissionPrice: number;
}) => {
  return (
    <View className="w-full bg-white rounded-xl p-4 gap-6">
      <Text className="font-poppins-semibold text-gray-700">Price details</Text>

      <View className="w-full flex flex-row items-start justify-between">
        <View className="grid grid-cols-1 gap-4">
          {services.map((service, index) => (
            <View key={index} className="flex flex-row items-center gap-1">
              <View className="w-2 h-2 rounded-full bg-gray-400"></View>
              <Text className="font-dm-sans text-gray-500">{service}</Text>
            </View>
          ))}
        </View>
        <View className="flex flex-row items-start">
          <Text className="font-dm-sans-medium text-sm text-gray-600">$</Text>
          <Text className="font-poppins-semibold text-lg text-gray-700">
            {basePrice}
          </Text>
        </View>
      </View>

      <View className="w-full flex flex-row items-start gap-6">
        <View className="flex-1 flex-row items-center gap-4">
          <View className="flex flex-row items-center gap-1">
            <View className="w-2 h-2 rounded-full bg-gray-400"></View>
            <Text className="font-dm-sans text-gray-500">
              Charlie commission
            </Text>
          </View>
        </View>

        <View className="flex flex-row items-start">
          <Text className="font-dm-sans-medium text-sm text-gray-600">$</Text>
          <Text className="font-poppins-semibold text-lg text-gray-700">
            {comissionPrice}
          </Text>
        </View>
      </View>

      <View className="w-full h-[1px] bg-gray-200"></View>

      <View className="w-full flex flex-row items-center justify-between">
        <Text className="font-poppins-semibold text-lg text-gray-700">
          Total
        </Text>

        <View className="flex flex-row items-start">
          <Text className="font-dm-sans-medium text-sm text-gray-600">$</Text>
          <Text className="font-poppins-bold text-xl text-gray-800">
            {totalPrice}
          </Text>
        </View>
      </View>
    </View>
  );
};

const CheckoutScreen = () => {
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const [userTicket, setUserTicket] = useState<ITicket | null>(null);
  const [eventLoading, setEventLoading] = useState<boolean>(false);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [commissionPrice, setCommissionPrice] = useState<number>(0);
  const [services, setServices] = useState<string[]>([]);
  const [currency, setCurrency] = useState<TCurrency>("usd");
  const [paymentMethod, setPaymentMethod] = useState<TPaymentMethod>("card");
  const [stripePaymentMethodId, setStripePaymentMethodId] =
    useState<string>("");
  const [bookLoading, setBookLoading] = useState<boolean>(false);
  const [bookLabel, setBookLabel] = useState<string>("Book Now");

  const { eventId, packageType, ticketId } = useLocalSearchParams();
  const router = useRouter();

  const { user, setAuthUser } = useAuth();
  const { flight, hotel, transfer } = useBooking();

  const { tickets } = useTicket();
  const toast = useToast();

  const getEvent = useCallback(async () => {
    if (!eventId || typeof eventId !== "string") return;

    try {
      setEventLoading(true);

      const response = await eventServices.get(eventId);

      setEvent(response.data);
    } catch (error: any) {
      if (error?.status === 404) {
      }
    } finally {
      setEventLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    getEvent();
  }, []);

  useEffect(() => {
    if (!ticketId) return;
    setUserTicket(tickets.find((t) => t._id === ticketId) || null);
  }, [ticketId]);

  useEffect(() => {
    if (!user?.stripe) return;

    if (user.stripe.paymentMethods.length === 0) return;
    setStripePaymentMethodId(user.stripe.paymentMethods[0].id || "");
  }, [user]);

  useEffect(() => {
    let base = 0;
    let services: string[] = [];
    let total = 0;

    if (flight?.offers) {
      services.push("Flight");
      const flightPrice = flight?.offers[0]?.price.total || 0;
      base += Number(flightPrice);
    }

    if (hotel?.offers) {
      services.push("Hotel");
      const hotelPrice = hotel?.offers[0]?.offers[0]?.price?.total || 0;
      base += Number(hotelPrice);
    }

    if (transfer?.ah) {
      services.push("Transfer (A/H)");
      const transferPrice = transfer?.ah[0]?.quotation?.monetaryAmount || 0;
      base += Number(transferPrice);
    }

    if (transfer?.he) {
      services.push("Transfer (H/E)");
      const transferPrice = transfer?.he[0]?.quotation?.monetaryAmount || 0;
      base += Number(transferPrice);
    }

    total = base + base * 0.1;

    setBasePrice(Number(base.toFixed(2)));
    setTotalPrice(Number(total.toFixed(2)));
    setCommissionPrice(Number((base * 0.1).toFixed(2)));
    setServices(services);
  }, [flight, hotel, transfer, userTicket]);

  const handleStripePayment = async (
    amount: number,
    currency: string,
  ): Promise<boolean> => {
    const stripePayload = {
      customerId: user?.stripe?.customerId,
      paymentMethodId: stripePaymentMethodId,
      amount,
      currency,
      metadata: {
        bookingOption: "flight",
        packageType: packageType as TPackageType,
      },
    };

    const clientSecretResponse = await createStripePaymentIntent(
      stripePayload as any,
    );

    if (!clientSecretResponse.ok) {
      Alert.alert(
        "Payment Error",
        clientSecretResponse.message || "Failed to create payment intent.",
      );
      setBookLabel("Book Now");
      return false;
    }

    const { id: paymentIntentId, clientSecret } = clientSecretResponse.data;

    // Pay with stripe
    const { error: confirmPaymentError } = await confirmPayment(clientSecret, {
      paymentMethodType: "Card",
      paymentMethodData: {
        paymentMethodId: stripePaymentMethodId,
      },
    });

    if (confirmPaymentError) {
      Alert.alert("Payment Confirmation Error", confirmPaymentError.message);
      setBookLabel("Book Now");
      return false;
    }

    return true;
  };

  const bookServices = async () => {
    let flightOrder: TBookingFlight | undefined;
    let hotelOrder: TBookingHotel | undefined;
    let transferOrders: {
      ah: TBookingTransfer | undefined;
      he: TBookingTransfer | undefined;
    } = {
      ah: undefined,
      he: undefined,
    };
    let billingAddress = null;
    let billingPayment = null;
    let aiTicket = null;

    const flightPrice = Number(flight?.offers[0]?.price.total) || 0;
    const hotelPrice = Number(hotel?.offers[0]?.offers[0]?.price?.total) || 0;
    const transferPriceAH =
      Number(transfer?.ah[0]?.quotation?.monetaryAmount) || 0;
    const transferPriceHE =
      Number(transfer?.he[0]?.quotation?.monetaryAmount) || 0;

    // Pay total amount first
    setBookLabel("Processing Payment...");
    // const paymentResult = await handleStripePayment(totalPrice, currency);

    // if (!paymentResult) {
    //   setBookLabel("Book Now");
    //   return toast.error("Failed to make payment.");
    // }

    try {
      if (flight?.request) {
        setBookLabel("Booking Flight...");
        const response = await createFlightOrder(flight.request);

        if (response.data) {
          const data: TAmadeusFlightOrder = response.data;
          flightOrder = mapAmadeusFlightOrderToBookingFlightData(data);
        }
      }

      if (hotel?.request) {
        setBookLabel("Booking Hotel...");
        const response = await createHotelOrder(hotel.request);

        if (response.data) {
          const data: TAmadeusHotelOrder = response.data;
          hotelOrder = mapAmadeusHotelOrderToBookingHotelData(data);
        }
      }

      if (transfer?.requests && transfer.requests.length > 0) {
        setBookLabel("Booking Transfers...");
        for (let i = 0; i < transfer.requests.length; i++) {
          const request = transfer.requests[i];
          const response = await createTransferOrder(request);

          if (response.data) {
            const data: any = response.data;

            if (data?.reservationStatus === "CANCELLED") {
              continue;
            }

            if (i === 0) {
              transferOrders.ah =
                mapAmadeusTransferOrderToBookingTransferData(data);
            } else {
              transferOrders.he =
                mapAmadeusTransferOrderToBookingTransferData(data);
            }

            billingAddress = data.passengers[0].billingAddress;
            billingPayment = {
              method: transfer.requests[0].payment.methodOfPayment,
              cardNumber: transfer.requests[0].payment.creditCard.number,
              expiryDate: transfer.requests[0].payment.creditCard.expiryDate,
              holderName: transfer.requests[0].payment.creditCard.holderName,
              vendorCode: transfer.requests[0].payment.creditCard.vendorCode,
              cvv: transfer.requests[0].payment.creditCard.cvv,
            };
          }
        }
      }

      if (event?.type === "ai" && event.tm?.url && user?._id) {
        await WebBrowser.openBrowserAsync(event.tm.url + `/subid=${user._id}`);
        const response = await eventServices.checkPurhcaseTicket(
          event._id as string,
          user._id,
        );
        console.log("[check purchase ticket response]: ", response.data);
      }

      return {
        flightOrder,
        hotelOrder,
        transferOrders,
        billingAddress,
        billingPayment,
      };
    } catch (error: any) {
      setBookLabel("Book Now");
      toast.error("Booking failed");
    }
  };

  const removeOneTicket = (tickets: ITicket[], ticketId: string) => {
    const index = tickets.findIndex((t) => t._id === ticketId);
    if (index === -1) return tickets;
    const updated = [...tickets];
    updated.splice(index, 1);

    return updated;
  };

  const handleUserTicket = async (): Promise<boolean> => {
    if (!userTicket || !user?._id || !event?._id || !event.hoster?._id)
      return false;

    // Remove user ticket
    const userBodyData: IUser = {
      ...user,
      tickets: removeOneTicket(user.tickets, userTicket?._id as string),
    };

    const meRes = await userServices.update(user._id, userBodyData);
    if (meRes.data) {
      setAuthUser(meRes.data);
    } else {
      return false;
    }

    // Add attendees to the event
    const eventBodyData: IEvent = {
      ...event,
      attendees: [
        ...event.attendees,
        {
          user: user._id as any,
          ticket: {
            ticketId: userTicket._id as string,
            status: "deposited",
          },
          status: "approved",
        },
      ],
    };

    const eventRes = await eventServices.update(event._id, eventBodyData);
    if (!eventRes.data) return false;

    return true;
  };

  const handleBook = async (paymentMethod: TPaymentMethod) => {
    if (!user?._id || !eventId) return toast.error("Unauthorized");

    try {
      setBookLoading(true);

      let ticketTransferResult = false;

      if (event?.type === "user" && userTicket) {
        ticketTransferResult = await handleUserTicket();

        if (!ticketTransferResult) {
          toast.error("Transfer ticket error");
          setBookLabel("Book Now");
          return setBookLoading(false);
        }
      }

      const basicBookingData = await bookServices();

      setBookLabel("Booking...");

      const bookingData: IBooking = {
        flight: basicBookingData?.flightOrder as any,
        hotel: basicBookingData?.hotelOrder as any,
        transfer: basicBookingData?.transferOrders as any,
        timezone: event?.dates?.timezone || "",
        event: event?._id as any,
        user: user._id as any,
        price: {
          total: totalPrice,
          base: basePrice,
          comission: commissionPrice,
          currency: currency.toUpperCase(),
        },
        billingAddress: basicBookingData?.billingAddress as any,
        billingPayment: basicBookingData?.billingPayment as any,
        package: packageType as any,
        userTicket:
          event?.type === "user" && ticketTransferResult
            ? (userTicket?._id as any)
            : undefined,
      };

      const bookingRes = await createBooking(bookingData);

      if (!bookingRes.data) {
        toast.error("Saving booking error");
        setBookLabel("Book Now");
        return setBookLoading(false);
      }

      router.push({
        pathname: "/booking/booked",
        params: {
          bookingId: bookingRes.data._id as string,
          eventId,
          packageType,
          ticketId: userTicket?._id,
        },
      });
    } catch (error: any) {
      console.log("handle book error: ", error);
      toast.error("Booking failed");
      setBookLabel("Book Now");
      setBookLoading(false);
    }
  };

  return (
    <SimpleContainer title="Checkout" scrolled>
      <EventDetail
        event={event}
        loading={eventLoading}
        packageType={packageType as any}
        totalPrice={totalPrice}
      />
      <PriceDetail
        services={services}
        totalPrice={totalPrice}
        basePrice={basePrice}
        comissionPrice={commissionPrice}
      />
      <PaymentMethodGroup
        method={paymentMethod}
        stripePaymentMethodId={stripePaymentMethodId}
        onSelectMethod={setPaymentMethod}
        onSelectStripePaymentMethod={setStripePaymentMethodId}
      />
      <Button
        type="primary"
        label={bookLabel}
        buttonClassName="h-12"
        textClassName="text-lg"
        // disabled={paymentMethod === "card" && stripePaymentMethodId === ""}
        loading={bookLoading}
        onPress={() => handleBook(paymentMethod)}
      />
    </SimpleContainer>
  );
};

export default CheckoutScreen;
