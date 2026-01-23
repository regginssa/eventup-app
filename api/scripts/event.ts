import { ApiResponse, EventsFeedResponse } from "@/types/api";
import { IEvent, TEventStatus } from "@/types/event";
import {
  CREATE_EVENT,
  FETCH_ALL_EVENTS,
  FETCH_EVENT,
  FETCH_EVENTS_BY_USER,
  FETCH_EVENTS_FEED,
} from "../apis";
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

// Fetch events by user
export const fetchEventsByUser = async (
  userId: string,
  status: TEventStatus
): Promise<ApiResponse<IEvent[]>> => {
  return await AxiosInstance.get(
    FETCH_EVENTS_BY_USER + `/${userId}?status=${status}`
  );
};

// Create event
export const createEvent = async (
  event: IEvent
): Promise<ApiResponse<IEvent>> => {
  return await AxiosInstance.post(CREATE_EVENT, event);
};
