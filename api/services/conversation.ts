import { ApiResponse } from "@/types/api";
import { IConversation } from "@/types/conversation";
import AxiosInstance from "../client";
import { CONVERSATION_BASE } from "../endpoints";

const getByUserId = async (
  userId: string,
): Promise<ApiResponse<IConversation[]>> => {
  return await AxiosInstance.get(CONVERSATION_BASE + userId);
};

const create = async (
  bodyData: IConversation,
): Promise<ApiResponse<IConversation>> => {
  return await AxiosInstance.post(CONVERSATION_BASE, bodyData);
};

const update = async (
  id: string,
  bodyData: IConversation,
): Promise<ApiResponse<IConversation>> => {
  return AxiosInstance.patch(CONVERSATION_BASE + id, bodyData);
};

const removeForMe = async (
  conversationId: string,
): Promise<ApiResponse<boolean>> => {
  return await AxiosInstance.delete(CONVERSATION_BASE + conversationId + "/me");
};

const removeForAll = async (
  conversationId: string,
): Promise<ApiResponse<boolean>> => {
  return await AxiosInstance.delete(
    CONVERSATION_BASE + conversationId + "/all",
  );
};

export default {
  getByUserId,
  create,
  update,
  removeForMe,
  removeForAll,
};
