import {
  TAccountType,
  TAirport,
  TCoordinate,
  TEventFee,
  TEventLocation,
  TKycStatus,
  TPackageType,
} from ".";

export interface IKyc {
  sessionId: string;
  sessionNumber: number;
  sessionToken: string;
  vendorData: string;
  status: TKycStatus;
  url: string;
}

export interface IPaymentMethod {
  payment_method_id: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  last4: number;
  postalCode: string;
}

export interface IStripe {
  customer_id: string;
  payment_methods: IPaymentMethod[];
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  about?: string;
  location: {
    country?: string;
    country_code?: string;
    region?: string;
    region_code?: string;
    address?: string;
    coordinate: TCoordinate;
  };
  account_type: TAccountType;
  sign_option: "email" | "google" | "apple";
  google_id?: string;
  apple_id?: string;
  is_blocked: boolean;
  is_id_verified: boolean;
  kyc: IKyc;
  preferred: {
    category: string;
    subcategories: string[];
    vibe: string[];
    venue_type: string[];
    location: TEventLocation;
  };
  nearest_airports: TAirport[];
  stripe: IStripe;
}

export interface IFee {
  amount: number;
  currency: string;
}

export interface IClassifications {
  segment?: string;
  genre?: string;
  subGenre?: string;
  type?: string;
  subType?: string;
  primary?: boolean;
}

export interface IGeoPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface IAttraction {
  id?: string;
  name?: string;
  url?: string;
}

export interface IImage {
  ratio?: string;
  url?: string;
  width?: number;
  height?: number;
  fallback?: boolean;
}

export interface IClassifications {
  segment?: string;
  genre?: string;
  subGenre?: string;
  type?: string;
  subType?: string;
  primary?: boolean;
}

export interface IPriceRange {
  type?: string; // e.g. "standard", "vip", "resale"
  currency?: string;
  min?: number;
  max?: number;
}

export interface IOffer {
  offerId?: string;
  name?: string;
  ticketType?: string; // e.g. "primary", "resale", "VIP"
  enabled?: boolean;
  currency?: string;
  minPrice?: number;
  maxPrice?: number;
  faceValueMin?: number;
  faceValueMax?: number;
  inventoryCount?: number;
  section?: string;
  row?: string;
  isResale?: boolean;
  attributes?: Record<string, unknown>;
}

export interface IAvailability {
  status?: string; // e.g. "onsale", "soldout"
  hasInventory?: boolean;
  currency?: string;
  primaryMin?: number;
  primaryMax?: number;
  resaleMin?: number;
  resaleMax?: number;
  totalAvailable?: number;
  checkedAt?: Date;
  source?: string;
}

export interface ISalesPublic {
  startDateTime?: Date;
  endDateTime?: Date;
  startTBD?: boolean;
  startTBA?: boolean;
}

export interface IPresale {
  name?: string;
  startDateTime?: Date;
  endDateTime?: Date;
}

export interface ITicketLimit {
  globalLimit?: number;
  accessibilityLimit?: number;
  info?: string;
}

export interface ISeatmap {
  staticUrl?: string;
}

export interface ITicketing {
  safeTixEnabled?: boolean;
  allInclusivePricingEnabled?: boolean;
}

export interface IAttraction {
  id?: string;
  name?: string;
  url?: string;
}

export interface IEvent {
  _id?: string;
  id?: string;
  title?: string;
  detail?: string; // event description
  notes?: string; // from "pleaseNote"
  kind?: "user" | "ai";
  fee_type?: TEventFee;
  fee?: IFee;

  // Location
  country?: string;
  country_code?: string;
  region?: string;
  region_code?: string;
  address?: string;
  coordinate?: TCoordinate;
  loc?: IGeoPoint;

  // Categories / tags
  category?: string;
  subcategories?: string[];
  vibe?: string[];
  venue_type?: string[];

  // Core info
  url?: string;
  locale?: string;
  test?: boolean;
  type?: string;
  status?: string;
  timezone?: string;
  image?: string;
  images?: IImage[];

  // Timing
  opening_date?: Date;
  end_date?: Date;
  doors_time?: Date;

  // Sales info
  salesPublic?: ISalesPublic;
  salesPresales?: IPresale[];

  // Ticketing / seat map
  ticketLimit?: ITicketLimit;
  seatmap?: ISeatmap;
  ticketing?: ITicketing;

  // Classifications
  classifications?: IClassifications;

  // Pricing / offers
  priceRanges?: IPriceRange[];
  offers?: IOffer[];
  availability?: IAvailability;

  // Relations
  promoterId?: string;
  venue?: Record<string, unknown>;
  attractions?: IAttraction[];

