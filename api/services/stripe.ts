import { ApiResponse } from "@/types/api";
import { IUser } from "@/types/user";
import AxiosInstance from "../client";
import {
  CREATE_STRIPE_PAYMENT_INTENT,
  FETCH_STRIPE_CLIENT_SECRET,
  FETCH_STRIPE_CUSTOMER_ID,
  REFUND_STRIPE_PAYMENT,
  SAVE_STRIPE_PAYMENT_METHOD,
} from "../endpoints";

const getCustomerId = async (): Promise<ApiResponse<string>> => {
  return await AxiosInstance.get(FETCH_STRIPE_CUSTOMER_ID);
};

const getClientSecret = async (): Promise<ApiResponse<string>> => {
  return await AxiosInstance.get(FETCH_STRIPE_CLIENT_SECRET);
};

const savePaymentMethod = async (
  setupIntentClientSecret: string,
): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.post(SAVE_STRIPE_PAYMENT_METHOD, {
    setupIntentClientSecret,
  });
};

const createPaymentIntent = async (
  bodyData: any,
): Promise<ApiResponse<{ id: string; clientSecret: string }>> => {
  return await AxiosInstance.post(CREATE_STRIPE_PAYMENT_INTENT, bodyData);
};

const refund = async (paymentIntentId: string): Promise<ApiResponse<null>> => {
  return await AxiosInstance.post(REFUND_STRIPE_PAYMENT, { paymentIntentId });
};

export default {
  getCustomerId,
  getClientSecret,
  savePaymentMethod,
  createPaymentIntent,
  refund,
};
