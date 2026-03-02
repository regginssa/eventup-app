import { ApiResponse } from "@/types/api";
import { IFlightBookingResponse, IFlightOffer } from "@/types/flight";
import AxiosInstance from "../client";
import { FLIGHTS_BASE } from "../endpoints";

const get = async (params: any): Promise<ApiResponse<IFlightOffer[]>> => {
  return await AxiosInstance.get(FLIGHTS_BASE, { params });
};

const book = async (
  bodyData: any,
): Promise<ApiResponse<IFlightBookingResponse>> => {
  return await AxiosInstance.post(FLIGHTS_BASE, bodyData);
};

export default { get, book };
