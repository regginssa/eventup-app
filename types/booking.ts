import { IEvent } from "./event";
import { IUser } from "./user";

export type TBookingFlight = {
  orderId: string;
  airline: string;
  departure: {
    airport: string;
    datetime: string;
  };
  arrival: {
    airport: string;
    datetime: string;
  };
  class: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST" | string;
  confirmationCode: string;
};

export type TBookingHotel = {
  orderId: string;
  hotel: {
    id: string;
    name: string;
    image?: string;
  };
  checkIn: string;
  checkOut: string;
  rooms: {
    description: string;
    type: string;
  }[];
  providerCode?: string;
  confirmationCode: string;
};

export type TBookingTransfer = {
  orderId: string;
  type: "PRIVATE" | "SHARED" | string;
  start: {
    locationCode: string;
    datetime: string;
  };
  end: {
    googlePlaceId?: string;
    name?: string;
    locationCode?: string;
    address?: {
      line: string;
      zip?: string;
      countryCode: string;
      cityName: string;
      latitude: number;
      longitude: number;
      uicCode?: string;
    };
  };
  provider: {
    name: string;
    logo?: string;
    contacts: {
      phoneNumber?: string;
      email?: string;
    };
    vatRegistrationNumber: string;
  };
  vehicle: {
    description: string;
    seats: number;
    baggages: Array<{
      count: number;
      size: string;
    }>;
    image?: string;
  };
  distance: {
    value: number;
    unit: string;
  };
  confirmationCode?: string;
};

export interface IBooking {
  _id: string;
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
