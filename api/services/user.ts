import { ApiResponse } from "@/types/api";
import { IUser } from "@/types/user";
import AxiosInstance from "../client";
import { FETCH_USER, UPDATE_USER } from "../endpoints";

const get = async (id: string): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.get(FETCH_USER + id);
};

const update = async (
  id: string,
  updates: IUser,
): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.patch(UPDATE_USER + id, updates);
};

export default { get, update };
