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

export type TBookingOption = "flight" | "hotel" | "transfer";

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
  payload: any;
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

export interface IRoomRate {
  productId: string;
  roomType: string;
  description: string;
  roomCode: string;
  fareType: string;
  rateBasisId: string;
  currency: string;
  netPrice: string;
  boardType: string;
  maxOccupancyPerRoom: string;
  inventoryType: string;
  cancellationPolicy: string;
  roomImages: string[];
  facilities: string[];
}

export interface THotelBookingRequest {
  sessionId: string;
  productId: string;
  tokenId: string;
  rateBasisId: string;
  clientRef?: string;
  customerEmail: string;
  customerPhone: string;
  bookingNote?: string;
  paxDetails: THotelPaxDetail[];
}

export interface THotelPaxDetail {
  room_no: number;
  adult: THotelGuestGroup;
  child?: THotelGuestGroup;
}

export interface THotelGuestGroup {
  title: string[]; // e.g., ["Mr", "Mrs"]
  firstName: string[]; // matching array indexes
  lastName: string[]; // matching array indexes
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
  roomRates: IRoomRate[];
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
  selectedRoomRate?: IRoomRate;
  payload: any;
  checkin: string;
  checkout: string;
  bookingRequest: THotelBookingRequest;
}

export interface TTransferAvailability {
  sessionId: string;
  searchResult: SearchResult;
  travelling: Travelling;
}

export interface SearchResult {
  originType: string; // AP / RST / IATA etc.
  originCode: string; // Example: SYD
  originName: string | null;
  originProperty: string | null;
  originDetails: string | null;

  endType: string; // RT / AC / AP etc.
  endCode: string; // Example: SYC
  endName: string | null;
  endProperty: string | null;
  endDetails: string | null;

  travelling: string; // ISO8601 datetime: "2025-12-11T00:15:00"
  adults: string;
  children: string;
  infants: string;
  resultCount: string;
}

export interface Travelling {
  products: Product[];
}

export interface Product {
  general: ProductGeneral;
  pricing: ProductPricing;
}

export interface ProductGeneral {
  productId: string;
  bookingTypeId: string;
  transferTime: string; // minutes
  productType: string; // e.g. "Shuttle", "Private Sedan"
  productTypeId: string;

  minPax: string | null;
  maxPax: string | null;
  luggage: string;
  smallBagAllowance: string;

  vehicleClass: string;
  vehicleMake: string;

  canxHours: string;
  canxPerc: string;
  canxOutOfHoursPP: string;

  minStops: string;
  maxStops: string;
  numUnits: string;

  supplierType: string;
  supplierId: string;
  productSource: string;

  companyLogo: string;
  vehicleImage: string;

  transferCompany: string; // Provider / supplier name
  rating: string | null;
  ratingClass: string | null;
  numberOfReviews: string | null;
  priceExpires: string | null;
  description: string;

  isDeposit: string; // "0" | "1"
  isCardPaymentAvailable: boolean;
}

export interface ProductPricing {
  oldPrice: string;
  price: string;
  currency: string;
  carbonOffset: string;

  transactionFees: TransactionFees;
  prices: PriceBreakup[];
  extras?: ExtraService[];
}

export interface TransactionFees {
  visa: string;
  masterCard: string;
  maestro: string;
  visaDebit: string;
  masterCardDebit: string;
  amex: string;
  payPal: string;
}

export interface PriceBreakup {
  type: string; // Adult/Child/Infant/Vehicle
  typeCode: string; // AD / CH / IN / VEH
  description: string;
  units: string;
  oldPrice: string;
  price: string;
  currency: string;
}

export interface ExtraService {
  type: string; // Child seat / Booster seat etc.
  typeCode: string;
  price: string;
  currency: string;
}

export type TTransferProduct = {
  general: {
    productId: string;
    bookingTypeId: string;
    transferTime: string; // minutes as string
    productType: string;
    productTypeId: string;
    minPax?: string;
    maxPax?: string;
    perPerson?: string;
    luggage: string;
    smallBagAllowance: string;
    vehicleClass?: string;
    vehicleMake?: string;
    canxHours?: string;
    canxPerc?: string;
    canxOutOfHoursPP?: string;
    minStops?: string;
    maxStops?: string;
    numUnits: string;
    supplierId: string;
    productSource?: string;
    supplierType: string;
    companyLogo?: string;
    vehicleImage: string;
    transferCompany: string;
    rating?: string;
    ratingClass?: string;
    numberOfReviews?: string;
    priceExpires?: string;
    description?: string;
    isDeposit: string;
    isCardPaymentAvailable: boolean;
  };
  pricing: {
    oldPrice: string;
    price: string;
    currency: string;
    carbonOffset?: string;
    transactionFees: {
      visa: string;
      masterCard: string;
      maestro: string;
      visaDebit: string;
      masterCardDebit: string;
      amex: string;
      payPal: string;
    };
    prices: Array<{
      price: {
        type: string;
        typeCode: string;
        description: string;
        units: string;
        oldPrice: string;
        price: string;
        currency: string;
      };
    }>;
    extras?: Array<{
      extra: {
        type: string;
        typeCode: string;
        price: string;
        currency: string;
      };
    }>;
  };
};

export interface ITransferAvailability {
  sessionId: string;
  searchResult: {
    originType: string;
    originCode: string;
    originName: string;
    originProperty?: string;
    originDetails?: string;
    endType: string;
    endCode: string;
    endName?: string;
    endProperty?: string;
    endDetails?: string;
    travelling: string;
    adults: string;
    children: string;
    infants: string;
    resultCount: string;
  };
  travelling: {
    products: TTransferProduct[];
  };
  bookingRequest: ITransferBookingRequest;
}

export interface IPaxDetails {
  lead_title: string; // Lead passenger's title (Mr/Ms/Dr)
  lead_first_name: string; // Lead passenger first name
  lead_last_name: string; // Lead passenger last name
  phone: string; // Contact mobile number
  email_id: string; // Lead passenger email
  address01: string; // Address line 1
  address02?: string; // Optional address line 2
  zip_code: string; // Zip/postal code
}

export interface IAccommodationDetails {
  accomodation_name: string; // Hotel / accommodation name
  accomodation_address01: string; // Address line 1
  accomodation_address02?: string; // Optional address line 2
}

export interface IPaymentDetails {
  card_type: string; // e.g., VISA, MasterCard
  card_no: string; // Card number (test card allowed)
  card_cvv: string; // CVV code
  expiry_date: string; // Expiry date in YYYY-MM format
  card_holder_name: string; // Name on the card
}

export interface IAirlineDetails {
  airport_code: string; // IATA airport code
  airline_code: string; // Airline code
  airline_number: string; // Flight number
}

export interface IExtraService {
  code: string; // Extra service code (e.g., CHS = Child seat, BAS = Booster seat)
  quantity: number; // Number of units
}

export interface ITransferBookingRequest {
  session_id: string; // Session token from availability search
  product_id: string; // Product ID of the selected transfer
  booking_type_id: string; // Booking Type ID from the product
  client_reference?: string; // Optional client reference
  pax_details: IPaxDetails; // Lead passenger details
  accomodation_details: IAccommodationDetails; // Hotel/accommodation info
  payment_details?: IPaymentDetails; // Optional payment info (if prepayment)
  departure_airline?: IAirlineDetails; // Optional departure flight info
  arrival_airline?: IAirlineDetails; // Optional arrival flight info
  extras?: IExtraService[]; // Optional extra services
  remark?: string; // Optional customer remarks
}

export type TTransfer = {
  ah: ITransferAvailability;
  he: ITransferAvailability;
};
