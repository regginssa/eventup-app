import { ApiResponse } from "@/types/api";
import { IKyc } from "@/types/user";
import AxiosInstance from "../client";
import { FETCH_IDENTITY_VERIFICATION_SESSION } from "../endpoints";

export const fetchIdentityVerificationSession = async (
  body: any,
): Promise<ApiResponse<IKyc>> => {
  return await AxiosInstance.post(FETCH_IDENTITY_VERIFICATION_SESSION, body);
};
