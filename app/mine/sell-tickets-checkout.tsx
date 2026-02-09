import { fetchTicketById } from "@/api/services/ticket";
import { fetchTokenPricesAndFee } from "@/api/services/web3";
import { Button, CheckoutContainer, CryptoPayout } from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { ITicket } from "@/types/ticket";
import { getCurrencySymbol } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

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
      <ActivityIndicator size={24} color="#C427E0" />
      <Text className="text-[#C427E0] font-poppins-semibold">
        Fetching Ticket...
      </Text>
    </View>;
  }

  if (!ticket) return null;

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
  totalPrice,
  fee,
  loading,
  count,
  setCount,
}: {
  ticket: ITicket | null;
  totalCount: number;
  totalPrice: number;
  fee: number;
  count: number;
  loading: boolean;
  setCount: (val: number) => void;
}) => {
  if (loading) {
    <View className="flex-1 w-full flex flex-col items-center justify-center gap-2">
      <ActivityIndicator size={24} color="#C427E0" />
      <Text className="text-[#C427E0] font-poppins-semibold">
        Fetching Ticket Details...
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
          <Text className="font-dm-sans-medium text-gray-600">Price:</Text>
          <Text className="font-poppins-semibold text-gray-800">
            {ticket?.price || 0}
          </Text>
        </View>

        <View className="w-full flex flex-row items-center justify-between">
          <Text className="font-dm-sans-medium text-gray-600">Currency:</Text>
          <Text className="font-poppins-semibold text-gray-800">
            {ticket?.currency.toUpperCase() || "-"}
          </Text>
        </View>

        <View className="w-full flex flex-row items-center justify-between">
          <Text className="font-dm-sans-medium text-gray-600">Fee:</Text>
          <Text className="font-poppins-semibold text-gray-800">{fee}%</Text>
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
            {totalPrice}
          </Text>
        </View>
      </View>
    </View>
  );
};

const MineSellTicketsCheckout = () => {
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [count, setCount] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [tokenPrices, setTokenPrices] = useState({ chrle: 0, babyu: 0 });
  const [fee, setFee] = useState<number>(0);
  const [tokenAmounts, setTokenAmounts] = useState({ chrle: 0, babyu: 0 });
  const [method, setMethod] = useState<"chrle" | "babyu">("chrle");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sellLoading, setSellLoading] = useState<boolean>(false);
  const [btnLabel, setBtnLabel] = useState<string>("Sell");

  const { id: ticketId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();

  const toast = useToast();

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) return;

      try {
        const response = await fetchTicketById(ticketId as string);
        setTicket(response.data || null);
      } catch (error) {
      } finally {
      }
    };

    const getTokenPricesAndFee = async () => {
      const response = await fetchTokenPricesAndFee();
      if (response.data) {
        setTokenPrices({ ...response.data });
        setFee(response.data.fee);
      }
    };

    setLoading(true);
    fetchTicket();
    getTokenPricesAndFee();
    setLoading(false);
  }, [ticketId]);

  useEffect(() => {
    if (!ticket?.price) return;
    setTotalPrice(count * ticket.price * (1 - fee / 100));
  }, [count, ticket?.price, fee]);

  useEffect(() => {
    const chrleAmount = Number((totalPrice / tokenPrices.chrle).toFixed(2));
    const babyuAmount = Number((totalPrice / tokenPrices.babyu).toFixed(2));
    setTokenAmounts({ chrle: chrleAmount, babyu: babyuAmount });
  }, [tokenPrices, totalPrice]);

  const handleSell = async () => {
    try {
      setSellLoading(true);

      const metadata = JSON.stringify({
        type: "ticket",
        ticket,
        payoutFee: fee,
      });

      const bodyData = {
        walletAddress,
        ticketAmount: totalPrice,
        ticketCurrency: ticket?.currency,
        metadata,
      };

      toast.success("Sold successfully");
      router.replace("/home");

      // const response = await createSellTicketPayout(bodyData);

      // if (response.data) {
      //   Alert.alert("Success", "Payout successfully");
      //   router.back();
      // }
    } catch (error: any) {
      console.log("[handle sell error]: ", error);
    } finally {
      setSellLoading(false);
    }
  };

  return (
    <CheckoutContainer>
      <Header ticket={ticket} loading={loading} />

      <Detail
        ticket={ticket}
        totalCount={user?.tickets.filter((t) => t._id === ticketId).length || 0}
        totalPrice={totalPrice}
        fee={fee}
        count={count}
        loading={loading}
        setCount={setCount}
      />

      <CryptoPayout
        method={method}
        walletAddress={walletAddress}
        tokenAmounts={tokenAmounts as any}
        loading={loading}
        onSelectMethod={setMethod}
        onWalletAddressChange={setWalletAddress}
      />

      <Button
        type="primary"
        label={btnLabel}
        buttonClassName="h-12"
        disabled={loading}
        loading={sellLoading}
        onPress={handleSell}
      />
    </CheckoutContainer>
  );
};

export default MineSellTicketsCheckout;
