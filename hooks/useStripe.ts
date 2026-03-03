import stripeServices from "@/api/services/stripe";
import { IStripePayload } from "@/types/stripe";
import { TTransactionStatus } from "@/types/transaction";
import { confirmPayment } from "@stripe/stripe-react-native";

const useStripe = () => {
  const pay = async (
    payload: IStripePayload,
  ): Promise<{
    status: TTransactionStatus;
    message: string;
    paymentIntentId?: string;
  }> => {
    const clientSecretResponse =
      await stripeServices.createPaymentIntent(payload);

    if (!clientSecretResponse.ok) {
      return {
        status: "failed",
        message: "Payment failed",
      };
    }

    const { id: paymentIntentId, clientSecret } = clientSecretResponse.data;

    // Pay with stripe
    const { error } = await confirmPayment(clientSecret, {
      paymentMethodType: "Card",
      paymentMethodData: {
        paymentMethodId: payload.paymentMethodId,
      },
    });

    if (error) {
      return {
        status: "failed",
        message: "Payment failed",
      };
    }

    return {
      status: "pending",
      message: "",
      paymentIntentId,
    };
  };

  return { pay };
};

export default useStripe;
