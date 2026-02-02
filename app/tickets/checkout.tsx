import { fetchTicketById } from "@/api/services/ticket";
import { Button, CheckoutContainer, PaymentMethodGroup } from "@/components";
import { RootState } from "@/store";
import { TPaymentMethod } from "@/types";
import { ITicket } from "@/types/ticket";
import { getCurrencySymbol } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSelector } from "react-redux";

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
      <View className="w-full flex flex-col items-center justify-center gap-2">
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
  loading,
}: {
  ticket: ITicket | null;
  loading: boolean;
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
    <View className="flex-1 p-4 flex flex-col items-start justify-center gap-6 bg-white rounded-xl">
      <Text className="font-poppins-bold text-3xl text-gray-800">
        {ticket?.name || "N/A"}
      </Text>

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

      <View className="w-full h-[1px] bg-gray-200"></View>

      <View className="w-full flex flex-row items-center justify-between">
        <Text className="font-dm-sans-bold text-xl text-gray-600">Total:</Text>
        <View className="flex flex-row items-start">
          <Text className="font-poppins-semibold text-green-500 text-sm">
            {ticket?.currency ? getCurrencySymbol(ticket.currency as any) : "-"}
          </Text>
          <Text className="font-poppins-bold text-green-500 text-3xl">
            {ticket?.price || 0}
          </Text>
        </View>
      </View>
    </View>
  );
};

const TicketsCheckout = () => {
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [method, setMethod] = useState<TPaymentMethod>("card");
  const [stripePaymentMethodId, setStripePaymentMethodId] =
    useState<string>("");

  const { id: ticketId } = useLocalSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);

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
    if (!user?.stripe) return;

    if (user.stripe.paymentMethods.length === 0) return;
    setStripePaymentMethodId(user.stripe.paymentMethods[0].id || "");
  }, [user]);

  return (
    <CheckoutContainer>
      <Header ticket={ticket} loading={loading} />

      <Detail ticket={ticket} loading={loading} />

      <PaymentMethodGroup
        method={method}
        stripePaymentMethodId={stripePaymentMethodId}
        onSelectMethod={setMethod}
        onSelectStripePaymentMethod={setStripePaymentMethodId}
      />

      <Button type="primary" label="Purchase" buttonClassName="h-12" />
    </CheckoutContainer>
  );
};

export default TicketsCheckout;
