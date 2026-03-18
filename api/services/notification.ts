import { ApiResponse } from "@/types/api";
import { INotification } from "@/types/notification";
import AxiosInstance from "../client";
import { NOTIFICATION_BASE } from "../endpoints";

const get = async (id: string): Promise<ApiResponse<INotification>> => {
  return AxiosInstance.get(NOTIFICATION_BASE + id);
};

const getByUserId = async (
  userId: string,
): Promise<ApiResponse<INotification[]>> => {
  return await AxiosInstance.get(NOTIFICATION_BASE + "user/" + userId);
};

const create = async (
  bodyData: INotification,
): Promise<ApiResponse<INotification>> => {
  return await AxiosInstance.post(NOTIFICATION_BASE, bodyData);
};

const update = async (
  id: string,
  bodyData: INotification,
): Promise<ApiResponse<INotification>> => {
  return await AxiosInstance.patch(NOTIFICATION_BASE + id, bodyData);
};

const remove = async (id: string): Promise<ApiResponse<boolean>> => {
  return await AxiosInstance.delete(NOTIFICATION_BASE + id);
};

const markRead = async (ids: string[]): Promise<ApiResponse<boolean>> => {
  return await AxiosInstance.patch(NOTIFICATION_BASE + "read/bulk", { ids });
};

export default {
  get,
  getByUserId,
  create,
  update,
  remove,
  markRead,
};
