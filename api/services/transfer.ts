import { ApiResponse } from "@/types/api";
import { ITransferBookingResponse, ITransferOffer } from "@/types/transfer";
import AxiosInstance from "../client";
import { TRANSFER_BASE } from "../endpoints";

const get = async (
  params: any,
): Promise<ApiResponse<ITransferOffer | null>> => {
  return await AxiosInstance.get(TRANSFER_BASE, { params });
};

const book = async (
  bodyData: any,
): Promise<ApiResponse<ITransferBookingResponse>> => {
  return await AxiosInstance.post(TRANSFER_BASE, bodyData);
};

export default { get, book };
