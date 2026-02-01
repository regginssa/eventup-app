import { ApiResponse, EventsFeedResponse } from "@/types/api";
import { IEvent, TEventStatus } from "@/types/event";
import AxiosInstance from "../client";
import {
  CREATE_EVENT,
  FETCH_ALL_EVENTS,
  FETCH_EVENT,
  FETCH_EVENTS_BY_USER,
  FETCH_EVENTS_FEED,
} from "../endpoints";

export const fetchEventsFeed = async (
  userId: string,
  type: "ai" | "user",
  startDate?: Date,
  countryCode?: string,
  regionCode?: string,
  category?: string,
  page?: number,
  limit?: number,
): Promise<ApiResponse<EventsFeedResponse>> => {
  const startDateString = startDate?.toISOString().split("T")[0];
  return await AxiosInstance.get(
    FETCH_EVENTS_FEED +
      `?userId=${userId}` +
      `&page=${page}` +
      `&limit=${limit}` +
      `&type=${type}` +
      `&startDate=${startDateString}` +
      `&countryCode=${countryCode}` +
      `&regionCode=${regionCode}` +
      `&category=${category}`,
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
  status: TEventStatus,
): Promise<ApiResponse<IEvent[]>> => {
  return await AxiosInstance.get(
    FETCH_EVENTS_BY_USER + `/${userId}?status=${status}`,
  );
};

// Create event
export const createEvent = async (
  event: IEvent,
): Promise<ApiResponse<IEvent>> => {
  return await AxiosInstance.post(CREATE_EVENT, event);
};
