import { ApiResponse } from "@/types/api";
import { IDuffelPaymentIntentResponse } from "@/types/duffel";
import AxiosInstance from "../client";

const BASE_URL = "/duffel";

const DuffelAPI = {
  createPaymentIntent: async (body: {
    amount: number;
    currency: string;
  }): Promise<ApiResponse<IDuffelPaymentIntentResponse | null>> =>
    await AxiosInstance.post(BASE_URL + "/payment-intents", body),
};

export default DuffelAPI;
