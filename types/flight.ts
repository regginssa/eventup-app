export type TFlightBookStatus = "confirmed" | "processing" | "failed";

export type TStop = {
  iataCode: string;
  arrivalTime: string;
  departureTime: string;
  duration: string;
};

export interface IFlightOffer {
  id: string;
  airlineName: string;
  airlineLogo: string;
  totalAmount: string;
  currency: string;
  passengerIds: string[];
  departureTime: string;
  arrivalTime: string;
  duration: string; // e.g., "02h 30m"
  originIata: string;
  destinationIata: string;
  flightNumbers: string[];
  stops: TStop[];
}

export interface IFlightBookingResponse {
  status: TFlightBookStatus;
  orderId?: string;
  bookingReference?: string;
  message: string;
}

export interface IFlight {
  offers: IFlightOffer[];
}
