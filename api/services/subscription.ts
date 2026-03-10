import { ApiResponse } from "@/types/api";
import { ISubscription } from "@/types/subscription";
import AxiosInstance from "../client";
import { FETCH_ALL_SUBSCRIPTIONS, SUBSCRIPTION_BASE } from "../endpoints";

const getAll = async (): Promise<ApiResponse<ISubscription[]>> => {
  return await AxiosInstance.get(FETCH_ALL_SUBSCRIPTIONS);
};

const get = async (id: string): Promise<ApiResponse<ISubscription>> => {
  return await AxiosInstance.get(SUBSCRIPTION_BASE + id);
};

export default { getAll, get };
