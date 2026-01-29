import { ApiResponse } from "@/src/types/api";
import { IUser } from "@/src/types/user";
import AxiosInstance from "../client";
import { FETCH_USER, UPDATE_USER } from "../endpoints";

export const fetchUser = async (id: string): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.get(FETCH_USER + id);
};

export const updateUser = async (
  id: string,
  updates: IUser
): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.patch(UPDATE_USER + id, updates);
};
