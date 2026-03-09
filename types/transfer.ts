export type TTransferBookStatus = "confirmed" | "pending" | "failed";

export interface ITransferOffer {
  id: string; // Quote ID
  vehicleType: "SHARED" | "PRIVATE";
  vehicleName: string;
  capacity: number;
  image: string;
  currency: string;
  netAmount: number;
  totalAmount: number;
  offerHash: string; // required for booking
  waitingTime: string; // e.g. "48 minutes"
  pickupPoint: string; // formatted UX-friendly string
  destinationPoint: string; // formatted UX-friendly string
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
