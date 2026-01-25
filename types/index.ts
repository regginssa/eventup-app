import {
  TAmadeusFlightBookingRequest,
  TAmadeusFlightOffer,
  TAmadeusHotelBookingRequest,
  TAmadeusHotelOffer,
  TAmadeusTransferBookingRequest,
  TAmadeusTransferOffer,
} from "./amadeus";

export type TCoordinate = {
  latitude: number;
  longitude: number;
};
export type TFileSizeUnit = "GB" | "MB" | "KB";
export type TFileType = "image" | "document";
export type TLocation = {
  description: string;
  coordinate: TCoordinate;
  cityName?: string;
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
  icon?: React.ReactNode;
};

export type TEventKind = "user" | "ai";

export type TEventFee = "free" | "paid";

export type TCurrency = "usd" | "eur" | "pln";

export type TEventLocation = "nearby" | "city" | "country" | "worldwide";

export type TPaymentMethod = "card" | "crypto" | "token";

export type TPackageType = "standard" | "gold";

export type TBookingOption = "flight" | "hotel" | "transfer";

export type TPagination = {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export interface TFlight {
  offers: TAmadeusFlightOffer[];
  request?: TAmadeusFlightBookingRequest;
}

export interface THotel {
  offers: TAmadeusHotelOffer[];
  request?: TAmadeusHotelBookingRequest;
}

export type TTransfer = {
  ah: TAmadeusTransferOffer[];
  he: TAmadeusTransferOffer[];
  requests?: TAmadeusTransferBookingRequest[];
};
