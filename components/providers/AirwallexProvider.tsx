import AirwallexAPI from "@/api/services/airwallex";
import {
  initialize,
  PaymentSession,
  presentEntirePaymentFlow,
} from "airwallex-payment-react-native";
import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { useToast } from "./ToastProvider";

type TAirwallexPayBody = {
  amount: number;
  currency: string;
  metadata: any;
  returnUrl: string;
};

interface AirwallexContextProps {
  initialized: boolean;
  pay: (body: TAirwallexPayBody) => Promise<string>;
}

interface AirwallexProviderProps {
  children: ReactNode;
}

const AirwallexContext = createContext<AirwallexContextProps | undefined>(
  undefined,
);

export const useAirwallex = () => {
  const ctx = useContext(AirwallexContext);
  if (!ctx) {
    throw new Error("useAirwallex must be within AirwallexProvider");
  }
  return ctx;
};

const AirwallexProvider: React.FC<AirwallexProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    initialize("demo");
  }, []);

  const pay = async (body: TAirwallexPayBody): Promise<string> => {
    if (!user?.location.country.code) return "failed";
    try {
      const intentRes = await AirwallexAPI.paymentIntent.create(body);

      if (!intentRes.data) {
        toast.error("Payment intent creation failed");
      }

      const intentData = intentRes.data;

      const intent = {
        paymentIntentId: intentData.id,
        clientSecret: intentData.client_secret,
        amount: intentData.amount,
        currency: intentData.currency,
        returnUrl: intentData.return_url,
      };

      const session: PaymentSession = {
        type: "OneOff",
        paymentIntentId: intent.paymentIntentId,
        clientSecret: intent.clientSecret,
        currency: intent.currency,
        countryCode: "US",
        amount: intent.amount,
        paymentMethods: ["card"],
        isBillingRequired: true,
        returnUrl: intent.returnUrl,
      };

      const result = await presentEntirePaymentFlow(session);

      switch (result.status) {
        case "success":
          toast.success("Payment is successful");
          break;
        case "inProgress":
          toast.info("Payment is in progress");
          break;
        case "cancelled":
          toast.warn("Payment is cancelled");
          break;
        default:
          toast.error("Payment failed");
      }

      return result.status;
    } catch (e) {
      console.log("airwallex payment error: ", e);
      toast.error("Payment failed");
      return "failed";
    }
  };

  return (
    <AirwallexContext.Provider value={{ initialized: true, pay }}>
      {children}
    </AirwallexContext.Provider>
  );
};

export default AirwallexProvider;
