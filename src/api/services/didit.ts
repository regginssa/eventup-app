import { ApiResponse } from "@/src/types/api";
import { IKyc } from "@/src/types/user";
import AxiosInstance from "../client";
import { FETCH_IDENTITY_VERIFICATION_SESSION } from "../endpoints";

export const fetchIdentityVerificationSession = async (
  id: string
): Promise<ApiResponse<IKyc>> => {
  return await AxiosInstance.get(FETCH_IDENTITY_VERIFICATION_SESSION + id);
};
