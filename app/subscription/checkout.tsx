import { createStripePaymentIntent } from "@/api/services/stripe";
import { fetchSubscriptionById } from "@/api/services/subscription";
import { fetchUser } from "@/api/services/user";
import { Button, CheckoutContainer, PaymentMethodGroup } from "@/components";
import { RootState } from "@/store";
import { setAuthUser } from "@/store/slices/auth.slice";
import { TPaymentMethod } from "@/types";
import { IStripePayload } from "@/types/stripe";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { confirmPayment } from "@stripe/stripe-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { calculateSave, TSubscriptionItem } from ".";

const Header = ({
  subscription,
  loading,
}: {
  subscription: TSubscriptionItem | null;
  loading: boolean;
}) => {
  if (loading) {
    <View className="w-full flex flex-col items-center justify-center gap-2 py-6 bg-white rounded-xl">
      <ActivityIndicator size={24} color="#C427E0" />
      <Text className="text-[#C427E0] font-poppins-semibold">
        Fetching Subscription...
      </Text>
    </View>;
  }

  if (!subscription) return null;

  return (
    <View className="p-4 bg-white rounded-xl flex flex-col gap-4 w-full">
      <View className="w-full flex flex-row items-start justify-between">
        <View className="flex flex-col items-start gap-1">
          <View className="flex flex-row items-center gap-2">
            <View className="flex flex-row items-end gap-1">
              <Text className="font-poppins-semibold text-2xl text-gray-800">
                {subscription.month === 0 ? "Free" : subscription.month}
              </Text>
              {subscription.month > 0 && (
                <Text className="font-poppins-semibold text-lg text-gray-600">
                  Month
                </Text>
              )}
            </View>
          </View>

          {subscription.save && (
            <View className="px-3 py-1 rounded-lg bg-[#EFE8FF]">
              <Text className="font-dm-sans-medium text-[#844AFF] text-xs">
                Save {subscription.save}%
              </Text>
            </View>
          )}
        </View>
      </View>

      <View className="gap-2">
        <View className="flex flex-row items-center gap-4">
          {subscription.features
            .slice(0, 2)
            .map((feature: any, index: number) => (
              <View key={index} className="flex flex-row items-center gap-1.5">
                <MaterialCommunityIcons
                  name="checkbox-marked-circle-outline"
                  size={16}
                  color="#374151"
                />
                <Text className="font-dm-sans text-gray-700 text-sm">
                  {feature}
                </Text>
              </View>
            ))}
        </View>

        <View className="flex flex-row items-center gap-4">
          {subscription.features
            .slice(2, 4)
            .map((feature: any, index: number) => (
              <View key={index} className="flex flex-row items-center gap-1.5">
                <MaterialCommunityIcons
                  name="checkbox-marked-circle-outline"
                  size={16}
                  color="#374151"
                />
                <Text className="font-dm-sans text-gray-700 text-sm">
                  {feature}
                </Text>
              </View>
            ))}
        </View>
      </View>
    </View>
  );
};

const Detail = ({
  subscription,
  loading,
}: {
  subscription: TSubscriptionItem | null;
  loading: boolean;
}) => {
  if (loading) {
    <View className="flex-1 w-full flex flex-col items-center justify-center gap-2 py-6 bg-white rounded-xl">
      <ActivityIndicator size={24} color="#C427E0" />
      <Text className="text-[#C427E0] font-poppins-semibold">
        Fetching Subscription Detail...
      </Text>
    </View>;
  }

  if (!subscription) return;

  return (
    <View className="flex-1 p-4 flex flex-col items-start justify-center gap-6 bg-white rounded-xl">
      <View className="flex flex-row items-end gap-1">
        <Text className="font-poppins-semibold text-2xl text-gray-800">
          {subscription.month === 0 ? "Free" : subscription.month}
        </Text>
        {subscription.month > 0 && (
          <Text className="font-poppins-semibold text-lg text-gray-600">
            Month
          </Text>
        )}
      </View>

      <View className="w-full flex flex-row items-center justify-between">
        <Text className="font-dm-sans-medium text-gray-600">Currency:</Text>
        <Text className="font-poppins-semibold text-gray-800">USD</Text>
      </View>

      <View className="w-full flex flex-row items-center justify-between">
        <Text className="font-dm-sans-medium text-gray-600">Price:</Text>
        <Text className="font-poppins-semibold text-gray-800">
          {subscription.price}
        </Text>
      </View>

      <View className="w-full h-[1px] bg-gray-200"></View>

      <View className="w-full flex flex-row items-center justify-between">
        <Text className="font-dm-sans-bold text-xl text-gray-600">Total:</Text>
        <View className="flex flex-row items-start">
          <Text className="font-poppins-semibold text-green-500 text-lg">
            $
          </Text>
          <Text className="font-poppins-bold text-green-500 text-3xl">
            {subscription.price}
          </Text>
        </View>
      </View>
    </View>
  );
};

