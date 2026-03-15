import stripeServices from "@/api/services/stripe";
import {
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { StripePaymentMethodGroup } from "../molecules";
import { useAuth } from "../providers/AuthProvider";
import { useToast } from "../providers/ToastProvider";

const CardsGroup = require("@/assets/images/icons/credit_cards_group.png");

interface CardPaymentProps {
  methodId: string;
  onSelectMethod: (id: string) => void;
}

const CardPayment: React.FC<CardPaymentProps> = ({
  methodId,
  onSelectMethod,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { user, setAuthUser } = useAuth();
  const toast = useToast();

  const handleAddCard = async () => {
    try {
      setLoading(true);

      if (!user?.stripe?.customerId) {
        await stripeServices.getCustomerId();
      }

      const clientSecretRes = await stripeServices.getClientSecret();
      if (!clientSecretRes.data) {
        setLoading(false);
        return toast.error("No Stripe client secret found.");
      }

      const { error } = await initPaymentSheet({
        setupIntentClientSecret: clientSecretRes.data,
        merchantDisplayName: "Charlie Party",
      });

      if (error) {
        console.error("Error initializing payment sheet:", error);
        setLoading(false);
        return toast.error("Failed to initialize payment sheet.");
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        console.error("Payment sheet error:", presentError);
        return toast.error("Payment sheet failed.");
      }

      const response = await stripeServices.savePaymentMethod(
        clientSecretRes.data,
      );

      setAuthUser(response.data);
      toast.success("Card is successfully saved");
    } catch (error) {
      toast.error("Card is not added");
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
              {user?.stripe?.paymentMethods.length &&
              user?.stripe.paymentMethods.length > 0
                ? "Add another card"
                : "Add card"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {user?.stripe?.paymentMethods &&
        user.stripe.paymentMethods.length > 0 && (
          <>
            <StripePaymentMethodGroup
              methods={user.stripe.paymentMethods}
              selectedMethodId={methodId}
              onSelectMethod={onSelectMethod}
            />
          </>
        )}
    </View>
  );
};

export default CardPayment;
