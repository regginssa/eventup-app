import { ApiResponse } from "@/types/api";
import { IKyc } from "@/types/data";
import AxiosInstance from "../AxiosInstance";
import { FETCH_IDENTITY_VERIFICATION_SESSION } from "../apis";

export const fetchIdentityVerificationSession = async (
  id: string
): Promise<ApiResponse<IKyc>> => {
  return await AxiosInstance.get(FETCH_IDENTITY_VERIFICATION_SESSION + id);
};
