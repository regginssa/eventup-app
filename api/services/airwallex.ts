import { ApiResponse } from "@/types/api";
import AxiosInstance from "../client";

const BASE_URL = "/airwallex";

const AirwallexAPI = {
  customer: {
    create: async (): Promise<ApiResponse<string | null>> =>
      await AxiosInstance.post(BASE_URL + "/customer"),
  },
  paymentIntent: {
    create: async (body: any): Promise<ApiResponse<any>> =>
      await AxiosInstance.post(BASE_URL + "/payment-intent", body),
  },
};

export default AirwallexAPI;
