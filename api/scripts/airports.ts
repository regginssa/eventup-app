import { ApiResponse } from "@/types/api";
import { IUser } from "@/types/data";
import AxiosInstance from "../AxiosInstance";
import { UPDATE_USER_NEAREST_AIRPORTS } from "../apis";

export const updateUserNearestAirports = async (
  latitude: number,
  longitude: number
): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.patch(UPDATE_USER_NEAREST_AIRPORTS, {
    latitude,
    longitude,
  });
};