const SubscriptionCheckout = () => {
  const [subscription, setSubscription] = useState<TSubscriptionItem | null>(
    null,
  );
  const [method, setMethod] = useState<TPaymentMethod>("card");
  const [stripePaymentMethodId, setStripePaymentMethodId] =
    useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [subLoading, setSubLoading] = useState<boolean>(false);
  const [btnLabel, setBtnLabel] = useState<string>("Subscribe");

  const { id: subscriptionId, oneMonthPrice } = useLocalSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const getSubscription = async () => {
      if (!subscriptionId || !oneMonthPrice) return;
      try {
        setLoading(true);
        const response = await fetchSubscriptionById(subscriptionId as any);

        if (response.data) {
          const savePercent = calculateSave(
            response.data.price,
            response.data.month,
            Number(oneMonthPrice),
          );
          const formattedSubscription: TSubscriptionItem = {
            ...response.data,
            isActive: user?.subscription.id === response.data._id,
            isRecommended: response.data.month === 6,
            save: savePercent === 0 ? undefined : savePercent,
          };
          setSubscription(formattedSubscription);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    getSubscription();
  }, [subscriptionId]);

  useEffect(() => {
    if (!user?.stripe) return;

    if (user.stripe.paymentMethods.length === 0) return;
    setStripePaymentMethodId(user.stripe.paymentMethods[0].id || "");
  }, [user]);

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
        type: "subscription",
        userId: user?._id,
        subscriptionId,
      },
    };

    const clientSecretResponse = await createStripePaymentIntent(stripePayload);

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

    return true;
  };

  const handleSubscribe = async () => {
    if (!subscription) return;

    try {
      setSubLoading(true);
      setBtnLabel("Processing Payment...");
      let paymentResult = false;

      switch (method) {
        case "card":
          paymentResult = await handleStripePayment(
            subscription.price,
            subscription.currency,
          );
          break;
        case "crypto":
          break;
        case "token":
          break;
      }

      if (!paymentResult) {
        Alert.alert("Error", "Payment Failed");
        setBtnLabel("Subscribe");
        setSubLoading(false);
        return;
      }

      const waitForUpdate = async (timeout = 20000) => {
        if (!user) return;

        const intervalTime = 2000;
        let elapsed = 0;

        return new Promise<boolean>((resolve) => {
          const interval = setInterval(async () => {
            elapsed += intervalTime;

            const response = await fetchUser(user?._id as string);

            if (response.data.subscription.id === subscriptionId) {
              dispatch(setAuthUser(response.data));
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

      const updated = await waitForUpdate();

      if (updated) {
        Alert.alert("Success", "Subscribed successfully");
        router.back();
      }
    } catch (error: any) {
      console.log("[handle subscription error]: ", error);
    } finally {
      setBtnLabel("Subscribe");
      setSubLoading(false);
    }
  };

  return (
    <CheckoutContainer>
      <Header subscription={subscription} loading={loading} />

      <Detail subscription={subscription} loading={loading} />

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
        disabled={loading || !subscription}
        loading={subLoading}
        onPress={handleSubscribe}
      />
    </CheckoutContainer>
  );
};

export default SubscriptionCheckout;
