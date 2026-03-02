export type TTransferBookStatus = "confirmed" | "pending" | "failed";

export interface ITransferOffer {
  id: string; // Transfer code
  vehicleType: string; // e.g., "PRIVATE" or "SHARED"
  vehicleName: string; // e.g., "Standard Sedan"
  capacity: number;
  image: string;
  currency: string;
  netAmount: number;
  totalAmount: number; // Including your markup
  rateKey: string;
  waitingTime: string; // e.g., "60 minutes"
  pickupPoint: string;
  destinationPoint: string;
}

export interface ITransferBookingResponse {
  status: TTransferBookStatus;
  bookingReference: string;
  clientReference: string;
  pickupDate: string;
  pickupTime: string;
  vehicleName: string;
  totalAmount: number;
  currency: string;
  message: string;
}
