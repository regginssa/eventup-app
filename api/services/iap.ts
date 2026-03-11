import { ApiResponse } from "@/types/api";
import { ITransaction } from "@/types/transaction";
import AxiosInstance from "../client";

const BASE_URL = "/iap";

const IapAPI = {
  verify: async (body: any): Promise<ApiResponse<ITransaction>> => {
    return await AxiosInstance.post(BASE_URL + "/verify", body);
  },
};

export default IapAPI;
