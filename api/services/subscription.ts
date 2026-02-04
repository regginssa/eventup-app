import { ApiResponse } from "@/types/api";
import { ISubscription } from "@/types/subscription";
import AxiosInstance from "../client";
import { FETCH_ALL_SUBSCRIPTIONS, SUBSCRIPTION_BASE } from "../endpoints";

export const fetchAllSubscriptions = async (): Promise<
  ApiResponse<ISubscription[]>
> => {
  return await AxiosInstance.get(FETCH_ALL_SUBSCRIPTIONS);
};

export const fetchSubscriptionById = async (
  id: string,
): Promise<ApiResponse<ISubscription>> => {
  return await AxiosInstance.get(SUBSCRIPTION_BASE + id);
};
