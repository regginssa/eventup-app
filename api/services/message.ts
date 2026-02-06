import { ApiResponse } from "@/types/api";
import { IMessage } from "@/types/message";
import AxiosInstance from "../client";
import { MESSAGE_BASE } from "../endpoints";

export const fetchConversationMessages = async (
  conversationId: string,
): Promise<ApiResponse<IMessage[]>> => {
  return await AxiosInstance.get(MESSAGE_BASE + conversationId);
};
