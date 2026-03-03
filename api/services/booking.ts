import { ApiResponse } from "@/types/api";
import { IBooking } from "@/types/booking";
import AxiosInstance from "../client";
import {
  BOOKING_BASE,
  FETCH_ALL_BOOKINGS,
  FETCH_BOOKINGS_BY_USERID_AND_EVENTID,
} from "../endpoints";

const get = async (id: string): Promise<ApiResponse<IBooking>> => {
  return await AxiosInstance.get(BOOKING_BASE + id);
};

const getAllByUserId = async (
  userId: string,
): Promise<ApiResponse<IBooking[]>> => {
  return await AxiosInstance.get(FETCH_ALL_BOOKINGS + userId);
};

const getByUserIdAndEventId = async (
  userId: string,
  eventId: string,
): Promise<ApiResponse<IBooking>> => {
  return await AxiosInstance.get(
    FETCH_BOOKINGS_BY_USERID_AND_EVENTID + userId + "/" + eventId,
  );
};

const create = async (body: IBooking): Promise<ApiResponse<IBooking>> => {
  return await AxiosInstance.post(BOOKING_BASE, body);
};

const update = async (
  id: string,
  body: IBooking,
): Promise<ApiResponse<IBooking>> => {
  return await AxiosInstance.patch(BOOKING_BASE + id, body);
};

export default { get, getAllByUserId, getByUserIdAndEventId, create, update };
