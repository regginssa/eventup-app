import { ApiResponse } from "@/types/api";
import { IUser } from "@/types/user";
import AxiosInstance from "../client";
import { USER_BASE } from "../endpoints";

const get = async (id: string): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.get(USER_BASE + id);
};

const update = async (
  id: string,
  updates: IUser,
): Promise<ApiResponse<IUser>> => {
  return await AxiosInstance.patch(USER_BASE + id, updates);
};

export default { get, update };
