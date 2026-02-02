import { ApiResponse } from "@/types/api";
import { ITicket } from "@/types/ticket";
import AxiosInstance from "../client";
import { FETCH_ALL_TICKETS } from "../endpoints";

export const fetchAllTickets = async (): Promise<ApiResponse<ITicket[]>> => {
  return await AxiosInstance.get(FETCH_ALL_TICKETS);
};
