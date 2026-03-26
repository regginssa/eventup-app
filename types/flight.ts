export type TFlightBookStatus = "confirmed" | "processing" | "failed";

export type TStop = {
  iataCode: string;
  arrivalTime: string;
  departureTime: string;
  duration: string;
};

export type TTripType = "round" | "one_way";

export interface IFlightOffer {
  id: string;
  airlineName: string;
  airlineLogo: string;
  totalAmount: string;
  currency: string;
  passengerIds: string[];

  slices: IFlightSlice[];
  arrivalTime: string;
  departureTime: string;

  converted: {
    totalAmount: number;
    netAmount: number;
    currency: string;
  };
  tripType: TTripType;
}

export interface IFlightSlice {
  departureTime: string;
  arrivalTime: string;
  duration: string;

  originIata: string;
  destinationIata: string;

  flightNumbers: string[];
  stops: TStop[];
}

export interface IFlightBookingResponse {
  status: TFlightBookStatus;
  id?: string;
  reference?: string;
  message: string;
}

export interface IFlight {
  offers: IFlightOffer[];
}