  // Misc
  availability_hint?: string;
  lastSyncedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

/* ---- Fare ---- */
export interface Fare {
  Amount: string;
  CurrencyCode: string;
  DecimalPlaces: number;
}

/* ---- Extra Service ---- */
export interface ExtraService {
  NameNumber: number;
  Behavior?: string;
  CheckInType?: string;
  Description?: string;
  IsMandatory?: boolean;
  ServiceCost?: Fare;
  ServiceId?: string;
  Type?: string;
}

/* ---- Booking Notes ---- */
export interface BookingNote {
  NoteDetails?: string;
  CreatedOn?: string;
}

/* ---- Passenger Details ---- */
export interface CustomerInfo {
  PassengerType: string;
  PassengerTitle?: string;
  PassengerFirstName?: string;
  PassengerLastName?: string;
  PassportNumber?: string;
  ItemRPH?: number;
  eTicketNumber?: string;
  DateOfBirth?: string;
  EmailAddress?: string;
  Gender?: string;
  PassengerNationality?: string;
  PhoneNumber?: string;
  PostCode?: string;
}

/* ---- Fare Breakdown ---- */
export interface PassengerTypeQuantity {
  Code?: string;
  Quantity?: number;
}

export interface TripDetailsPassengerFare {
  EquiFare: Fare;
  ServiceTax: Fare;
  Tax: Fare;
  TotalFare: Fare;
}

export interface PaxFareBreakdown {
  PassengerTypeQuantity: PassengerTypeQuantity;
  TripDetailsPassengerFare: TripDetailsPassengerFare;
}

/* ---- Flight Segment ---- */
export interface ReservationItem {
  AirEquipmentType?: string;
  AirlinePNR?: string;
  ArrivalAirportLocationCode?: string;
  ArrivalDateTime?: string;
  ArrivalTerminal?: string;
  Baggage?: string;
  CabinClassText?: string;
  DepartureAirportLocationCode?: string;
  DepartureDateTime?: string;
  DepartureTerminal?: string;
  FlightNumber?: string;
  ItemRPH?: number;
  JourneyDuration?: string;
  MarketingAirlineCode?: string;
  NumberInParty?: number;
  OperatingAirlineCode?: string;
  ResBookDesigCode?: string;
  StopQuantity?: number;
}

/* ---- Itinerary Info ---- */
export interface ItineraryInfo {
  CustomerInfos: { CustomerInfo: CustomerInfo }[];
  ItineraryPricing: {
    EquiFare: Fare;
    ServiceTax: Fare;
    Tax: Fare;
    TotalFare: Fare;
  };
  ReservationItems: { ReservationItem: ReservationItem }[];
  TripDetailsPTC_FareBreakdowns: {
    TripDetailsPTC_FareBreakdown: PaxFareBreakdown;
  }[];
  ExtraServices?: {
    Services: { Service: ExtraService }[];
  };
  BookingNotes?: BookingNote[];
}

/* ---- Travel Itinerary ---- */
export interface TravelItinerary {
  BookingStatus?: string;
  CrossBorderIndicator?: boolean;
  Destination?: string;
  FareType?: string;
  IsCommissionable?: boolean;
  IsMOFare?: boolean;
  Origin?: string;
  TicketStatus?: string;
  UniqueID?: string;
  ItineraryInfo: ItineraryInfo;
}

/* ---- Trip Details ---- */
export interface TripDetails {
  Success: boolean;
  Target: string;
  TravelItinerary: TravelItinerary;
  sessionId?: string | null;
  fareSourceCode?: string | null;
  tktTimeLimit?: Date;
}

export interface IPaxDetails {
  name: string[];
}

export interface IRoom {
  name?: string;
  description?: string;
  boardType?: string; // raw "BED AND BREAKFAST|t|ROOM ONLY"
  paxDetails: IPaxDetails;
}

export interface IHotelBookingDetails {
  hotelId: string;
  hotelName?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  postalCode?: string;
  email?: string;
  phone?: string;
  image?: string | null;
  city?: string;
  country?: string;
  rating?: string;

  checkIn?: Date;
  checkOut?: Date;
  days?: number;

  currency?: string;
  NetPrice?: number;
  fareType?: string;
  cancellationPolicy?: string;

  cancelReferenceNum?: string | null;
  customerEmail?: string | null;
  customerPhone?: string;

  bookingDateTime?: Date;

  rooms: IRoom[];
}

export interface IHotel {
  roomBookDetails: IHotelBookingDetails;
  supplierConfirmationNum?: string;
  referenceNum?: string;
  clientRefNum?: string;
  productId?: string;
  sessionId?: string;
}

/* ---- Booking ---- */
export interface IBooking {
  _id?: string;
  userId: string;
  eventId: string;
  flight: TripDetails;
  hotel: IHotel;
  type: TPackageType;
  createdAt?: Date;
  updatedAt?: Date;
}
