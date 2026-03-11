import { getMe } from "@/api/services/auth";
import UserAPI from "@/api/services/user";
import Web3API from "@/api/services/web3";
import { Button, PaymentMethodGroup, Spinner } from "@/components";
import { SimpleContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCommunityTicket } from "@/components/providers/CommunityTicketProvider";
import { useIap } from "@/components/providers/IapProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { SERVER_API_ENDPOINT } from "@/config/env";
import { getTicketSku } from "@/constants/skus";
import { useStripe } from "@/hooks";
import { TPaymentMethod } from "@/types";
import { ICommunityTicket } from "@/types/ticket";
import { getCurrencySymbol } from "@/utils/format";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Linking, Platform, Text, View } from "react-native";

// -----------------------------------------------------------------------------
// HERO CARD — Redesigned (Matches EventHeroCard style)
// -----------------------------------------------------------------------------

const TicketHeroCard = ({ ticket, loading }: any) => {
  if (loading) return <Spinner size="md" text="Loading ticket..." />;

  if (!ticket) return null;

  return (
    <View className="w-full rounded-[24px] overflow-hidden bg-white border border-slate-100 shadow-sm">
      <LinearGradient
        colors={["rgba(132, 74, 255, 0.05)", "transparent"]}
        className="p-4 flex-row gap-4"
      >
        <View className="relative">
          <Image
            source={{ uri: ticket.image }}
            style={{ width: 100, height: 100, borderRadius: 16 }}
            contentFit="cover"
          />

          <View className="absolute top-1 left-1 bg-white/90 px-2 py-0.5 rounded-full">
            <Text className="text-[8px] font-poppins-bold text-purple-600 uppercase">
              Ticket
            </Text>
          </View>
        </View>

        <View className="flex-1 justify-center">
          <View className="flex-row items-center gap-1 mb-1">
            <MaterialCommunityIcons
              name="ticket-confirmation"
              size={14}
              color="#844AFF"
            />
            <Text className="text-purple-600 font-poppins-bold text-[10px] uppercase tracking-widest">
              E-Ticket
            </Text>
          </View>

          <Text
            className="font-poppins-bold text-slate-800 text-lg leading-6"
            numberOfLines={2}
          >
            {ticket.name}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

// -----------------------------------------------------------------------------
// RECEIPT — Redesigned (Matches HighEndReceipt style)
// -----------------------------------------------------------------------------

const TicketReceipt = ({ ticket }: any) => {
  if (!ticket) return null;

  const currency = getCurrencySymbol(ticket.currency.toUpperCase());

  return (
    <View className="w-full">
      {/* Upper */}
      <View className="bg-slate-50 rounded-t-[24px] border-t border-l border-r border-slate-200 p-6 pb-2">
        <Text className="text-slate-400 font-poppins-bold text-[10px] uppercase tracking-[2px] mb-4">
          Price Breakdown
        </Text>

        <View className="gap-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-slate-600 font-dm-sans-medium text-sm">
              Ticket Price
            </Text>
            <View className="flex-1 h-[1px] border-b border-dotted border-slate-300 mx-4 opacity-50" />
            <Text className="text-slate-400 text-xs font-dm-sans-bold">
              {currency}
              {ticket.price}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-slate-500 font-dm-sans text-sm">Subtotal</Text>
          <Text className="text-slate-800 font-dm-sans-bold text-sm">
            {currency}
            {ticket.price}
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-slate-500 font-dm-sans text-sm">
            Service Fee
          </Text>
          <Text className="text-slate-800 font-dm-sans-bold text-sm">
            {currency}0
          </Text>
        </View>
      </View>

      {/* Punched Divider */}
      <View className="flex-row items-center justify-between bg-slate-50">
        <View className="w-5 h-10 rounded-r-full bg-white border-r border-t border-b border-slate-200 -ml-[1px]" />
        <View className="flex-1 h-[1px] border-b border-dashed border-slate-300 mx-2" />
        <View className="w-5 h-10 rounded-l-full bg-white border-l border-t border-b border-slate-200 -mr-[1px]" />
      </View>

      {/* Lower */}
      <View className="bg-slate-50 rounded-b-[24px] border-b border-l border-r border-slate-200 p-6 pt-2">
        <View className="flex-row justify-between items-end">
          <View>
            <Text className="text-slate-400 font-dm-sans-bold text-[10px] uppercase tracking-widest mb-1">
              Total Amount
            </Text>
            <Text className="font-poppins-bold text-slate-900 text-3xl">
              <Text className="text-lg text-slate-400">{currency}</Text>
              {ticket.price}
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
};

// -----------------------------------------------------------------------------
// MAIN CHECKOUT SCREEN (Fully Redesigned)
// -----------------------------------------------------------------------------

const TicketsCheckout = () => {
  const [ticket, setTicket] = useState<ICommunityTicket | null>(null);
  const [stripePaymentMethodId, setStripePaymentMethodId] = useState("");
  const [loading, setLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<TPaymentMethod>("credit");
  const [sku, setSku] = useState<any>(null);
  const [crypto, setCrypto] = useState<string>("eth");
  const [cryptoPrices, setCryptoPrices] = useState<{
    eth: number;
    sol: number;
    chrle: number;
    babyu: number;
  }>({ eth: 0, sol: 0, chrle: 0, babyu: 0 });

  const { id: ticketId, from, eventId } = useLocalSearchParams();
  const router = useRouter();
  const { user, setAuthUser } = useAuth();
  const { pay: payStripe } = useStripe();
  const { ready, buy: buyIap, lastPurchase, resetPurchase } = useIap();
  const { communityTickets } = useCommunityTicket();
  const toast = useToast();

  useEffect(() => {
    if (!ticketId) return;

    const loadTicket = async () => {
      const tkt = communityTickets.find((ct) => ct._id === ticketId) || null;
      if (tkt) {
        setTicket(tkt);
        setSku(getTicketSku(tkt.currency as any, tkt.price as any));
      }
    };

    const loadCryptoPrices = async () => {
      const res = await Web3API.getPrices();
      setCryptoPrices(res.data);
    };

    setLoading(true);
    loadTicket();
    loadCryptoPrices();
    setLoading(false);
  }, [ticketId]);

  useEffect(() => {
    if (!user?.stripe) return;
    if (!user.stripe.paymentMethods.length) return;
    setStripePaymentMethodId(user.stripe.paymentMethods[0].id);
  }, [user]);

  useEffect(() => {
    if (
      !lastPurchase?.ok ||
      lastPurchase.type !== "subscription" ||
      lastPurchase.ticketId !== ticketId
    ) {
      return;
    }

    let cancelled = false;

    const onSuccess = async () => {
      setPurchaseLoading(true);
      const response = await UserAPI.get(user?._id as string);

      if (cancelled) return;

      if (response.data) {
        setAuthUser(response.data);
        toast.success("Purhcased successfully");
        resetPurchase();
        router.back();
      }
      setPurchaseLoading(false);
    };

    onSuccess();

    return () => {
      cancelled = true;
    };
  }, [lastPurchase, ticketId, user?._id]);

  const getTokenAmount = () => {
    const totalAmount = Number(ticket?.price);
    switch (crypto) {
      case "eth":
        return (totalAmount / cryptoPrices.eth).toFixed(6);
      case "sol":
        return (totalAmount / cryptoPrices.sol).toFixed(6);
      case "chrle":
        return (totalAmount / cryptoPrices.chrle).toFixed(6);
      case "babyu":
        return (totalAmount / cryptoPrices.babyu).toFixed(6);
      default:
        return totalAmount.toFixed(2);
    }
  };

  const handlePurchase = async () => {
    if (!ticket) return;

    try {
      setPurchaseLoading(true);

      switch (paymentMethod) {
        case "credit":
          const res = await payStripe({
            amount: ticket.price,
            currency: ticket.currency,
            paymentMethodId: stripePaymentMethodId,
            metadata: {
              type: "ticket",
              ticketId: ticket._id,
              ticketPrice: ticket.price,
            },
          });
          const txHash = res.paymentIntentId;

          if (!txHash) {
            toast.error("Payment failed");
            return setPurchaseLoading(false);
          }

          // Wait for user data refresh
          const updated = await new Promise<boolean>((resolve) => {
            let elapsed = 0;
            const interval = setInterval(async () => {
              elapsed += 2000;
              const me = await getMe();

              if (me.data.tickets.length > (user?.tickets.length || 0)) {
                setAuthUser(me.data);
                clearInterval(interval);
                resolve(true);
              }

              if (elapsed >= 20000) {
                clearInterval(interval);
                resolve(false);
              }
            }, 2000);
          });

          if (updated) {
            Alert.alert("Success", "Ticket purchased successfully!");
            if (from && eventId) {
              router.replace({
                pathname: "/event/details/user",
                params: { id: eventId },
              });
            } else {
              router.replace(from || ("/mine/tickets" as any));
            }
          }
          break;

        case "crypto":
        case "token":
          const amount = getTokenAmount();
          if (Number(amount) <= 0) {
            toast.error("Invalid amount for selected cryptocurrency.");
            return null;
          }

          const data = {
            amount: amount,
            currency: crypto,
            webhook: SERVER_API_ENDPOINT + "/cryptocheckout/webhook",
            metadata: { type: "subscription", ticketId, userId: user?._id },
            redirect: "eventworld://mine/tickets",
          };

          const response = await Web3API.getCheckoutUrl(data);

          if (!response.data) {
            toast.error("Failed to initiate crypto payment.");
            return null;
          }

          const checkoutUrl = response.data;
          await Linking.openURL(checkoutUrl);
          break;

        default:
          toast.warn("No supported payment method");
      }
    } catch (err: any) {
      Alert.alert("Error", "Unable to complete purchase");
    } finally {
      setPurchaseLoading(false);
    }
  };

  const handlePayIap = async () => {
    if (!sku) {
      return toast.error("Apple's production isn't ready yet");
    }
    try {
      setPurchaseLoading(true);
      await buyIap(sku);
    } finally {
      setPurchaseLoading(false);
    }
  };

  return (
    <SimpleContainer title="Checkout" scrolled>
      <View className="flex-1 gap-8 px-1">
        <TicketHeroCard ticket={ticket} loading={loading} />

        <TicketReceipt ticket={ticket} />

        {Platform.OS !== "ios" && (
          <PaymentMethodGroup
            method={paymentMethod}
            stripePaymentMethodId={stripePaymentMethodId}
            selectedCryptoCurrency={crypto}
            onSelectCryptoCurrency={setCrypto}
            onSelectMethod={setPaymentMethod}
            onSelectStripePaymentMethod={setStripePaymentMethodId}
          />
        )}
      </View>

      {/* FOOTER ACTION */}
      <View className="mt-10 gap-4">
        {Platform.OS === "ios" ? (
          <Button
            type="primary"
            label="Subscribe"
            buttonClassName="h-14 rounded-2xl shadow-xl shadow-purple-200"
            textClassName="text-lg font-poppins-bold"
            loading={purchaseLoading}
            disabled={loading || !ticket || !ready}
            onPress={handlePayIap}
          />
        ) : (
          <Button
            type="primary"
            label={
              purchaseLoading
                ? "Processing..."
                : `Pay ${getCurrencySymbol((ticket?.currency.toUpperCase() as any) || "USD")}${
                    ticket?.price || 0
                  }`
            }
            buttonClassName="h-14 rounded-2xl shadow-xl shadow-purple-200"
            textClassName="text-lg font-poppins-bold"
            loading={purchaseLoading}
            onPress={handlePurchase}
            disabled={loading}
          />
        )}

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

export default TicketsCheckout;
