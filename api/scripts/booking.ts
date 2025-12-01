import { IHotelDetails } from "@/types";
import { ApiResponse } from "@/types/api";
import AxiosInstance from "../AxiosInstance";
import {
  FETCH_HOTEL_DETAILS,
  FETCH_STANDARD_FLIGHTS_AVAILABILITY,
  FETCH_STANDARD_HOTELS_AVAILABILITY,
  FETCH_STANDARD_TRANSFERS_AVAILABILITY,
} from "../apis";

export const fetchStandardFlightsAvailability = async (
  eventId: string,
  flight: any
): Promise<ApiResponse<any>> => {
  return await AxiosInstance.post(
    FETCH_STANDARD_FLIGHTS_AVAILABILITY + eventId,
    { flight }
  );
};

export const fetchStandardHotelsAvailability = async (
  eventId: string,
  occupancy: any,
  checkin: Date,
  checkout: Date
): Promise<ApiResponse<any>> => {
  return await AxiosInstance.post(
    FETCH_STANDARD_HOTELS_AVAILABILITY + eventId,
    { occupancy, checkin, checkout }
  );
};

export const fetchStandardTransfersAvailability = async (
  eventId: string,
  data: any
): Promise<ApiResponse<any>> => {
  return await AxiosInstance.post(
    FETCH_STANDARD_TRANSFERS_AVAILABILITY + eventId,
    data
  );
};

export const fetchHotelDetails = async (
  sessionId: string,
  hotelId: string,
  productId: string,
  tokenId: string
): Promise<ApiResponse<IHotelDetails>> => {
  return await AxiosInstance.get(
    FETCH_HOTEL_DETAILS +
      sessionId +
      "/" +
      hotelId +
      "/" +
      productId +
      "/" +
      tokenId
  );
};
