import { ApiResponse } from "@/types/api";
import { INotification } from "@/types/notification";
import AxiosInstance from "../client";
import { NOTIFICATION_BASE } from "../endpoints";

const get = async (id: string): Promise<ApiResponse<INotification>> => {
  return AxiosInstance.get(NOTIFICATION_BASE + id);
};

const getByUserId = async (
  id: string,
): Promise<ApiResponse<INotification[]>> => {
  return await AxiosInstance.get(NOTIFICATION_BASE + "user/" + id);
};

const create = async (
  bodyData: INotification,
): Promise<ApiResponse<INotification>> => {
  return AxiosInstance.post(NOTIFICATION_BASE, bodyData);
};

const update = async (
  id: string,
  bodyData: INotification,
): Promise<ApiResponse<INotification>> => {
  return AxiosInstance.patch(NOTIFICATION_BASE + id, bodyData);
};

const remove = async (id: string): Promise<ApiResponse<boolean>> => {
  return AxiosInstance.delete(NOTIFICATION_BASE + id);
};

export default {
  get,
  getByUserId,
  create,
  update,
  remove,
};
