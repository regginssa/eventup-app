import { ApiResponse } from "@/types/api";
import { IConversation } from "@/types/conversation";
import AxiosInstance from "../client";
import { CONVERSATION_BASE } from "../endpoints";

export const fetchUserConversations = async (
  userId: string,
): Promise<ApiResponse<IConversation[]>> => {
  return await AxiosInstance.get(CONVERSATION_BASE + userId);
};

export const removeOneConversation = async (
  conversationId: string,
): Promise<ApiResponse<boolean>> => {
  return await AxiosInstance.delete(CONVERSATION_BASE + conversationId);
};
