export type THotelBookStatus = "confirmed" | "pending" | "failed" | "cancelled";

export interface IHotelBookingResponse {
  status: THotelBookStatus;
  bookingReference: string; // Hotelbeds 'reference' (e.g., 123-456789)
  clientReference: string; // Your internal ID (e.g., EVENTUP_171075)
  hotelName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: number;
  currency: string;
  vatNumber?: string; // Useful for the "Merchant Model" invoices
  message: string;
}

export interface IHotelOffer {
  id: string;
  name: string;
  category: string;
  address: string;
  latitude: string;
  longitude: string;
  image: string;
  currency: string;
  totalAmount: number;
  netAmount: number; // Original price for your records
  rateKey: string;
  roomName: string;
  boardName: string;
  cancellationPolicy: {
    amount: number;
    from: string;
  } | null;
}
