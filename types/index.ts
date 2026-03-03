import {
  TAmadeusHotelBookingRequest,
  TAmadeusHotelOffer,
  TAmadeusHotelOrder,
  TAmadeusTransferBookingRequest,
  TAmadeusTransferOffer,
  TAmadeusTransferOrder,
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

export type TPaymentMethod = "credit" | "crypto" | "token";

export type TPackageType = "standard" | "gold";

export type TBookingOption = "flight" | "hotel" | "transfer";

export type TPagination = {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export interface THotel {
  offers: TAmadeusHotelOffer[];
  request?: TAmadeusHotelBookingRequest;
  order?: TAmadeusHotelOrder;
}

export type TTransfer = {
  ah: TAmadeusTransferOffer[];
  he: TAmadeusTransferOffer[];
  requests?: TAmadeusTransferBookingRequest[];
  orders?: TAmadeusTransferOrder[];
};
