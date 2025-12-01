export type TCoordinate = {
  latitude: number;
  longitude: number;
};
export type TFileSizeUnit = "GB" | "MB" | "KB";
export type TFileType = "image" | "document";
export type TLocation = {
  description: string;
  coordinate: TCoordinate;
};
export type TAccountType = "individual" | "company";
export type TKycStatus =
  | "Not Started"
  | "In Progress"
  | "In Review"
  | "Completed"
  | "Approved"
  | "Declined"
  | "Expired"
  | "Abandoned";

export type TDropdownItem = {
  label: string;
  value: string | number;
};

export type TEventKind = "user" | "ai";

export type TEventFee = "free" | "paid";

export type TCurrency = "usd" | "eur" | "pln";

export type TEventLocation = "nearby" | "city" | "country" | "worldwide";

export type TPaymentMethod = "card" | "crypto" | "token";

export type TPackageType = "standard" | "gold";

export type TPagination = {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type TAirport = {
  name: string;
  city: string;
  country: string;
  iata: string;
  latitude: number;
  longitude: number;
  distance_km: number;
};

export type TPassengerInfo = {
  title: "Mr" | "Mrs" | "Master" | "Miss";
  firstName: string;
  lastName: string;
  dob: string; // "1991-12-11" birthday
  nationality: string;
  passportNo: string;
  passportIssueCountry: string;
  passportExpiryDate: string; // "2025-11-29"
};

export type TPaxDetails = {
  adults: TPassengerInfo[];
  child: TPassengerInfo[];
  infant: TPassengerInfo[];
};

export interface IFlightDetail {
  paxInfo: {
    customerEmail: string;
    customerPhone: string;
    bookingNote: string;
  };
  paxDetails: TPaxDetails;
}

export interface TFlightAvailability {
  FareItinerary: {
    DirectionInd: string;
    AirItineraryFareInfo: AirItineraryFareInfo;
    OriginDestinationOptions: OriginDestinationOptions[];
    IsPassportMandatory?: boolean | null;
    SequenceNumber?: string;
    TicketType: string;
    ValidatingAirlineCode: string;
  };
  details: IFlightDetail;
}

/* -------------------- FARE INFO -------------------- */

export interface AirItineraryFareInfo {
  DivideInPartyIndicator: string;
  FareSourceCode: string;
  FareInfos?: any[] | null;
  FareType: string;
  ResultIndex?: string;
  IsRefundable?: string;
  ItinTotalFares: ItinTotalFares;
  FareBreakdown?: FareBreakdown[] | null;
  SplitItinerary?: boolean;
}

export interface ItinTotalFares {
  BaseFare: FareAmount;
  EquivFare?: FareAmount;
  ServiceTax?: FareAmount;
  TotalTax?: FareAmount;
  TotalFare: FareAmount;
}

export interface FareAmount {
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: string;
}

/* -------------------- FARE BREAKDOWN -------------------- */

export interface FareBreakdown {
  FareBasisCode?: string;
  Baggage?: string[] | null;
  CabinBaggage?: string[] | null;
  PassengerFare?: PassengerFare;
  PassengerTypeQuantity?: PassengerTypeQuantity;
  PenaltyDetails?: PenaltyDetails;
}

export interface PassengerFare {
  BaseFare: FareAmount;
  EquivFare?: FareAmount;
  ServiceTax?: FareAmount;
  Surcharges?: FareAmount;
  Taxes?: Tax[] | null;
  TotalFare: FareAmount;
}

export interface Tax {
  TaxCode: string;
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: string;
}

export interface PassengerTypeQuantity {
  Code: "ADT" | "CHD" | "INF" | string;
  Quantity: number;
}

export interface PenaltyDetails {
  Currency?: string;
  RefundAllowed?: boolean;
  RefundPenaltyAmount?: string;
  ChangeAllowed?: boolean;
  ChangePenaltyAmount?: string;
}

/* -------------------- ORIGIN DESTINATION -------------------- */

export interface OriginDestinationOptions {
  OriginDestinationOption: OriginDestinationOption[];
  TotalStops: number;
}

export interface OriginDestinationOption {
  FlightSegment: FlightSegment;
  ResBookDesigCode?: string;
  ResBookDesigText?: string;
  SeatsRemaining?: SeatsRemaining;
  StopQuantity?: number;
  StopQuantityInfo?: StopQuantityInfo;
}

/* -------------------- FLIGHT SEGMENT -------------------- */

export interface FlightSegment {
  ArrivalAirportLocationCode: string;
  ArrivalDateTime: string;
  CabinClassCode: string;
  CabinClassText?: string;
  DepartureAirportLocationCode: string;
  DepartureDateTime: string;
  Eticket?: boolean;
  JourneyDuration: string;
  FlightNumber: string;
  MarketingAirlineCode: string;
  MarketingAirlineName?: string;
  MarriageGroup?: string;
  MealCode?: string;
  OperatingAirline?: OperatingAirline;
}

export interface OperatingAirline {
  Code: string;
  Name?: string;
  Equipment?: string;
  FlightNumber?: string;
}

/* -------------------- MISC TYPES -------------------- */

export interface SeatsRemaining {
  BelowMinimum?: boolean;
  Number?: number;
}

export interface StopQuantityInfo {
  ArrivalDateTime?: string;
  DepartureDateTime?: string;
  Duration?: string;
  LocationCode?: string;
}

export interface TFlight {
  session_id: string;
  availabilities: TFlightAvailability[];
  recommend: TFlightAvailability;
}

export interface IHotelDetails {
  hotelImages: {
    caption: string;
    url: string;
  }[];
  latitude: string;
  longitude: string;
  description: { content: string };
}

export interface THotelAvailability {
  hotelId: string;
  twxHotelId: string;
  productId: string;
  tokenId: string;
  hotelName: string;
  city: string;
  locality: string;
  distanceValue: number;
  distanceUnit: string;
  country: string;
  countryCode: string;
  address: string;
  latitude: string;
  longitude: string;
  hotelRating: number;
  total: string;
  perNightArray: PerNight[];
  currency: string;
  fareType: string;
  propertyType: string;
  postalCode: string;
  phone: string;
  email: string;
  thumbNailUrl: string;
  facilities: string[];
  tripAdvisorRating: number;
  tripAdvisorReview: number;
  special: string;
  details: IHotelDetails;
}

export interface PerNight {
  nightIndex: number;
  currency: string;
  price: string;
}

export interface THotel {
  session_id: string;
  availabilities: THotelAvailability[];
  recommend?: THotelAvailability;
  checkin: Date;
  checkout: Date;
}
