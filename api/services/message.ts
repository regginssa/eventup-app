import { ApiResponse } from "@/types/api";
import { IMessage } from "@/types/message";
import AxiosInstance from "../client";
import { CONVERSATION_BASE } from "../endpoints";

export const fetchConversationMessages = async (
  conversationId: string,
): Promise<ApiResponse<IMessage[]>> => {
  return await AxiosInstance(CONVERSATION_BASE + conversationId);
};
