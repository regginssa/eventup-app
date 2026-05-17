export type THotelBookStatus = "confirmed" | "pending" | "failed" | "cancelled";

export interface IHotelBookingResponse {
  status: THotelBookStatus;
  id?: string;
  reference?: string;
  hotelName?: string;
  checkIn?: string;
  checkOut?: string;
  message: string;
}

export type THotelService = {
  type: string;
  description: string;
};

export interface IHotelOffer {
  id: string;

  // =====================
  // HOTEL
  // =====================
  name: string;
  category: string;

  address: string;
  city: string;
  countryCode: string;

  latitude: string;
  longitude: string;

  image: string;

  // =====================
  // PRICING
  // =====================
  currency: string;
  totalAmount: number;
  netAmount: number;
  taxes: number;
  fees: number;
  dueAtAccommodation: number;

  // =====================
  // ROOM
  // =====================
  roomName: string;
  boardName: string;

  // =====================
  // POLICIES
  // =====================
  ratePolicy: string | null;

  cancellationPolicy: {
    raw: any[];
    summary: string | null;
    refundable: boolean;
    timeline?: any[];
  };

  // =====================
  // SERVICES
  // =====================
  services: {
    description: string;
    type: string;
  }[];

  // =====================
  // DATES
  // =====================
  checkIn: string;
  checkOut: string;
  checkInInfo: string | null;

  // =====================
  // FULL DATA (DETAIL PAGE)
  // =====================
  rooms: {
    name: string;
    rates: any[];
    photos: { url: string }[];
  }[];

  defaultRoom: any;
  defaultRate: any;

  // =====================
  // PAYMENT META (DUFFEL IMPORTANT)
  // =====================
  payment: {
    type: string;
    methods: string[];
    instructionAllowed: boolean;
  };

  availability: {
    quantity: number;
    expiresAt: string;
  };

  // =====================
  // CONVERTED VIEW
  // =====================
  converted: {
    totalAmount: number;
    netAmount: number;
    taxes: number;
    fees: number;
    currency: string;
  };
}
