import { TAirport } from "@/types";
import { ApiResponse } from "@/types/api";
import AxiosInstance from "../AxiosInstance";
import { FETCH_NEAREST_AIRPORTS } from "../apis";

export const fetchNearestAirports = async (
  latitude: number,
  longitude: number
): Promise<ApiResponse<TAirport[]>> => {
  return await AxiosInstance.post(FETCH_NEAREST_AIRPORTS, {
    latitude,
    longitude,
  });
};
