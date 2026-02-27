import { TPackageType } from ".";
import { IEvent } from "./event";
import { ITicket } from "./ticket";
import { IUser } from "./user";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "confirmed"
  | "failed"
  | "cancelled";

export type TBookingFlight = {
  // --- Identifiers ---
  orderId: string; // Amadeus Order ID
  pnr: string; // Record Locator (e.g. “AKIL3X”)
  status: string; // default "CONFIRMED"

  // --- Itinerary Summary ---
  originIata: string; // e.g. "JFK"
  destinationIata: string; // e.g. "LHR"
  departureDate: Date | string;
  arrivalDate: Date | string;
  airlineName?: string;
  flightNumber?: string;
  isRoundTrip?: boolean;

  // --- Passenger Summary ---
  leadPassengerName: string;
  totalPassengers?: number;

  // --- Financials ---
  totalPrice?: number;
  currency?: string;

  // --- Deep Data ---
  segments?: any[]; // list of flight segments
  travelers?: any[]; // passenger details
  rawResponse?: Record<string, any>; // full Amadeus JSON

  // --- Payment ---
  paymentStatus?: PaymentStatus;

  // --- Timestamps from mongoose ---
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type TBookingHotel = {
  bookingReference: string;
  hotelConfirmationCode?: string | null;

  status: "CONFIRMED" | "CANCELLED" | "PENDING";

  // Stay details
  hotelName: string;
  hotelId?: string;
  checkInDate: Date | string;
  checkOutDate: Date | string;

  // Guest
  leadGuestName: string;
  guestEmail?: string;
  guestPhone?: string;

  // Financials
  totalAmount?: number;
  currency?: string;
  paymentPolicy?: "PREPAID" | "GUARANTEE" | "DEPOSIT";

  // Room
  roomDescription?: string;
  roomQuantity?: number;

  // Metadata
  rawResponse?: Record<string, any>;
  paymentStatus?: PaymentStatus;

  // Timestamps added by mongoose
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type TBookingTransfer = {
  orderId: string;
  reference: string;
  status: "CONFIRMED" | "CANCELLED" | "PENDING" | string;
  confirmationNumber: string;
  transferType: "PRIVATE" | "SHARED" | string;
  start: {
    dateTime: string;
    locationCode?: string;
    address?: {
      line: string;
      zip?: string;
      countryCode: string;
      cityName: string;
      latitude?: number;
      longitude?: number;
    };
  };
  end: {
    name?: string;
    googlePlaceId?: string;
    locationCode?: string;
    address?: {
      line: string;
      zip?: string;
      countryCode: string;
      cityName: string;
      latitude?: number;
      longitude?: number;
      uicCode?: string;
    };
  };
  provider: {
    code: string;
    name: string;
    logo?: string;
    contacts: {
      phoneNumber?: string;
      email?: string;
    };
    vatRegistrationNumber?: string;
  };
  vehicle: {
    code: string;
    description: string;
    category?: string;
    seats: number;
    baggages: {
      count: number;
      size?: string;
    }[];
    imageUrl?: string;
  };
  distance?: {
    value: number;
    unit: "KM" | "MI" | string;
  };
  price: {
    total: number;
    currency: string;
  };
  cancellationRules: {
    feeType: string;
    feeValue: string;
    metricType: string;
    metricMin: string;
    metricMax: string;
  }[];

  passengers: {
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
  }[];
};

export type TBillingAddress = {
  line: string;
  zip: string;
  countryCode: string;
  cityName: string;
};

export type TBillingDetails = {
  method?: string; // e.g. "CREDIT_CARD"
  cardType?: string; // vendorCode: VI, MC, AX
  cardLastFour?: string; // last 4 digits
  cardHolder?: string;
  billingAddress?: TBillingAddress;
};

export type TOfficialTicket = {
  orderId?: string;

  paymentStatus: "awaiting_payment" | "pending_sync" | "confirmed" | "failed";

  // Timestamps from mongoose
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type TBookingPrice = {
  total: number;
  base: number;
  comission: number;
  currency: string;
};

export interface IBooking {
  _id?: string;
  flight: TBookingFlight;
  hotel: TBookingHotel;
  transfer: {
    ah: TBookingTransfer;
    he: TBookingTransfer;
  };
  billingDetails: TBillingDetails;
  officialTicket?: TOfficialTicket;
  communityTicket?: ITicket;
  event: IEvent;
  user: IUser;
  price: TBookingPrice;
  package: TPackageType;
}
