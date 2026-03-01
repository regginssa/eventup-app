import { ApiResponse } from "@/types/api";
import { ICommunityTicket } from "@/types/ticket";
import AxiosInstance from "../client";
import { FETCH_ALL_TICKETS, TICKET_BASE } from "../endpoints";

export const fetchAllTickets = async (): Promise<
  ApiResponse<ICommunityTicket[]>
> => {
  return await AxiosInstance.get(FETCH_ALL_TICKETS);
};

export const fetchTicketById = async (
  ticketId: string,
): Promise<ApiResponse<ICommunityTicket>> => {
  return await AxiosInstance.get(TICKET_BASE + ticketId);
};
