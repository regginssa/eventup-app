import { TPackageType } from ".";

export type TFlightBookStatus = "confirmed" | "processing" | "failed";

export interface IFlightOffer {
  id: string;
  airlineName: string;
  airlineLogo: string;
  totalAmount: string;
  currency: string;
  departureTime: string;
  arrivalTime: string;
  duration: string; // e.g., "02h 30m"
  originIata: string;
  destinationIata: string;
  packageType: TPackageType;
}

export interface IFlightBookingResponse {
  status: TFlightBookStatus;
  orderId?: string;
  bookingReference?: string;
  message: string;
}
