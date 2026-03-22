import UserAPI from "@/api/services/user";
import Web3API from "@/api/services/web3";
import { Button, PaymentMethodGroup } from "@/components";
import { SimpleContainer } from "@/components/organisms/layout";
import { useAirwallex } from "@/components/providers/AirwallexProvider";
import { useAuth } from "@/components/providers/AuthProvider";
import { useIap } from "@/components/providers/IapProvider";
import { useSubscription } from "@/components/providers/SubscriptionProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { SERVER_API_ENDPOINT } from "@/config/env";
import { getSubscriptionSku } from "@/constants/skus";
import { useStripe } from "@/hooks";
import { TPaymentMethod } from "@/types";
import { delay } from "@/utils/fc";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Linking, Platform, Text, View } from "react-native";
import { calculateSave, TSubscriptionItem } from ".";

const SubscriptionHeroCard = ({ subscription, loading }: any) => {
  if (loading) {
    return (
      <View className="h-32 items-center justify-center">
        <ActivityIndicator size={24} color="#844AFF" />
      </View>
    );
  }

  if (!subscription) return null;

  return (
    <View className="w-full rounded-[24px] overflow-hidden bg-white border border-slate-100">
      <LinearGradient
        colors={["rgba(132,74,255,0.08)", "transparent"]}
        style={{
          padding: 24,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text className="text-purple-600 font-poppins-bold text-[10px] uppercase tracking-widest">
            Subscription Plan
          </Text>

          <Text className="font-poppins-bold text-2xl text-slate-900 mt-1">
            {`${subscription.month} Months`}
          </Text>

          <Text className="text-slate-400 text-xs mt-1">
            Unlock premium travel features
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const FeaturesCard = ({ subscription }: any) => {
  if (!subscription) return null;

  return (
    <View className="bg-slate-50 rounded-[24px] border border-slate-200 shadow-sm p-6">
      <Text className="text-slate-400 font-poppins-bold text-[10px] uppercase tracking-[2px] mb-4">
        Included Features
      </Text>

      <View className="gap-4">
        {subscription.features.map((feature: string, i: number) => (
          <View key={i} className="flex-row items-center gap-3">
            <MaterialCommunityIcons
              name="checkbox-marked-circle"
              size={18}
              color="#10b981"
            />

            <Text className="text-slate-700 font-dm-sans-medium text-sm flex-1">
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const SubscriptionReceipt = ({ subscription, amount, currency }: any) => {
  if (!subscription) return null;

  return (
    <View className="bg-slate-50 rounded-[24px] border border-slate-200 p-6">
      <Text className="text-slate-400 font-poppins-bold text-[10px] uppercase tracking-[2px] mb-4">
        Payment Summary
      </Text>

      <View className="gap-3">
        <View className="flex-row justify-between">
          <Text className="text-slate-500 text-sm">Plan</Text>

          <Text className="font-dm-sans-bold text-slate-800">
            {subscription.month === 0
              ? "Free Plan"
              : `${subscription.month} Month Plan`}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-slate-500 text-sm">Currency</Text>

          <Text className="font-dm-sans-bold text-slate-800">
            {currency.toUpperCase()}
          </Text>
        </View>

        <View className="h-[1px] bg-slate-200 my-2" />

        <View className="flex-row justify-between items-end">
          <Text className="text-slate-600 font-dm-sans-bold">Total</Text>

          <View className="flex flex-row items-end gap-1">
            <Text className="font-poppins-bold text-slate-600 text-lg">
              {currency.toUpperCase()}
            </Text>
            <Text className="font-poppins-bold text-3xl text-slate-900">
              {amount}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const SubscriptionCheckout = () => {
  const [subscription, setSubscription] = useState<TSubscriptionItem | null>(
    null,
  );
  const [method, setMethod] = useState<TPaymentMethod>("credit");
  const [stripePaymentMethodId, setStripePaymentMethodId] =
    useState<string>("");
  const [loading, setLoading] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [sku, setSku] = useState<any>(null);
  const [crypto, setCrypto] = useState<string>("eth");
  const [cryptoPrices, setCryptoPrices] = useState<{
    eth: number;
    sol: number;
    chrle: number;
    babyu: number;
  }>({ eth: 0, sol: 0, chrle: 0, babyu: 0 });
  const [currency, setCurrency] = useState<string>("USD");

  const { id: subscriptionId, oneMonthPrice } = useLocalSearchParams();
  const { user, setAuthUser, refreshAuthUser } = useAuth();
  const { subscriptions } = useSubscription();
  const { pay: payStripe } = useStripe();
  const { pay: payAirwallex } = useAirwallex();

  const { ready, buy: buyIap, lastPurchase, resetPurchase } = useIap();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const getSubscription = async () => {
      if (!subscriptionId || !oneMonthPrice) return;

      const subscription = subscriptions.find(
        (sub) => sub._id === subscriptionId,
      );

      if (subscription) {
        const savePercent = calculateSave(
          subscription.price,
          subscription.month,
          Number(oneMonthPrice),
        );

        const formatted: TSubscriptionItem = {
          ...subscription,
          isActive: user?.subscription?.id === subscription._id,
          isRecommended: subscription.month === 6,
          save: savePercent === 0 ? undefined : savePercent,
        };

        setSubscription(formatted);
        setSku(getSubscriptionSku(subscription.month as any));
      }
    };

    const loadCryptoPrices = async () => {
      const res = await Web3API.getPrices();
      setCryptoPrices(res.data);
    };

    setLoading(true);
    getSubscription();
    loadCryptoPrices();
    setLoading(false);
  }, [subscriptionId]);

  useEffect(() => {
    if (!user?.stripe?.paymentMethods?.length) return;

    setStripePaymentMethodId(user.stripe.paymentMethods[0]?.id);
  }, [user]);

  useEffect(() => {
    if (!subscription) return;

    const amountUSD = subscription.price;

    if (method !== "credit") {
      const price = cryptoPrices[crypto as keyof typeof cryptoPrices];

      if (price) {
        const cryptoAmount = Number((amountUSD / price).toFixed(2));
        setAmount(cryptoAmount);
      } else {
        setAmount(amountUSD);
      }
    } else {
      setAmount(amountUSD);
    }
  }, [subscription, currency, cryptoPrices]);

  useEffect(() => {
    if (
      !lastPurchase?.ok ||
      lastPurchase.type !== "subscription" ||
      lastPurchase.subscriptionId !== subscriptionId
    ) {
      return;
    }

    let cancelled = false;

    const onSuccess = async () => {
      setSubLoading(true);
      const response = await UserAPI.get(user?._id as string);

      if (cancelled) return;

      if (response.data.subscription?.id === subscriptionId) {
        setAuthUser(response.data);
        toast.success("Subscribed successfully");
        resetPurchase();
        router.back();
      }
      setSubLoading(false);
    };

    onSuccess();

    return () => {
      cancelled = true;
    };
  }, [lastPurchase, subscriptionId, user?._id]);

  useEffect(() => {
    setCurrency(method === "credit" ? "USD" : crypto);
  }, [method, crypto]);

  const handleStripePayment = async (
    amount: number,
    currency: string,
  ): Promise<string | null> => {
    if (!stripePaymentMethodId) return null;

    const res = await payStripe({
      amount,
      currency,
      metadata: {
        type: "subscription",
        userId: user?._id,
        subscriptionId,
      },
      paymentMethodId: stripePaymentMethodId,
    });

    return res.paymentIntentId || null;
  };

  const handleCrypto = async () => {
    if (Number(amount) <= 0) {
      toast.error("Invalid amount for selected cryptocurrency.");
      return null;
    }

    const data = {
      amount: amount,
      currency: crypto,
      webhook: SERVER_API_ENDPOINT + "/cryptocheckout/webhook",
      metadata: { type: "subscription", subscriptionId, userId: user?._id },
      redirect: "eventworld://subscription",
    };

    const res = await Web3API.getCheckoutUrl(data);

    if (!res.data) {
      toast.error("Failed to initiate crypto payment.");
      return null;
    }

    const checkoutUrl = res.data;
    await Linking.openURL(checkoutUrl);
  };

  const handleSubscribe = async () => {
    if (!subscription) return;

    try {
      setSubLoading(true);

      if (method === "credit") {
        const result = await payAirwallex({
          amount,
          currency,
          metadata: {
            type: "subscription",
            userId: user?._id,
            subId: subscriptionId,
          },
          returnUrl: "eventworld://subscription",
        });

        if (result !== "success") return;

        await refreshAuthUser();

        await delay(2000);
        router.back();
      }

      if (method === "crypto" || method === "token") {
        await handleCrypto();
        return setSubLoading(false);
      }
    } catch (error) {
      toast.error("Subscription failed");
    } finally {
      setSubLoading(false);
    }
  };

  const handlePayIap = async () => {
    if (!sku) {
      return toast.error("Apple's production isn't ready yet");
    }
    try {
      setSubLoading(true);
      await buyIap(sku);
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <SimpleContainer title="Subscription Checkout" scrolled>
      <View className="flex-1 gap-4">
        <SubscriptionHeroCard subscription={subscription} loading={loading} />

        <FeaturesCard subscription={subscription} />

        <SubscriptionReceipt
          subscription={subscription}
          amount={amount}
          currency={currency}
        />

        {Platform.OS !== "ios" && (
          <PaymentMethodGroup
            method={method}
            stripePaymentMethodId={stripePaymentMethodId}
            selectedCryptoCurrency={crypto}
            onSelectCryptoCurrency={setCrypto}
            onSelectMethod={setMethod}
            onSelectStripePaymentMethod={setStripePaymentMethodId}
          />
        )}
      </View>

      <View className="mt-10 gap-4">
        {Platform.OS === "ios" ? (
          <Button
            type="primary"
            label="Subscribe"
            buttonClassName="h-14 rounded-2xl shadow-xl shadow-purple-200"
            textClassName="text-lg font-poppins-bold"
            loading={subLoading}
            disabled={loading || !subscription || !ready}
            onPress={handlePayIap}
          />
        ) : (
          <Button
            type="primary"
            label="Subscribe"
            buttonClassName="h-14 rounded-2xl shadow-xl shadow-purple-200"
            textClassName="text-lg font-poppins-bold"
            loading={subLoading}
            disabled={loading || !subscription || amount <= 0}
            onPress={handleSubscribe}
          />
        )}

        <View className="flex-row items-center justify-center bg-slate-50 py-3 rounded-xl border border-slate-100">
          <MaterialCommunityIcons
            name="shield-check"
            size={16}
            color="#94a3b8"
          />

          <Text className="text-[10px] text-slate-400 font-dm-sans-bold ml-2 uppercase tracking-tight">
            Secure Subscription Payment
          </Text>
        </View>
      </View>
    </SimpleContainer>
  );
};

export default SubscriptionCheckout;
