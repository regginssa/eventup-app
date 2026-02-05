import { ApiResponse } from "@/types/api";
import AxiosInstance from "../client";
import { IConversation } from "@/types/conversation";
import { CONVERSATION_BASE } from "../endpoints";

export const fetchUserConversations = async (
  userId: string,
): Promise<ApiResponse<IConversation[]>> => {
  return await AxiosInstance.get(CONVERSATION_BASE + userId);
};
