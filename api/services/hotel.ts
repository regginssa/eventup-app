import { ApiResponse } from "@/types/api";
import { IHotelBookingResponse, IHotelOffer } from "@/types/hotel";
import AxiosInstance from "../client";
import { HOTEL_BASE } from "../endpoints";

const get = async (params: any): Promise<ApiResponse<IHotelOffer[]>> => {
  return await AxiosInstance.get(HOTEL_BASE, { params });
};

const quote = async (
  rateId: string,
): Promise<ApiResponse<IHotelOffer | null>> => {
  return await AxiosInstance.post(HOTEL_BASE + "quote", { rateId });
};

const book = async (
  bodyData: any,
): Promise<ApiResponse<IHotelBookingResponse>> => {
  return await AxiosInstance.post(HOTEL_BASE, bodyData);
};

export default { get, quote, book };
