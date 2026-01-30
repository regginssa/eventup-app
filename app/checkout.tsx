import {
  createBooking,
  createFlightOrder,
  createHotelOrder,
  createTransferOrder,
} from "@/api/services/booking";
import { fetchEvent } from "@/api/services/event";
import {
  createStripePaymentIntent,
  fetchStripeClientSecret,
  fetchStripeCustomerId,
  saveStripePaymentMethod,
} from "@/api/services/stripe";
import { Button, CryptoPaymentQR, Spinner } from "@/components/common";
import { StripePaymentMethodGroup } from "@/components/molecules";
import { CheckoutContainer } from "@/components/organisms";
import { RootState } from "@/store";
import { setAuthUser } from "@/store/slices/auth.slice";
import { TCurrency, TPackageType, TPaymentMethod } from "@/types";
import { TAmadeusFlightOrder, TAmadeusHotelOrder } from "@/types/amadeus";
import {
  IBooking,
  TBookingFlight,
  TBookingHotel,
  TBookingTransfer,
} from "@/types/booking";
import { IEvent } from "@/types/event";
import { formatDateTime, formatName, getCurrencySymbol } from "@/utils/format";
import {
  mapAmadeusFlightOrderToBookingFlightData,
  mapAmadeusHotelOrderToBookingHotelData,
  mapAmadeusTransferOrderToBookingTransferData,
} from "@/utils/map";
import {
  Fontisto,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import {
  confirmPayment,
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const CardsGroup = require("@/assets/images/icons/credit_cards_group.png");
const ETH = require("@/assets/images/icons/eth.png");
const USDT = require("@/assets/images/icons/usdt.png");
const USDC = require("@/assets/images/icons/usdc.png");
const BNB = require("@/assets/images/icons/bnb.png");
const SOL = require("@/assets/images/icons/sol.png");
const TON = require("@/assets/images/icons/ton.png");

type TCrypto = "eth" | "usdt" | "usdc" | "bnb" | "sol" | "ton";

const EventDetail = ({
  event,
  loading,
  packageType,
  totalPrice,
  currency,
}: {
  event?: IEvent;
  loading: boolean;
  packageType: "standard" | "gold";
  totalPrice: number;
  currency: TCurrency;
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
                  <Fontisto name="map-marker-alt" size={20} color="#374151" />
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
              </View>
            </View>
          </View>

          <View className="w-full h-[1px] bg-gray-200"></View>

          <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-poppins-semibold text-lg text-gray-700">
              {formatName(packageType)} Package
            </Text>

            <Text className="font-poppins-semibold text-lg text-gray-700">
              {getCurrencySymbol(currency)}
              {totalPrice}
            </Text>
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
  currency,
}: {
  services: string[];
  totalPrice: number;
  basePrice: number;
  comissionPrice: number;
  currency: TCurrency;
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
        <Text className="font-poppins-medium text-lg text-gray-500">
          {getCurrencySymbol(currency)}
          {basePrice}
        </Text>
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
        <Text className="font-poppins-medium text-lg text-gray-500">
          {getCurrencySymbol(currency)}
          {comissionPrice}
        </Text>
      </View>

      <View className="w-full h-[1px] bg-gray-200"></View>

      <View className="w-full flex flex-row items-center justify-between">
        <Text className="font-poppins-semibold text-lg text-gray-700">
          Total
        </Text>

        <Text className="font-poppins-semibold text-lg text-gray-700">
          {getCurrencySymbol(currency)}
          {totalPrice}
        </Text>
      </View>
    </View>
  );
};

const CardPayment = ({
  methodId,
  onSelectMethod,
}: {
  methodId: string;
  onSelectMethod: (id: string) => void;
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleAddCard = async () => {
    try {
      setLoading(true);

      if (!user?.stripe.customer_id) {
        await fetchStripeCustomerId();
      }

      const clientSecretRes = await fetchStripeClientSecret();
      if (!clientSecretRes.data) {
        setLoading(false);
        return Alert.alert("Error", "No Stripe client secret found.");
      }

      const { error } = await initPaymentSheet({
        setupIntentClientSecret: clientSecretRes.data,
        merchantDisplayName: "Charlie Party",
      });

      if (error) {
        console.error("Error initializing payment sheet:", error);
        setLoading(false);
        return Alert.alert("Error", "Failed to initialize payment sheet.");
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        console.error("Payment sheet error:", presentError);
        return Alert.alert("Error", "Payment sheet failed.");
      }

      const response = await saveStripePaymentMethod(clientSecretRes.data);

      dispatch(setAuthUser(response.data));
      Alert.alert("Success", "Card is successfully saved");
    } catch (error) {
      console.error("Error adding card:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full gap-4">
      <View className="w-full flex flex-row items-center justify-between">
        <View className="flex-1">
          <Image
            source={CardsGroup}
            alt="cards group"
            style={{ width: 198, height: 26 }}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          className="rounded-md bg-blue-500 py-2 px-3"
          onPress={handleAddCard}
        >
          {loading ? (
            <ActivityIndicator color="white" size={16} />
          ) : (
            <Text className="text-white font-dm-sans text-sm">
              {user?.stripe.payment_methods.length &&
              user?.stripe.payment_methods.length > 0
                ? "Add another card"
                : "Add card"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {user?.stripe.payment_methods &&
        user.stripe.payment_methods.length > 0 && (
          <>
            <StripePaymentMethodGroup
              methods={user.stripe.payment_methods}
              selectedMethodId={methodId}
              onSelectMethod={onSelectMethod}
            />
          </>
        )}
    </View>
  );
};

const CryptoPayment = () => {
  const [crypto, setCrypto] = useState<TCrypto>("eth");

  const cryptos = [
    { label: "ETH", icon: ETH, value: "eth" },
    { label: "USDT", icon: USDT, value: "usdt" },
    { label: "USDC", icon: USDC, value: "usdc" },
    { label: "BNB", icon: BNB, value: "bnb" },
    { label: "SOL", icon: SOL, value: "sol" },
    { label: "TON", icon: TON, value: "ton" },
  ];

  return (
    <View className="w-full gap-4">
      <Text className="text-gray-500 font-dm-sans text-sm">Select coin</Text>

      <View className="w-full flex flex-row gap-4">
        {cryptos.slice(0, 3).map((c, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            className="p-2 bg-[#F2F6FC] flex-1 rounded-md flex flex-row items-center justify-between"
            style={{
              borderWidth: 1,
              borderColor: crypto === c.value ? "#44F68F" : "white",
            }}
            onPress={() => setCrypto(c.value as TCrypto)}
          >
            <View className="flex flex-row items-center gap-2">
              <Image
                source={c.icon}
                alt={c.label}
                style={styles.cryptoIcon}
                contentFit="cover"
              />
              <Text className="font-dm-sans text-gray-700 text-sm">
                {c.label}
              </Text>
            </View>

            {crypto === c.value && (
              <MaterialIcons name="check-circle" size={16} color="#44F68F" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View className="w-full flex flex-row gap-4">
        {cryptos.slice(3, 6).map((c, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            className="p-2 bg-[#F2F6FC] flex-1 rounded-md flex flex-row items-center justify-between"
            style={{
              borderWidth: 1,
              borderColor: crypto === c.value ? "#44F68F" : "white",
            }}
            onPress={() => setCrypto(c.value as TCrypto)}
          >
            <View className="flex flex-row items-center gap-2">
              <Image
                source={c.icon}
                alt={c.label}
                style={styles.cryptoIcon}
                contentFit="cover"
              />
              <Text className="font-dm-sans text-gray-700 text-sm">
                {c.label}
              </Text>
            </View>

            {crypto === c.value && (
              <MaterialIcons name="check-circle" size={16} color="#44F68F" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View className="w-full flex flex-row items-center gap-5">
        <CryptoPaymentQR
          amount={0.003}
          address=""
          network={crypto}
          size={120}
        />

        <View className="flex-1 flex-col justify-between gap-10">
          <Text className="font-dm-sans-bold text-gray-500">Order details</Text>

          <View className="">
            <View className="w-full flex flex-row items-center justify-between">
              <Text className="font-dm-sans text-gray-500">Total</Text>
              <Text className="font-dm-sans text-gray-500">144 USD</Text>
            </View>

            <View className="w-full flex flex-row items-center justify-between">
              <Text className="font-dm-sans text-gray-500">Amount</Text>
              <Text className="font-dm-sans text-gray-500">0.032 ETH</Text>
            </View>
            <View className="w-full h-[1px] bg-gray-200 mt-2"></View>
          </View>
        </View>
      </View>

      <Text className="font-dm-sans-bold text-gray-600">Scan the QR code</Text>
      <Text className="font-dm-sans-bold text-gray-600">
        Or Please send to address:
      </Text>
      <View className="w-full flex flex-row items-center p-2 rounded-md bg-[#F2F6FC]">
        <Text className="flex-1 text-gray-600 font-dm-sans-medium">
          1KJHD3GdHHS8JHGgfd........GDjkhfk7Y4e3Sc
        </Text>
        <TouchableOpacity activeOpacity={0.8} className="">
          <MaterialIcons name="copy-all" size={20} color="#4b5563" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const PaymentMethods = ({
  method,
  stripePaymentMethodId,
  onSelectMethod,
  onSelectStripePaymentMethod,
}: {
  method: TPaymentMethod;
  stripePaymentMethodId: string;
  onSelectMethod: (method: TPaymentMethod) => void;
  onSelectStripePaymentMethod: (id: string) => void;
}) => {
  return (
    <View className="w-full bg-white rounded-xl p-4 gap-6">
      <Text className="font-poppins-semibold text-gray-700">
        Payment methods
      </Text>

      <Text className="font-dm-sans text-sm text-gray-400">
        Select your payment method
      </Text>

      <View className="w-full flex flex-row items-center justify-between">
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-[82px] h-[82px] rounded-md relative"
          onPress={() => onSelectMethod("card")}
        >
          <View className="absolute inset-[1px] bg-gray-300 rounded-md z-10"></View>
          {method === "card" && (
            <LinearGradient
              colors={["#C427E0", "#844AFF", "#12A9FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.paymentMethodGradient}
            />
          )}

          <View className="absolute inset-[2px] bg-[#F2F4F3] z-30 rounded-md flex flex-col items-center justify-center gap-2">
            {method === "card" ? (
              <MaskedView
                style={{ width: 40, height: 40 }}
                maskElement={
                  <MaterialCommunityIcons
                    name="credit-card-check-outline"
                    size={40}
                    color="#374151"
                  />
                }
              >
                <LinearGradient
                  colors={["#C427E0", "#844AFF", "#12A9FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1 }}
                />
              </MaskedView>
            ) : (
              <MaterialCommunityIcons
                name="credit-card-check-outline"
                size={40}
                color="#374151"
              />
            )}

            <Text className="font-poppins-medium text-lg text-gray-700">
              Card
            </Text>
          </View>

          {method === "card" && (
            <View className="absolute w-8 h-8 flex items-center justify-center bg-green-500 z-40 -right-3 -top-1 rounded-sm">
              <MaterialCommunityIcons
                name="check-bold"
                size={16}
                color="white"
              />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-[82px] h-[82px] rounded-md relative"
          onPress={() => onSelectMethod("crypto")}
        >
          <View className="absolute inset-[1px] bg-gray-300 rounded-md z-10"></View>
          {method === "crypto" && (
            <LinearGradient
              colors={["#C427E0", "#844AFF", "#12A9FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.paymentMethodGradient}
            />
          )}

          <View className="absolute inset-[2px] bg-[#F2F4F3] z-30 rounded-md flex flex-col items-center justify-center gap-2">
            {method === "crypto" ? (
              <MaskedView
                style={{ width: 40, height: 40 }}
                maskElement={
                  <MaterialCommunityIcons
                    name="bitcoin"
                    size={40}
                    color="#374151"
                  />
                }
              >
                <LinearGradient
                  colors={["#C427E0", "#844AFF", "#12A9FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1 }}
                />
              </MaskedView>
            ) : (
              <MaterialCommunityIcons
                name="bitcoin"
                size={40}
                color="#374151"
              />
            )}

            <Text className="font-poppins-medium text-lg text-gray-700">
              Crypto
            </Text>
          </View>

          {method === "crypto" && (
            <View className="absolute w-8 h-8 flex items-center justify-center bg-green-500 z-40 -right-3 -top-1 rounded-sm">
              <MaterialCommunityIcons
                name="check-bold"
                size={16}
                color="white"
              />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-[82px] h-[82px] rounded-md relative"
          onPress={() => onSelectMethod("token")}
        >
          <View className="absolute inset-[1px] bg-gray-300 rounded-md z-10"></View>
          {method === "token" && (
            <LinearGradient
              colors={["#C427E0", "#844AFF", "#12A9FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.paymentMethodGradient}
            />
          )}

          <View className="absolute inset-[2px] bg-[#F2F4F3] z-30 rounded-md flex flex-col items-center justify-center gap-2">
            {method === "token" ? (
              <MaskedView
                style={{ width: 40, height: 40 }}
                maskElement={
                  <MaterialCommunityIcons
                    name="unicorn-variant"
                    size={40}
                    color="#374151"
                  />
                }
              >
                <LinearGradient
                  colors={["#C427E0", "#844AFF", "#12A9FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1 }}
                />
              </MaskedView>
            ) : (
              <MaterialCommunityIcons
                name="unicorn-variant"
                size={40}
                color="#374151"
              />
            )}

            <Text className="font-poppins-medium text-lg text-gray-700">
              Token
            </Text>
          </View>

          {method === "token" && (
            <View className="absolute w-8 h-8 flex items-center justify-center bg-green-500 z-40 -right-3 -top-1 rounded-sm">
              <MaterialCommunityIcons
                name="check-bold"
                size={16}
                color="white"
              />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View className="w-full h-[1px] bg-gray-200"></View>

      {method === "card" ? (
        <CardPayment
          methodId={stripePaymentMethodId}
          onSelectMethod={onSelectStripePaymentMethod}
        />
      ) : method === "crypto" ? (
        <CryptoPayment />
      ) : (
        <></>
      )}
    </View>
  );
};

const CheckoutScreen = () => {
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
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

  const { eventId, packageType } = useLocalSearchParams();
  const router = useRouter();

  const { user } = useSelector((state: RootState) => state.auth);
  const { flight, hotel, transfer } = useSelector(
    (state: RootState) => state.booking
  );
  const [bookLabel, setBookLabel] = useState<string>("Book Now");

  const dispatch = useDispatch();

  const getEvent = useCallback(async () => {
    if (!eventId || typeof eventId !== "string") return;

    try {
      setEventLoading(true);

      const response = await fetchEvent(eventId);

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
    if (!user?.stripe) return;

    if (user.stripe.payment_methods.length === 0) return;
    setStripePaymentMethodId(
      user.stripe.payment_methods[0].payment_method_id || ""
    );
  }, [user]);

  useEffect(() => {
    let base = 0;
    let services: string[] = [];

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

    const total = base + base * 0.1;

    setBasePrice(Number(base.toFixed(2)));
    setTotalPrice(Number(total.toFixed(2)));
    setCommissionPrice(Number((base * 0.1).toFixed(2)));
    setServices(services);
  }, [flight, hotel, transfer]);

  const handleStripePayment = async (
    amount: number,
    currency: string
  ): Promise<boolean> => {
    const stripePayload = {
      customerId: user?.stripe.customer_id,
      paymentMethodId: stripePaymentMethodId,
      amount,
      currency,
      bookingOption: "flight",
      packageType: packageType as TPackageType,
    };

    const clientSecretResponse = await createStripePaymentIntent(
      stripePayload as any
    );

    if (!clientSecretResponse.ok) {
      Alert.alert(
        "Payment Error",
        clientSecretResponse.message || "Failed to create payment intent."
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

  const book = async () => {
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

    const flightPrice = Number(flight?.offers[0]?.price.total) || 0;
    const hotelPrice = Number(hotel?.offers[0]?.offers[0]?.price?.total) || 0;
    const transferPriceAH =
      Number(transfer?.ah[0]?.quotation?.monetaryAmount) || 0;
    const transferPriceHE =
      Number(transfer?.he[0]?.quotation?.monetaryAmount) || 0;

    // Pay total amount first
    // setBookLabel("Processing Payment...");
    // const paymentResult = await handleStripePayment(totalPrice, currency);

    // if (!paymentResult) {
    //   setBookLabel("Book Now");
    //   return Alert.alert("Error", "Failed to make payment.");
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

      return {
        flightOrder,
        hotelOrder,
        transferOrders,
        billingAddress,
        billingPayment,
      };
    } catch (error: any) {
      setBookLabel("Book Now");
      console.error("handle book error: ", error);
      Alert.alert(
        "Error",
        error?.response?.data?.message || error?.message || "Failed to book."
      );
    }
  };

  const handleBook = async (paymentMethod: TPaymentMethod) => {
    if (!user?._id || !eventId) return Alert.alert("Error", "Unauthorized");

    try {
      setBookLoading(true);

      const basicBookingData = await book();

      // Refund payment if failed to book (flight, hotel, transfers)
      if (!basicBookingData) {
        setBookLabel("Book Now");
        return Alert.alert("Error", "Failed to book.");
      }

      setBookLabel("Creating Booking...");

      const bookingData: IBooking = {
        flight: basicBookingData.flightOrder as any,
        hotel: basicBookingData.hotelOrder as any,
        transfer: basicBookingData.transferOrders as any,
        timezone: event?.dates?.timezone || "",
        event: event?._id as any,
        user: user._id as any,
        price: {
          total: totalPrice,
          base: basePrice,
          comission: commissionPrice,
          currency: currency.toUpperCase(),
        },
        billingAddress: basicBookingData.billingAddress as any,
        billingPayment: basicBookingData.billingPayment as any,
      };

      const response = await createBooking(bookingData);

      if (response.data) {
        router.push({
          pathname: "/booked",
          params: {
            bookingId: response.data._id as string,
            eventId,
            packageType,
          },
        });
      }
    } catch (error: any) {
      console.error("handle book error: ", error);
      const message = error?.response?.data?.message;
      Alert.alert("Error", message);
    } finally {
      setBookLabel("Book Now");
      setBookLoading(false);
    }
  };

  return (
    <CheckoutContainer>
      <EventDetail
        event={event}
        loading={eventLoading}
        packageType={packageType as any}
        totalPrice={totalPrice}
        currency="usd"
      />
      <PriceDetail
        services={services}
        totalPrice={totalPrice}
        basePrice={basePrice}
        comissionPrice={commissionPrice}
        currency={currency}
      />
      <PaymentMethods
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
    </CheckoutContainer>
  );
};

const styles = StyleSheet.create({
  paymentMethodGradient: {
    position: "absolute",
    inset: 1,
    borderRadius: 6,
    zIndex: 10,
  },

  cryptoIcon: {
    width: 16,
    height: 16,
  },
});

export default CheckoutScreen;
