import { createStripePaymentIntent } from "@/api/services/stripe";
import { Button, CheckoutContainer, PaymentMethodGroup } from "@/components";
import { RootState } from "@/store";
import { TPaymentMethod } from "@/types";
import { IStripePayload } from "@/types/stripe";
import { ISubscription } from "@/types/subscription";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { confirmPayment } from "@stripe/stripe-react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { subscriptions } from ".";

const Header = ({ subscription }: { subscription: ISubscription | null }) => {
  if (!subscription) {
    return (
      <View className="w-full flex flex-col items-center justify-center gap-2">
        <MaterialCommunityIcons name="cart-off" size={24} color="#374151" />
        <Text className="font-poppins-semibold text-gray-700">
          Subscription not found
        </Text>
      </View>
    );
  }

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

const Detail = ({ subscription }: { subscription: ISubscription | null }) => {
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
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [method, setMethod] = useState<TPaymentMethod>("card");
  const [stripePaymentMethodId, setStripePaymentMethodId] =
    useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { month } = useLocalSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!month) return;

    const selected = subscriptions.find((s) => s.month === Number(month));
    setSelectedSubscription(selected || null);
  }, [month]);

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
        subscription: {
          month: selectedSubscription.month,
          price: selectedSubscription.price,
          createdAt: new Date().toISOString(),
        },
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

    return true;
  };

  return (
    <CheckoutContainer>
      <Header subscription={selectedSubscription} />

      <Detail subscription={selectedSubscription} />

      <PaymentMethodGroup
        method={method}
        stripePaymentMethodId={stripePaymentMethodId}
        onSelectMethod={setMethod}
        onSelectStripePaymentMethod={setStripePaymentMethodId}
      />

      <Button
        type="primary"
        label="Subscribe"
        buttonClassName="h-12"
        loading={loading}
      />
    </CheckoutContainer>
  );
};

export default SubscriptionCheckout;
