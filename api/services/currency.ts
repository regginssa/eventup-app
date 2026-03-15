import { ApiResponse } from "@/types/api";
import AxiosInstance from "../client";

const BASE_URL = "/currency";

const CurrencyAPI = {
  convert: async (params: any): Promise<ApiResponse<number>> => {
    return await AxiosInstance.get(BASE_URL + "/convert", { params });
  },
};

export default CurrencyAPI;
