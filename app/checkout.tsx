import { bookingFlightMethod, ticketFlightMethod } from "@/api/scripts/booking";
import { fetchEvent } from "@/api/scripts/event";
import {
  fetchStripeClientSecret,
  fetchStripeCustomerId,
  saveStripePaymentMethod,
} from "@/api/scripts/stripe";
import { Button, CryptoPaymentQR, Spinner } from "@/components/common";
import { StripePaymentMethodGroup } from "@/components/molecules";
import { CheckoutContainer } from "@/components/organisms";
import { setAuthUser } from "@/redux/slices/auth.slice";
import { RootState } from "@/redux/store";
import { TCurrency, TPaymentMethod } from "@/types";
import { IEvent } from "@/types/data";
import { formatEventDate, formatName, getCurrencySymbol } from "@/utils/format";
import {
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import {
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

      <View className="w-full flex flex-row items-start gap-6">
        <View className="flex-1 flex-row items-center gap-4">
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
  const [cardDetails, setCardDetails] = useState<any>(null);
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
  const [isBookLoading, setIsBookLoading] = useState<boolean>(false);

  const { eventId, packageType } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { flight, hotel } = useSelector((state: RootState) => state.booking);

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

    setStripePaymentMethodId(
      user.stripe.payment_methods[0].payment_method_id || ""
    );
  }, [user]);

  useEffect(() => {
    const flightPrice =
      Number(
        flight?.recommend?.FareItinerary?.AirItineraryFareInfo?.ItinTotalFares
          ?.TotalFare?.Amount
      ) || 0;

    const hotelPrice = Number(hotel?.recommend?.total) || 0;

    const base = flightPrice + hotelPrice;
    const comm = base * 0.1;
    const total = base + comm;

    setBasePrice(Number(base.toFixed(2)));
    setCommissionPrice(Number(comm.toFixed(2)));
    setTotalPrice(Number(total.toFixed(2)));

    setCurrency((hotel?.recommend?.currency?.toLowerCase() || "usd") as any);

    const selectedServices = [];
    if (flight?.recommend) selectedServices.push("Flight");
    if (hotel?.recommend) selectedServices.push("Hotel");
    setServices(selectedServices);
  }, [flight, hotel]);

  const bookWithCard = async () => {
    if (
      !flight?.payload ||
      !flight.session_id ||
      !flight?.recommend?.FareItinerary?.AirItineraryFareInfo?.FareSourceCode ||
      !user?.location.region_code
    )
      return Alert.alert(
        "Invalid Flight Information",
        "Please select another flight"
      );

    const bookResponse = await bookingFlightMethod(flight.payload);

    const { errorMessage, success, uniqueId } = bookResponse.data;

    const isSuccess = String(success).toLowerCase() === "true";

    if (!isSuccess || !uniqueId) {
      return Alert.alert("Booking Flight Error", errorMessage);
    }

    const ticketResponse = await ticketFlightMethod(uniqueId);

    if (!ticketResponse.data.success) {
      return Alert.alert(
        "Flight Ticket Order Error",
        ticketResponse.data.errorMessage
      );
    }

    console.log("Ticket is ordered: ", ticketResponse.data);
  };

  const handleBook = async (paymentMethod: TPaymentMethod) => {
    try {
      setIsBookLoading(true);
      switch (paymentMethod) {
        case "card":
          await bookWithCard();
          break;

        case "crypto":
          break;

        case "token":
          break;

        default:
          return;
      }
    } catch (error: any) {
      console.error("handle book error: ", error);
      const message = error?.response?.data?.message;
      Alert.alert(message);
    } finally {
      setIsBookLoading(false);
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
        label="Book Now"
        buttonClassName="h-12"
        textClassName="text-lg"
        disabled={paymentMethod === "card" && stripePaymentMethodId === ""}
        loading={isBookLoading}
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
