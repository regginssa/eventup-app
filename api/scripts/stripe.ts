import { ApiResponse } from "@/types/api";
import { IUser } from "@/types/data";
import AxiosInstance from "../AxiosInstance";
import {
  FETCH_STRIPE_CLIENT_SECRET,
  FETCH_STRIPE_CUSTOMER_ID,
  SAVE_STRIPE_PAYMENT_METHOD,
} from "../apis";

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
