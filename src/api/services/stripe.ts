import { TBookingOption, TPackageType } from "@/src/types";
import { ApiResponse } from "@/src/types/api";
import { IUser } from "@/src/types/user";
import AxiosInstance from "../client";
import {
  CREATE_STRIPE_PAYMENT_INTENT,
  FETCH_STRIPE_CLIENT_SECRET,
  FETCH_STRIPE_CUSTOMER_ID,
  REFUND_STRIPE_PAYMENT,
  SAVE_STRIPE_PAYMENT_METHOD,
} from "../endpoints";

export const fetchStripeCustomerId = async (): Promise<ApiResponse<string>> => {
  return await AxiosInstance.get(FETCH_STRIPE_CUSTOMER_ID);
};

export const fetchStripeClientSecret = async (): Promise<
  ApiResponse<string>
> => {
  return await AxiosInstance.get(FETCH_STRIPE_CLIENT_SECRET);
};

export const saveStripePaymentMethod = async (
  setupIntentClientSecret: string
): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.post(SAVE_STRIPE_PAYMENT_METHOD, {
    setupIntentClientSecret,
  });
};

export const createStripePaymentIntent = async ({
  paymentMethodId,
  bookingOption,
  packageType,
  amount,
  currency,
}: {
  paymentMethodId: string;
  bookingId: string;
  bookingOption: TBookingOption;
  packageType: TPackageType;
  amount: number;
  currency: string;
}): Promise<ApiResponse<{ id: string; clientSecret: string }>> => {
  return await AxiosInstance.post(CREATE_STRIPE_PAYMENT_INTENT, {
    paymentMethodId,
    bookingOption,
    packageType,
    amount,
    currency,
  });
};

export const refundStripePayment = async (
  paymentIntentId: string
): Promise<ApiResponse<null>> => {
  return await AxiosInstance.post(REFUND_STRIPE_PAYMENT, { paymentIntentId });
};
