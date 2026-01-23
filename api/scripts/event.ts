import { ApiResponse, EventsFeedResponse } from "@/types/api";
import { IEvent } from "@/types/event";
import { FETCH_ALL_EVENTS, FETCH_EVENT, FETCH_EVENTS_FEED } from "../apis";
import AxiosInstance from "../AxiosInstance";

export const fetchEventsFeed = async (
  userId: string,
  page: number,
  limit: number,
  type: "ai" | "user"
): Promise<ApiResponse<EventsFeedResponse>> => {
  return await AxiosInstance.get(
    FETCH_EVENTS_FEED +
      `?userId=${userId}&page=${page}&limit=${limit}&type=${type}`
  );
};

export const fetchAllEvents = async (): Promise<ApiResponse<IEvent[]>> => {
  return await AxiosInstance.get(FETCH_ALL_EVENTS);
};

export const fetchEvent = async (id: string): Promise<ApiResponse<IEvent>> => {
  return await AxiosInstance.get(FETCH_EVENT + id);
};
