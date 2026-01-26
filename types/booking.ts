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
  class: "standard" | "gold";
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
  type: string;
  provider: {
    name: string;
    logo: string;
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
};

export interface IBooking {
  _id: string;
  flight: TBookingFlight;
  hotel: TBookingHotel;
  transfer: TBookingTransfer;
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

//   const reservationItems =
//     flight?.TravelItinerary?.ItineraryInfo?.ReservationItems;

//   // Pick first segment for display
//   const firstSegment = reservationItems?.[0]?.ReservationItem;
//   const lastSegment =
//     reservationItems?.[reservationItems.length - 1]?.ReservationItem;

//   const airlineLabel = firstSegment
//     ? `Airline: ${firstSegment.MarketingAirlineCode} ${firstSegment.FlightNumber}`
//     : "Airline: N/A";

//   const departureLabel = firstSegment
//     ? `Departure: ${
//         firstSegment.DepartureAirportLocationCode
//       } - ${formatDateTime(firstSegment.DepartureDateTime as any)}`
//     : "Departure: N/A";

//   const arrivalLabel = lastSegment
//     ? `Arrival: ${lastSegment.ArrivalAirportLocationCode} - ${formatDateTime(
//         lastSegment.ArrivalDateTime as any
//       )}`
//     : "Arrival: N/A";

//   const classLabel = firstSegment
//     ? `Class: ${packageType === "standard" ? "Economy/Standard" : "VIP/Gold"}`
//     : "Class: N/A";

//   const confirmationCode = firstSegment?.AirlinePNR || "N/A";
