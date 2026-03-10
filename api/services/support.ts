import { ApiResponse } from "@/types/api";
import AxiosInstance from "../client";
import { SUPPORT_BASE } from "../endpoints";

const sendMessage = async (body: any): Promise<ApiResponse<boolean>> => {
  return await AxiosInstance.post(SUPPORT_BASE + "/send-message", body);
};

export default { sendMessage };
