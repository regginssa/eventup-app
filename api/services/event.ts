import { ApiResponse, EventsFeedResponse } from "@/types/api";
import { IEvent, TEventStatus } from "@/types/event";
import AxiosInstance from "../client";
import {
  EVENT_BASE,
  FETCH_ALL_EVENTS,
  FETCH_EVENTS_BY_USER,
  FETCH_EVENTS_FEED,
} from "../endpoints";

const getFeed = async (
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

const getAll = async (): Promise<ApiResponse<IEvent[]>> => {
  return await AxiosInstance.get(FETCH_ALL_EVENTS);
};

const get = async (id: string): Promise<ApiResponse<IEvent>> => {
  return await AxiosInstance.get(EVENT_BASE + id);
};

// Fetch events by user
const getByUserId = async (
  userId: string,
  status: TEventStatus,
): Promise<ApiResponse<IEvent[]>> => {
  return await AxiosInstance.get(
    FETCH_EVENTS_BY_USER + `/${userId}?status=${status}`,
  );
};

// Create event
const create = async (event: IEvent): Promise<ApiResponse<IEvent>> => {
  return await AxiosInstance.post(EVENT_BASE, event);
};

// --- Update Event ---
const update = async (
  id: string,
  bodyData: IEvent,
): Promise<ApiResponse<IEvent>> => {
  return await AxiosInstance.patch(EVENT_BASE + id, bodyData);
};

export default {
  get,
  getAll,
  getFeed,
  getByUserId,
  create,
  update,
};
