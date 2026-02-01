import { TAmadeusFlightOffer } from "@/types/amadeus";
import { ApiResponse } from "@/types/api";
import { IBooking } from "@/types/booking";
import AxiosInstance from "../client";
import {
  BOOKING_BASE,
  CANCEL_FLIGHT_ORDER,
  CREATE_BOOKING,
  CREATE_FLIGHT_ORDER,
  CREATE_HOTEL_ORDER,
  CREATE_TRANSFER_ORDER,
  FETCH_ALL_BOOKINGS,
  FETCH_BOOKINGS_BY_USERID_AND_EVENTID,
  FETCH_FLIGHT_OFFERS,
  FETCH_FLIGHT_OFFERS_PRICING,
  FETCH_HOTEL_OFFER_PRICING,
  FETCH_HOTEL_OFFERS,
  FETCH_TRANSFER_OFFERS,
  GET_FLIGHT_ORDER,
} from "../endpoints";

// ------------ Flight booking engine ------------

// Fetch flight offers
export const fetchFlightOffers = async (
  params: any,
): Promise<ApiResponse<TAmadeusFlightOffer[]>> => {
  return await AxiosInstance.get(
    FETCH_FLIGHT_OFFERS + "?" + new URLSearchParams(params).toString(),
  );
};

// Fetch flight offers pricing
export const fetchFlightOffersPricing = async (
  params: any,
): Promise<ApiResponse<any>> => {
  return await AxiosInstance.post(FETCH_FLIGHT_OFFERS_PRICING, params);
};

// Create flight order
export const createFlightOrder = async (
  params: any,
): Promise<ApiResponse<any>> => {
  return await AxiosInstance.post(CREATE_FLIGHT_ORDER, params);
};

// Get flight order
export const getFlightOrder = async (id: string): Promise<ApiResponse<any>> => {
  return await AxiosInstance.get(GET_FLIGHT_ORDER + id);
};

// Cancel flight order
export const cancelFlightOrder = async (
  id: string,
): Promise<ApiResponse<any>> => {
  return await AxiosInstance.post(CANCEL_FLIGHT_ORDER + id);
};

// ------------ Hotel booking engine ------------

// Fetch hotel offers
export const fetchHotelOffers = async (
  params: any,
): Promise<ApiResponse<any>> => {
  return await AxiosInstance.get(
    FETCH_HOTEL_OFFERS + "?" + new URLSearchParams(params).toString(),
  );
};

// Fetch hotel offer pricing
export const fetchHotelOfferPricing = async (
  id: string,
): Promise<ApiResponse<any>> => {
  return await AxiosInstance.get(FETCH_HOTEL_OFFER_PRICING + id);
};

// Create hotel order
export const createHotelOrder = async (
  params: any,
): Promise<ApiResponse<any>> => {
  return await AxiosInstance.post(CREATE_HOTEL_ORDER, params);
};

// ------------ Transfer booking engine ------------

// Fetch transfer offers
export const fetchTransferOffers = async (
  params: any,
): Promise<ApiResponse<any>> => {
  return await AxiosInstance.get(
    FETCH_TRANSFER_OFFERS + "?" + new URLSearchParams(params).toString(),
  );
};

// Create transfer order
export const createTransferOrder = async (
  params: any,
): Promise<ApiResponse<any>> => {
  return await AxiosInstance.post(CREATE_TRANSFER_ORDER, params);
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

// Fetch booking by userId & eventId
export const fetchBookingByUserIdAndEventId = async (
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
