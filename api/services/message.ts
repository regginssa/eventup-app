import { ApiResponse } from "@/types/api";
import { IMessage } from "@/types/message";
import AxiosInstance from "../client";
import { MESSAGE_BASE } from "../endpoints";

export const fetchConversationMessages = async (
  conversationId: string,
): Promise<ApiResponse<IMessage[]>> => {
  return await AxiosInstance.get(MESSAGE_BASE + conversationId);
};

export const markMessagesSeenRest = async (conversationId: string) => {
  await AxiosInstance.post(MESSAGE_BASE + conversationId + "/seen");
};

export const updateMessageById = async (
  messageId: string,
  updates: IMessage,
): Promise<ApiResponse<IMessage>> => {
  return await AxiosInstance.patch(MESSAGE_BASE + messageId, updates);
};

export const removeMessageById = async (
  messageId: string,
): Promise<ApiResponse<boolean>> => {
  return await AxiosInstance.delete(MESSAGE_BASE + messageId);
};
