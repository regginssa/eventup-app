import { ApiResponse } from "@/types/api";
import { IFlightBookingResponse, IFlightOffer } from "@/types/flight";
import AxiosInstance from "../client";
import { FLIGHT_BASE } from "../endpoints";

const get = async (params: any): Promise<ApiResponse<IFlightOffer | null>> => {
  return await AxiosInstance.get(FLIGHT_BASE, { params });
};

const book = async (
  bodyData: any,
): Promise<ApiResponse<IFlightBookingResponse>> => {
  return await AxiosInstance.post(FLIGHT_BASE, bodyData);
};

export default { get, book };
