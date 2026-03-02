import { ApiResponse } from "@/types/api";
import { IBooking } from "@/types/booking";
import { IFlightBookingResponse, IFlightOffer } from "@/types/flight";
import AxiosInstance from "../client";
import {
  BOOK_FLIGHTS,
  BOOKING_BASE,
  CREATE_BOOKING,
  FETCH_ALL_BOOKINGS,
  FETCH_BOOKINGS_BY_USERID_AND_EVENTID,
  FETCH_FLIGHTS,
} from "../endpoints";

const getFlights = async (params: any): Promise<ApiResponse<IFlightOffer>> => {
  return await AxiosInstance.get(FETCH_FLIGHTS, { params });
};

const bookFlights = async (
  bodyData: any,
): Promise<ApiResponse<IFlightBookingResponse>> => {
  return await AxiosInstance.post(BOOK_FLIGHTS, bodyData);
};

// ------------ Booking engine ------------

// Fetch all bookings
export const fetchAllBookings = async (
  userId: string,
): Promise<ApiResponse<IBooking[]>> => {
  return await AxiosInstance.get(FETCH_ALL_BOOKINGS + userId);
};

// Fetch booking
export const fetchBooking = async (
  id: string,
): Promise<ApiResponse<IBooking>> => {
  return await AxiosInstance.get(BOOKING_BASE + id);
};

// Get booking by userId & eventId
const getBookingByUserIdAndEventId = async (
  userId: string,
  eventId: string,
): Promise<ApiResponse<IBooking>> => {
  return await AxiosInstance.get(
    FETCH_BOOKINGS_BY_USERID_AND_EVENTID + userId + "/" + eventId,
  );
};

// Create booking
export const createBooking = async (
  body: IBooking,
): Promise<ApiResponse<IBooking>> => {
  return await AxiosInstance.post(CREATE_BOOKING, body);
};

export default { getFlights, bookFlights, getBookingByUserIdAndEventId };
