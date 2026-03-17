import { fetchTicketById } from "@/api/services/ticket";
import { fetchTokenPricesAndFee } from "@/api/services/web3";
import { Button, CryptoPayout } from "@/components";
import { SimpleContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { ICommunityTicket } from "@/types/ticket";
import { getCurrencySymbol } from "@/utils/format";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

const TicketHeroCard = ({ ticket, loading }: any) => {
  if (loading) {
    return (
      <View className="h-32 justify-center">
        <ActivityIndicator size="large" color="#844AFF" />
      </View>
    );
  }

  if (!ticket) return null;

  return (
    <View className="w-full rounded-[24px] overflow-hidden bg-white border border-slate-100 shadow-sm">
      <LinearGradient
        colors={["rgba(16,185,129,0.08)", "transparent"]}
        style={{ padding: 16, display: "flex", flexDirection: "row", gap: 16 }}
      >
        <Image
          source={{ uri: ticket.image }}
          style={{ width: 100, height: 100, borderRadius: 16 }}
          contentFit="cover"
        />

        <View className="flex-1 justify-center">
          <Text className="text-emerald-600 font-bold text-[10px] uppercase tracking-widest mb-1">
            SELL TICKET
          </Text>

          <Text className="font-bold text-slate-800 text-lg" numberOfLines={2}>
            {ticket.name}
          </Text>

          <View className="flex-row items-center mt-2">
            <Text className="text-slate-400 text-xs">
              {ticket.currency.toUpperCase()}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const SellStepper = () => {
  const steps = [
    {
      title: "Select Tickets",
      description: "Choose how many tickets you want to sell.",
    },
    {
      title: "Choose Payout Method",
      description: "Select your preferred crypto payout.",
    },
    {
      title: "Enter Wallet",
      description: "Provide the wallet where funds will be sent.",
    },
    {
      title: "Complete Sale",
      description: "Once confirmed your payout will be processed.",
    },
  ];

  return (
    <View className="bg-slate-50 rounded-[24px] border border-slate-200 p-6">
      <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-[2px] mb-4">
        Selling Process
      </Text>

      {steps.map((step, i) => (
        <View key={i} className="flex-row gap-4 mb-6">
          <View className="w-4 h-4 rounded-full bg-emerald-500 mt-1" />

          <View className="flex-1">
            <Text className="font-bold text-emerald-600 text-sm">
              {step.title}
            </Text>

            <Text className="text-slate-400 text-xs mt-1">
              {step.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const SellTicketReceipt = ({ price, count, fee, total, currency }: any) => {
  return (
    <View className="w-full">
      <View className="bg-slate-50 rounded-t-[24px] border border-slate-200 p-6 pb-2">
        <Text className="text-slate-400 font-bold text-[10px] uppercase tracking-[2px] mb-4">
          Sale Breakdown
        </Text>

        <View className="gap-3">
          <Row label="Ticket Price" value={`${currency}${price}`} />
          <Row label="Tickets" value={count} />
          <Row label="Platform Fee" value={`${fee}%`} />

          <View className="flex-row justify-between mt-2">
            <Text className="text-slate-500 text-sm">Estimated Earnings</Text>

            <Text className="text-slate-800 font-bold">
              {currency}
              {total}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center justify-between bg-slate-50">
        <View className="w-5 h-10 rounded-r-full bg-white border-r border-slate-200 -ml-[1px]" />
        <View className="flex-1 h-[1px] border-b border-dashed border-slate-300 mx-2" />
        <View className="w-5 h-10 rounded-l-full bg-white border-l border-slate-200 -mr-[1px]" />
      </View>

      <View className="bg-slate-50 rounded-b-[24px] border border-slate-200 p-6 pt-2">
        <View className="flex-row justify-between items-end">
          <View>
            <Text className="text-slate-400 text-[10px] uppercase tracking-widest">
              You Receive
            </Text>

            <Text className="font-bold text-slate-900 text-3xl">
              <Text className="text-lg text-slate-400">{currency}</Text>
              {total}
            </Text>
          </View>

          <View className="bg-emerald-100 px-3 py-1.5 rounded-xl">
            <Text className="text-[10px] font-bold text-emerald-600 uppercase">
              Secure Payout
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const Row = ({ label, value }: any) => (
  <View className="flex-row justify-between items-center">
    <Text className="text-slate-600 text-sm">{label}</Text>
    <Text className="text-slate-800 font-bold text-sm">{value}</Text>
  </View>
);

const MineSellTicketsCheckout = () => {
  const [ticket, setTicket] = useState<ICommunityTicket | null>(null);
  const [count, setCount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [tokenPrices, setTokenPrices] = useState({ chrle: 0, babyu: 0 });
  const [fee, setFee] = useState(0);
  const [tokenAmounts, setTokenAmounts] = useState({ chrle: 0, babyu: 0 });
  const [method, setMethod] = useState<"chrle" | "babyu">("chrle");
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);

  const { id: ticketId } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const fetchTicket = async () => {
      if (!ticketId) return;
      const response = await fetchTicketById(ticketId as string);
      setTicket(response.data || null);
    };

    const getPrices = async () => {
      const response = await fetchTokenPricesAndFee();
      if (response.data) {
        setTokenPrices(response.data);
        setFee(response.data.fee);
      }
    };

    setLoading(true);
    fetchTicket();
    getPrices();
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

      toast.success("Sold successfully");
      router.replace("/home");
    } catch (error) {
      console.log(error);
    } finally {
      setSellLoading(false);
    }
  };

  return (
    <SimpleContainer title="Sell Tickets" scrolled>
      <View className="flex-1 gap-4 px-1">
        <TicketHeroCard ticket={ticket} loading={loading} />

        <SellStepper />

        <SellTicketReceipt
          price={ticket?.price || 0}
          count={count}
          fee={fee}
          total={totalPrice}
          currency={
            ticket?.currency
              ? getCurrencySymbol(ticket.currency.toUpperCase() as any)
              : "$"
          }
        />

        <CryptoPayout
          method={method}
          walletAddress={walletAddress}
          tokenAmounts={tokenAmounts as any}
          loading={loading}
          onSelectMethod={setMethod}
          onWalletAddressChange={setWalletAddress}
        />
      </View>

      <View className="mt-10 gap-4">
        <Button
          type="primary"
          label="Sell Tickets"
          buttonClassName="h-14 rounded-2xl shadow-xl shadow-emerald-200"
          textClassName="text-lg font-bold"
          loading={sellLoading}
          disabled={loading}
          onPress={handleSell}
        />
      </View>
    </SimpleContainer>
  );
};

export default MineSellTicketsCheckout;
