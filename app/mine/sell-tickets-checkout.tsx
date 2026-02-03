import { createStripePaymentIntent } from "@/api/services/stripe";
import { fetchTicketById } from "@/api/services/ticket";
import { createTransaction } from "@/api/services/transaction";
import { fetchUser } from "@/api/services/user";
import { Button, CheckoutContainer, PaymentMethodGroup } from "@/components";
import { RootState } from "@/store";
import { setAuthUser } from "@/store/slices/auth.slice";
import { TPaymentMethod } from "@/types";
import { IStripePayload } from "@/types/stripe";
import { ITicket } from "@/types/ticket";
import { ITransaction } from "@/types/transaction";
import { getCurrencySymbol } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { confirmPayment } from "@stripe/stripe-react-native";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

const ticketCardBg = require("@/assets/images/ticket_card_bg.png");

const Header = ({
  ticket,
  loading,
}: {
  ticket: ITicket | null;
  loading: boolean;
}) => {
  if (loading) {
    <View className="w-full flex flex-col items-center justify-center gap-2">
      <ActivityIndicator size={24} />
      <Text className="text-[#C427E0] font-poppins-semibold">
        Fetching Ticket...
      </Text>
    </View>;
  }

  if (!ticket) {
    return (
      <View className="w-full flex flex-col items-center justify-center gap-2 bg-white rounded-xl py-6">
        <MaterialCommunityIcons name="cart-off" size={24} color="#374151" />
        <Text className="font-poppins-semibold text-gray-700">
          Ticket not found
        </Text>
      </View>
    );
  }

  return (
    <View className="relative w-full h-[160px] rounded-xl overflow-hidden">
      <Image
        source={ticketCardBg}
        alt="Ticket Card BG"
        style={{ width: "100%", height: "100%" }}
      />

      <View className="absolute inset-0 flex flex-row items-stretch justify-between">
        <View className="flex flex-col items-center justify-center w-1/2">
          <View className="w-[148px] h-[120px] rounded-lg overflow-hidden">
            <Image
              source={{ uri: ticket.image }}
              alt={ticket.name}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </View>
        </View>

        <View className="flex flex-col items-center justify-center w-1/2">
          <View className="flex flex-col items-center justify-between gap-6">
            <View className="flex flex-col items-center justify-center">
              <View className="flex flex-row items-start">
                <Text className="font-poppins-semibold text-lg text-gray-500">
                  {getCurrencySymbol(ticket.currency as any)}
                </Text>
                <Text className="font-poppins-semibold text-3xl text-gray-800">
                  {ticket.price}
                </Text>
              </View>

              <Text className="font-poppins text-gray-700">{ticket.name}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const Detail = ({
  ticket,
  totalCount,
  totalAmount,
  loading,
  count,
  setCount,
}: {
  ticket: ITicket | null;
  totalCount: number;
  totalAmount: number;
  count: number;
  loading: boolean;
  setCount: (val: number) => void;
}) => {
  if (loading) {
    <View className="flex-1 w-full flex flex-col items-center justify-center gap-2">
      <ActivityIndicator size={24} />
      <Text className="text-[#C427E0] font-poppins-semibold">
        Fetching Ticket...
      </Text>
    </View>;
  }

  return (
    <View className="flex-1 p-4 flex flex-col items-start justify-center gap-4 bg-white rounded-xl">
      <View className="w-full gap-2">
        <View className="w-full flex flex-row items-center justify-between">
          <Text className="font-dm-sans-medium text-gray-600">
            Total Tickets:
          </Text>
          <Text className="font-poppins-semibold text-gray-800">
            {totalCount}
          </Text>
        </View>

        <View className="w-full flex flex-row items-center justify-between">
          <Text className="font-dm-sans-medium text-gray-600">Currency:</Text>
          <Text className="font-poppins-semibold text-gray-800">
            {ticket?.currency.toUpperCase() || "-"}
          </Text>
        </View>

        <View className="w-full flex flex-row items-center justify-between">
          <Text className="font-dm-sans-medium text-gray-600">Price:</Text>
          <Text className="font-poppins-semibold text-gray-800">
            {ticket?.price || 0}
          </Text>
        </View>
      </View>

      <View className="w-full h-[1px] bg-gray-200"></View>

      <View className="w-full flex flex-row items-center justify-between gap-4">
        <Text className="font-dm-sans-medium text-gray-600 text-sm flex-1">
          How many tickets will you sell?
        </Text>

        <View className="flex flex-row items-center gap-4">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
            onPress={() => count > 1 && setCount(--count)}
          >
            <MaterialCommunityIcons name="minus" size={18} color="#1f2937" />
          </TouchableOpacity>
          <Text className="font-poppins-bold text-xl text-gray-800">
            {count}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center"
            onPress={() => count < totalCount && setCount(++count)}
          >
            <MaterialCommunityIcons name="plus" size={18} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="w-full h-[1px] bg-gray-200"></View>

      <View className="w-full flex flex-row items-center justify-between">
        <Text className="font-dm-sans-bold text-xl text-gray-600">Total:</Text>
        <View className="flex flex-row items-start">
          <Text className="font-poppins-semibold text-green-500 text-lg">
            {ticket?.currency ? getCurrencySymbol(ticket.currency as any) : "-"}
          </Text>
          <Text className="font-poppins-bold text-green-500 text-3xl">
            {totalAmount}
          </Text>
        </View>
      </View>
    </View>
  );
};

const MineSellTicketsCheckout = () => {
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [count, setCount] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [method, setMethod] = useState<TPaymentMethod>("card");
  const [stripePaymentMethodId, setStripePaymentMethodId] =
    useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [purchaseLoading, setPurchaseLoading] = useState<boolean>(false);
  const [btnLabel, setBtnLabel] = useState<string>("Sell");

  const { id: ticketId } = useLocalSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) return;

      try {
        setLoading(true);

        const response = await fetchTicketById(ticketId as string);
        setTicket(response.data || null);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    if (!user?.stripe || user.stripe.paymentMethods.length === 0) return;
    setStripePaymentMethodId(user.stripe.paymentMethods[0].id || "");
  }, [user]);

  useEffect(() => {
    if (!ticket?.price) return;
    setTotalAmount(count * ticket.price);
  }, [count, ticket?.price]);

  const handleStripePayment = async (
    amount: number,
    currency: string,
  ): Promise<boolean> => {
    if (stripePaymentMethodId === "") {
      return false;
    }

    const stripePayload: IStripePayload = {
      customerId: user?.stripe?.customerId as string,
      paymentMethodId: stripePaymentMethodId,
      amount,
      currency,
      metadata: {
        type: "ticket",
        ticketId: ticket?._id,
        ticketPrice: ticket?.price,
      },
    };

    const clientSecretResponse = await createStripePaymentIntent(
      stripePayload as any,
    );

    if (!clientSecretResponse.ok) {
      //   Alert.alert(
      //     "Payment Error",
      //     clientSecretResponse.message || "Failed to create payment.",
      //   );
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
      //   Alert.alert("Payment Confirmation Error", confirmPaymentError.message);
      return false;
    }

    const bodyData: ITransaction = {
      type: "credit",
      userId: user?._id as string,
      txId: paymentIntentId,
      amount,
      currency,
      amountReceived: 0,
      metadata: JSON.stringify(stripePayload.metadata),
      status: "created",
      service: "ticket",
    };

    await createTransaction(bodyData);

    return true;
  };

  const handlePurchase = async () => {
    if (!ticket) return;

    try {
      setPurchaseLoading(true);
      setBtnLabel("Processing Payment...");
      let paymentResult = false;

      switch (method) {
        case "card":
          paymentResult = await handleStripePayment(
            ticket.price,
            ticket.currency,
          );
          break;
      }

      if (!paymentResult) {
        Alert.alert("Error", "Payment Failed");
        return setPurchaseLoading(false);
      }

      const waitForUpdate = async (timeout = 20000) => {
        if (!user) return;

        const intervalTime = 2000;
        let elapsed = 0;

        return new Promise<boolean>((resolve) => {
          const interval = setInterval(async () => {
            elapsed += intervalTime;

            const response = await fetchUser(user?._id as string);

            if (response.data.tickets.length > user?.tickets.length) {
              clearInterval(interval);
              resolve(true);
            }

            if (elapsed >= timeout) {
              clearInterval(interval);
              resolve(false);
            }
          }, intervalTime);
        });
      };

      setBtnLabel("Checking Payment...");
      const updated = await waitForUpdate();

      if (updated) {
        Alert.alert("Success", "Ticket is purchased");

        const response = await fetchUser(user?._id as string);

        if (response.data) {
          dispatch(setAuthUser(response.data));
        }

        router.back();
      }
    } catch (error: any) {
      Alert.alert("Error", error?.response?.message || "Internal Server Error");
    } finally {
      setBtnLabel("Purchase");
      setPurchaseLoading(false);
    }
  };

  return (
    <CheckoutContainer>
      <Header ticket={ticket} loading={loading} />

      <Detail
        ticket={ticket}
        totalCount={user?.tickets.filter((t) => t._id === ticketId).length || 0}
        totalAmount={totalAmount}
        count={count}
        loading={loading}
        setCount={setCount}
      />

      <PaymentMethodGroup
        method={method}
        stripePaymentMethodId={stripePaymentMethodId}
        onSelectMethod={setMethod}
        onSelectStripePaymentMethod={setStripePaymentMethodId}
      />

      <Button
        type="primary"
        label={btnLabel}
        buttonClassName="h-12"
        disabled={loading}
        loading={purchaseLoading}
        onPress={handlePurchase}
      />
    </CheckoutContainer>
  );
};

export default MineSellTicketsCheckout;
