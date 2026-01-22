import { ApiResponse } from "@/types/api";
import { IUser } from "@/types/user";
import AxiosInstance from "../AxiosInstance";
import { FETCH_USER, UPDATE_USER } from "../apis";

export const fetchUser = async (id: string): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.get(FETCH_USER + id);
};

export const updateUser = async (
  id: string,
  updates: IUser
): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.patch(UPDATE_USER + id, updates);
};
