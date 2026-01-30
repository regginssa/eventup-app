import { IEvent } from "./event";
import { IUser } from "./user";

export type TBookingFlight = {
  orderId: string;
  associatedRecord: {
    reference: string;
    originSystemCode: "GDS" | "NON_GDS" | string;
  };
  validatingAirline: string;
  status?: string;
  price: {
    total: number;
    currency: string;
  };
  travelers: {
    id: string;
    firstName: string;
    lastName: string;
  }[];
  itineraries: {
    segments: {
      departure: {
        airport: string;
        datetime: string;
      };
      arrival: {
        airport: string;
        datetime: string;
      };
      marketingCarrier: string;
      operatingCarrier?: string;
      flightNumber: string;
      cabin: string;
      baggage: {
        quantity?: number;
        weight?: number;
        unit?: string;
      };
    }[];
  }[];
};

export type TBookingHotel = {
  orderId: string;
  status: string;
  hotel: {
    id: string;
    name: string;
    image?: string;
  };
  checkIn: string;
  checkOut: string;
  rooms: Array<{
    bookingId: string;
    providerCode: string;
    confirmationNumber: string;
    roomType: string;
    rateCode: string;
  }>;
  price: {
    total: number;
    currency: string;
  };
  guests: Array<{
    id: string | number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }>;
  associatedRecord: {
    reference: string;
    originSystemCode: "GDS" | "NON_GDS" | string;
  };
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

export interface IBooking {
  _id?: string;
  flight: TBookingFlight;
  hotel: TBookingHotel;
  transfer: {
    ah: TBookingTransfer;
    he: TBookingTransfer;
  };
  timezone: string;
  event: IEvent;
  user: IUser;
  price: {
    total: number;
    base: number;
    comission: number;
    currency: string;
  };
  billingAddress: {
    line: string;
    zip: string;
    countryCode: string;
    cityName: string;
  };
  billingPayment: {
    method: string;
    cardNumber: string;
    expiryDate: string;
    holderName: string;
    vendorCode: string;
    cvv: string;
  };
}
