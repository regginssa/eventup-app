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
  name: string;
  category: string;
  address: string;
  street: string;
  city: string;
  postalCode: string;
  countryCode: string;
  latitude: string;
  longitude: string;
  image: string;
  currency: string;
  totalAmount: number;
  netAmount: number;
  roomName: string;
  boardName: string;
  services: THotelService[];
  checkIn: string;
  checkOut: string;
  checkInInfo: string;
  converted: {
    totalAmount: number;
    netAmount: number;
    currency: string;
  };
}
