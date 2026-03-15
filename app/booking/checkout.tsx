import BookingAPI from "@/api/services/booking";
import eventServices from "@/api/services/event";
import userServices from "@/api/services/user";
import Web3API from "@/api/services/web3";
import { Button, Spinner } from "@/components/common";
import { PaymentMethodGroup } from "@/components/molecules";
import { SimpleContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { useFlight } from "@/components/providers/FlightProvider";
import { useHotel } from "@/components/providers/HotelProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { useTransfer } from "@/components/providers/TransferProvider";
import { SERVER_API_ENDPOINT } from "@/config/env";
import { useStripe } from "@/hooks";
import { TPaymentMethod } from "@/types";
import { IBooking } from "@/types/booking";
import { IEvent } from "@/types/event";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

// --- REDESIGNED SUB-COMPONENTS ---

const EventHeroCard = ({ event, packageType, loading }: any) => {
  if (loading)
    return (
      <View className="h-32 justify-center">
        <Spinner size="md" />
      </View>
    );

  return (
    <View className="w-full rounded-[24px] overflow-hidden bg-white border border-slate-100 shadow-sm">
      <LinearGradient
        colors={["rgba(132, 74, 255, 0.05)", "transparent"]}
        className="p-4 flex-row gap-4"
      >
        <View className="relative">
          <Image
            source={event?.images?.[0]}
            style={{ width: 100, height: 100, borderRadius: 16 }}
            contentFit="cover"
          />
          <View className="absolute top-1 left-1 bg-white/90 px-2 py-0.5 rounded-full">
            <Text className="text-[8px] font-poppins-bold text-purple-600 uppercase">
              Confirmed
            </Text>
          </View>
        </View>

        <View className="flex-1 justify-center">
          <View className="flex-row items-center gap-1 mb-1">
            <MaterialCommunityIcons
              name="star-circle"
              size={14}
              color="#844AFF"
            />
            <Text className="text-purple-600 font-poppins-bold text-[10px] uppercase tracking-widest">
              {packageType} PACKAGE
            </Text>
          </View>
          <Text
            className="font-poppins-bold text-slate-800 text-lg leading-6"
            numberOfLines={2}
          >
            {event?.name}
          </Text>
          <View className="flex-row items-center mt-2">
            <Ionicons name="location-sharp" size={14} color="#94a3b8" />
            <Text className="text-slate-400 font-dm-sans-medium text-xs ml-1">
              {event?.location?.city?.name}, {event?.location?.country?.name}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const HighEndReceipt = ({
  services,
  base,
  commission,
  total,
  currency,
}: any) => (
  <View className="w-full">
    <View className="bg-slate-50 rounded-t-[24px] border border-slate-200 p-6 pb-2">
      <Text className="text-slate-400 font-poppins-bold text-[10px] uppercase tracking-[2px] mb-4">
        Price Breakdown
      </Text>

      <View className="gap-3">
        {services.map((service: string, i: number) => (
          <View key={i} className="flex-row justify-between items-center mb-1">
            <Text className="text-slate-600 font-dm-sans-medium text-sm">
              {service}
            </Text>

            <View className="flex-1 h-[1px] border-b border-dotted border-slate-300 mx-4 opacity-50" />

            <Text className="text-slate-400 text-xs font-dm-sans-bold">
              {service === "Ticket" ? "Price isn't estimated" : "Included"}
            </Text>
          </View>
        ))}

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-slate-500 font-dm-sans text-sm">Subtotal</Text>
          <Text className="text-slate-800 font-dm-sans-bold text-base">
            <Text className="text-slate-600 font-dm-sans-medium text-xs">
              {currency.toUpperCase()}
            </Text>{" "}
            {base}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-slate-500 font-dm-sans text-sm">
            Commission
          </Text>

          <Text className="text-slate-800 font-dm-sans-bold text-base">
            <Text className="text-slate-600 font-dm-sans-medium text-xs">
              {currency.toUpperCase()}
            </Text>{" "}
            {commission}
          </Text>
        </View>
      </View>
    </View>

    <View className="flex-row items-center justify-between bg-slate-50">
      <View className="w-5 h-10 rounded-r-full bg-white border-r border-t border-b border-slate-200 -ml-[1px]" />
      <View className="flex-1 h-[1px] border-b border-dashed border-slate-300 mx-2" />
      <View className="w-5 h-10 rounded-l-full bg-white border-l border-t border-b border-slate-200 -mr-[1px]" />
    </View>

    <View className="bg-slate-50 rounded-b-[24px] border border-slate-200 p-6 pt-2">
      <View className="flex-row justify-between items-end gap-4">
        <View>
          <Text className="text-slate-400 font-dm-sans-bold text-[10px] uppercase tracking-widest mb-1">
            Total Amount
          </Text>

          <Text className="font-poppins-bold text-slate-900 text-3xl">
            <Text className="font-poppins-bold text-slate-600 text-lg">
              {currency.toUpperCase()}
            </Text>{" "}
            {total}
          </Text>
        </View>

        <View className="bg-emerald-100 px-3 py-1.5 rounded-xl flex-row items-center gap-1">
          <Feather name="shield" size={12} color="#10b981" />
          <Text className="text-[10px] font-poppins-bold text-emerald-600 uppercase">
            Guaranteed
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const BookingStepper = ({ event }: { event: IEvent | null }) => {
  if (!event) return null;

  const { user } = useAuth();

  const steps = [
    {
      title: event?.type === "ai" ? "Ticket Purchase" : "Ticket Deposit",
      description:
        event?.type === "ai"
          ? "To purchase tickets, visit the event provider's official ticket page using the link below."
          : "Your ticket will be deposited to the event.",
    },
    {
      title: "Flight & Hotel",
      description:
        "Book your flight and hotel accommodation. Payment is processed in-app.",
    },
    {
      title: "Transfers",
      description: "Shuttle services will be reserved after your booking.",
    },
    {
      title: "Confirmation",
      description:
        "You'll get a summary of all services booked with estimated and confirmed details.",
    },
  ];

  const handleBuyTicket = async () => {
    if (!event?.tm?.url || !user?._id) return;

    const url = event.tm.url + `?subId=${user._id}`;
    await Linking.openURL(url);
  };

  return (
    <View className="bg-slate-50 rounded-[24px] border border-slate-200 shadow-sm p-6">
      <Text className="text-slate-400 font-poppins-bold text-[10px] uppercase tracking-[2px] mb-4">
        Booking Steps
      </Text>

      <View className="relative">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <View
              key={index}
              className="flex-row items-start gap-4 mb-6 relative"
            >
              {/* Step circle */}
              <View className="relative z-10">
                <View className="w-4 h-4 rounded-full bg-purple-600" />

                {/* Vertical line below circle (skip for last step) */}
                {!isLast && (
                  <View className="absolute top-4 left-[7px] w-[2px] bg-slate-300 h-[56px]" />
                )}
              </View>

              {/* Step content */}
              <View className="flex-1">
                <Text className="font-poppins-bold text-purple-600 text-sm">
                  {step.title}
                </Text>
                <Text className="text-slate-400 text-xs mt-1">
                  {step.description}
                </Text>

                {index === 0 && event.type === "ai" && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="flex flex-row items-center gap-2"
                    onPress={handleBuyTicket}
                  >
                    <Text className="font-dm-sans-bold text-sm text-purple-600 underline">
                      Purhcase
                    </Text>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={14}
                      color="#9333ea"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// --- MAIN SCREEN ---

const CheckoutScreen = () => {
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [stripePaymentId, setStripePaymentId] = useState<string>("");
  const [services, setServices] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [commissionAmount, setCommissionAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<TPaymentMethod>("credit");
  const [crypto, setCrypto] = useState<string>("eth");
  const [cryptoPrices, setCryptoPrices] = useState<{
    eth: number;
    sol: number;
    chrle: number;
    babyu: number;
  }>({ eth: 0, sol: 0, chrle: 0, babyu: 0 });
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [currency, setCurrency] = useState<string>("USD");

  const router = useRouter();
  const { eventId, packageType } = useLocalSearchParams();
  const { user, setAuthUser } = useAuth();
  const { offer: flightOffer } = useFlight();
  const { offer: hotelOffer } = useHotel();
  const { airportToHotelOffer, hotelToEventOffer } = useTransfer();
  const { pay: payStripe } = useStripe();
  const toast = useToast();

  // useEffect(() => {
  //   const subscription = AppState.addEventListener(
  //     "change",
  //     async (nextState) => {
  //       // Detect when returning from wallet
  //       if (
  //         appState.current.match(/background|inactive/) &&
  //         nextState === "active"
  //       ) {
  //         if (checkoutUrlRef.current) {
  //           console.log(
  //             "Returned to app, reopening checkout URL to refresh state.",
  //             checkoutUrlRef.current,
  //           );
  //           await WebBrowser.openBrowserAsync(checkoutUrlRef.current);
  //         }
  //       }

  //       appState.current = nextState;
  //     },
  //   );

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;
      const res = await eventServices.get(eventId as string);
      setEvent(res.data);
    };

    const loadCryptoPrices = async () => {
      const res = await Web3API.getPrices();
      setCryptoPrices(res.data);
    };

    const loadBooking = async () => {
      if (!user?._id || !eventId) return;
      const res = await BookingAPI.getByUserIdAndEventId(
        user._id,
        eventId as string,
      );

      if (res.data && res.data.paymentStatus !== "completed") {
        console.log("Existing booking found, loading details...");
        setBooking(res.data);
      }
    };

    setLoading(true);
    loadEvent();
    loadCryptoPrices();
    loadBooking();
    setLoading(false);
  }, [eventId, user?._id]);

  useEffect(() => {
    if (user?.stripe?.paymentMethods?.length) {
      setStripePaymentId(user.stripe.paymentMethods[0].id);
    }
  }, [user]);

  useEffect(() => {
    let servicesList: string[] = [];
    let baseUSD = 0;

    let commissionRate = 0.1;

    if (currency === "chrle" || currency === "babyu") {
      commissionRate = 0.03;
    }

    if (event?.type === "ai") {
      servicesList.push("Ticket");
    } else if (
      event?.type === "user" &&
      event.fee?.type === "paid" &&
      user?.tickets.some(
        (t) =>
          t.currency.toLowerCase() === event.fee?.currency?.toLowerCase() &&
          t.price == event.fee.amount,
      )
    ) {
      servicesList.push("E-Ticket");
    }

    // EXISTING BOOKING
    if (
      booking &&
      !flightOffer &&
      !hotelOffer &&
      !airportToHotelOffer &&
      !hotelToEventOffer
    ) {
      const { flight, hotel, transfer } = booking;

      if (flight.offer) {
        servicesList.push("Round-trip Flight");
        baseUSD += Number(flight.offer.converted.totalAmount);
      }

      if (hotel.offer) {
        servicesList.push("Hotel Accommodation");
        baseUSD += Number(hotel.offer.converted.totalAmount);
      }

      if (transfer.airportToHotel.offer) {
        servicesList.push("Airport Transfer");
        baseUSD += Number(transfer.airportToHotel.offer.converted.totalAmount);
      }

      if (transfer.hotelToEvent.offer) {
        servicesList.push("Event Shuttle");
        baseUSD += Number(transfer.hotelToEvent.offer.converted.totalAmount);
      }
    } else {
      // NEW BOOKING
      if (flightOffer) {
        servicesList.push("One-Way Flight");
        baseUSD += Number(flightOffer.converted.totalAmount);
      }

      if (hotelOffer) {
        servicesList.push("Hotel Accommodation");
        baseUSD += Number(hotelOffer.converted.totalAmount);
      }

      if (airportToHotelOffer) {
        servicesList.push("Airport Transfer");
        baseUSD += Number(airportToHotelOffer.converted.totalAmount);
      }

      if (hotelToEventOffer) {
        servicesList.push("Event Shuttle");
        baseUSD += Number(hotelToEventOffer.converted.totalAmount);
      }
    }

    const commissionUSD = Number((baseUSD * commissionRate).toFixed(2));
    const totalUSD = Number((baseUSD + commissionUSD).toFixed(2));

    // 🔹 CONVERT IF CRYPTO
    if (paymentMethod === "crypto" || paymentMethod === "token") {
      const price = cryptoPrices[crypto as keyof typeof cryptoPrices];

      if (price) {
        const baseToken = Number((baseUSD / price).toFixed(2));
        const commissionToken = Number((commissionUSD / price).toFixed(2));
        const totalToken = Number((totalUSD / price).toFixed(2));

        setBaseAmount(baseToken);
        setCommissionAmount(commissionToken);
        setTotalAmount(totalToken);
      } else {
        // fallback
        setBaseAmount(baseUSD);
        setCommissionAmount(commissionUSD);
        setTotalAmount(totalUSD);
      }
    } else {
      setBaseAmount(baseUSD);
      setCommissionAmount(commissionUSD);
      setTotalAmount(totalUSD);
    }

    setServices(servicesList);
  }, [
    flightOffer,
    hotelOffer,
    airportToHotelOffer,
    hotelToEventOffer,
    event,
    booking,
    user,
    currency,
    cryptoPrices,
  ]);

  useEffect(() => {
    setCurrency(paymentMethod === "credit" ? "USD" : crypto);
  }, [paymentMethod, crypto]);

  const onBook = async () => {
    try {
      setBookLoading(true);

      const communityTicketDeposited = await handleCommunityTicket();

      if (event?.type === "user" && !communityTicketDeposited) {
        return;
      }

      let bookingId = booking?._id || null;

      if (!bookingId) {
        console.log("Creating booking before payment...");
        bookingId = await createBooking();
        if (!bookingId) {
          setBookLoading(false);
          return toast.error("Booking failed");
        }
      } else {
        if (totalAmount === 0 && event?.type === "user") {
          router.replace({
            pathname: "/booking/booked",
            params: { id: bookingId },
          });
          setBookLoading(false);
          return;
        }
      }

      if (totalAmount > 0) {
        switch (paymentMethod) {
          case "credit":
            await handleCreditPayment(bookingId);
            break;
          case "crypto":
          case "token":
            await handleCryptoPayment(bookingId);
            break;
          default:
            toast.error("Invalid payment method.");
        }
      }
    } catch (err) {
      toast.error("Process failed. Please try again.");
    } finally {
      setBookLoading(false);
    }
  };

  const handleCommunityTicket = async (): Promise<IEvent | null> => {
    if (event?.type === "user") {
      const ticket = user?.tickets.find(
        (t) =>
          t.currency === event.fee?.currency && t.price == event.fee.amount,
      );
      if (!ticket) {
        toast.error("Buy a ticket first");
        setBookLoading(false);
        router.push({
          pathname: "/tickets",
          params: {
            amount: event.fee?.amount,
            currency: event.fee?.currency,
            from: "/booking/checkout",
          },
        });
        return null;
      }

      if (!user?._id || !event._id || !event.hoster?._id) return null;

      const response = await userServices.update(user?._id as string, {
        ...user,
        tickets: user.tickets.filter((t) => t._id !== ticket._id),
      });
      if (!response.data) {
        setLoading(false);
        toast.error("Ticket deposit failed");
        return null;
      }
      setAuthUser(response.data);

      await userServices.update(event.hoster?._id as string, {
        ...event.hoster,
        tickets: [...event.hoster.tickets, ticket],
      });

      const updatedEvent = await eventServices.update(event._id, {
        ...event,
        attendees: [
          ...event.attendees,
          {
            status: "approved",
            user: user._id as any,
            ticket: {
              ticketId: ticket._id as any,
              status: "released",
            },
          },
        ],
      });

      return updatedEvent.data;
    }

    return null;
  };

  const handleCreditPayment = async (bookingId: string) => {
    if (stripePaymentId === "")
      return toast.error("Please add your credit card");

    const response = await payStripe({
      amount: totalAmount,
      currency: "USD",
      metadata: {
        type: "booking",
        bookingId,
      },
      paymentMethodId: stripePaymentId,
    });
    const txHash = response.paymentIntentId || null;

    if (!txHash) {
      await BookingAPI.remove(bookingId);
      return toast.error("Payment failed");
    }

    router.replace({
      pathname: "/booking/status",
      params: { id: bookingId },
    });
    toast.success("Experience Booked!");
  };

  const handleCryptoPayment = async (bookingId: string) => {
    if (Number(totalAmount) <= 0) {
      toast.error("Invalid amount for selected cryptocurrency.");
      return null;
    }

    const data = {
      amount: totalAmount,
      currency: crypto,
      webhook: SERVER_API_ENDPOINT + "/cryptocheckout/webhook",
      metadata: { type: "booking", bookingId },
      redirect: "eventworld://booking/status?id=" + bookingId,
    };

    const res = await Web3API.getCheckoutUrl(data);

    if (!res.data) {
      await BookingAPI.remove(bookingId);
      toast.error("Failed to initiate crypto payment.");
      return null;
    }

    const checkoutUrl = res.data;
    await Linking.openURL(checkoutUrl);
    toast.success("Experience Booked!");
  };

  const createBooking = async (): Promise<string | null> => {
    const bodyData: IBooking = {
      event: event?._id as any,
      user: user?._id as any,
      flight: {
        offer: flightOffer as any,
        status: "processing",
        booking: {},
      },
      hotel: {
        offer: hotelOffer as any,
        status: "pending",
        booking: {},
      },
      transfer: {
        airportToHotel: {
          offer: airportToHotelOffer as any,
          status: "pending",
          booking: {},
        },
        hotelToEvent: {
          offer: hotelToEventOffer as any,
          status: "pending",
          booking: {},
        },
      },
      packageType: packageType as any,
      paymentStatus: "created",
      price: {
        totalAmount,
        currency: currency,
      },
      ticketStatus: event?.type === "ai" ? "pending" : "completed",
      status: "pending",
    };

    const response = await BookingAPI.create(bodyData);

    if (response.data) {
      setBooking(response.data);
    }
    return response.data._id || null;
  };

  const isUserEventPassable =
    event?.type === "user" && event.fee?.type === "free" && totalAmount === 0;

  return (
    <SimpleContainer title="Review & Pay" scrolled>
      <View className="flex-1 gap-4 px-1">
        {/* HERO CARD */}
        <EventHeroCard
          event={event}
          packageType={packageType}
          loading={loading}
        />

        {/* BOOKING EXPLANATION STEPPER */}
        <BookingStepper event={event || null} />

        {/* RECEIPT */}
        <HighEndReceipt
          services={services}
          base={baseAmount}
          commission={commissionAmount}
          total={totalAmount}
          currency={currency}
        />

        {paymentMethod !== "credit" && (
          <LinearGradient
            colors={["#844AFF15", "#12A9FF15"]}
            start={{ x: 0, y: 0 }}
            style={{
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: "#844AFF20",
            }}
          >
            <View className="flex-row items-center">
              <View className="bg-[#844AFF] w-12 h-12 rounded-xl items-center justify-center mr-4 shadow-lg shadow-purple-300">
                <MaterialCommunityIcons
                  name="information-outline"
                  size={24}
                  color="white"
                />
              </View>
              <View className="flex-1">
                <Text className="font-poppins-semibold uppercase text-slate-900 text-sm">
                  Save with $CHRLE or $BABYU
                </Text>
                <Text className="font-dm-sans-bold text-slate-500 text-xs">
                  Pay with $CHRLE or $BABYU and reduce service fees from 10% to
                  3%. You save ${(baseAmount * 0.07).toFixed(2)} USD.
                </Text>
              </View>
            </View>
          </LinearGradient>
        )}
        {/* CURRENCY SELECTION */}
        {/* <View className="bg-slate-50 border border-slate-200 rounded-3xl p-5 gap-3">
          <Text className="text-slate-400 font-poppins-bold text-[10px] uppercase tracking-[2px]">
            Payment Currency
          </Text>

          <CurrencyList value={currency} onSelect={setCurrency} />
        </View> */}

        {/* PAYMENT METHOD */}
        <PaymentMethodGroup
          method={paymentMethod}
          stripePaymentMethodId={stripePaymentId}
          selectedCryptoCurrency={crypto}
          onSelectCryptoCurrency={setCrypto}
          onSelectMethod={setPaymentMethod}
          onSelectStripePaymentMethod={setStripePaymentId}
        />
      </View>

      {/* FOOTER ACTION */}
      <View className="mt-10 gap-4">
        <Button
          type="primary"
          label={
            bookLoading
              ? "Processing..."
              : isUserEventPassable
                ? "Join Now"
                : `Pay`
          }
          buttonClassName="h-14 rounded-2xl shadow-xl shadow-purple-200"
          textClassName="text-lg font-poppins-bold"
          loading={bookLoading}
          onPress={onBook}
        />

        <View className="flex-row items-center justify-center bg-slate-50 py-3 rounded-xl border border-slate-100">
          <MaterialCommunityIcons
            name="shield-check"
            size={16}
            color="#94a3b8"
          />
          <Text className="text-[10px] text-slate-400 font-dm-sans-bold ml-2 uppercase tracking-tight">
            256-Bit SSL Secure Checkout
          </Text>
        </View>
      </View>
    </SimpleContainer>
  );
};

export default CheckoutScreen;
