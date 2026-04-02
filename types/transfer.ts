export type TTransferBookStatus = "confirmed" | "pending" | "failed";

export interface ITransferOffer {
  id: string; // Quote ID
  vehicleType: string;
  vehicleName: string;
  capacity: number;
  image: string;
  currency: string;
  netAmount: number;
  totalAmount: number;
  rateKey: string; // required for booking
  waitingTime: string; // e.g. "48 minutes"
  pickupPoint: string; // formatted UX-friendly string
  destinationPoint: string; // formatted UX-friendly string
  pickupDateTime: string;
  converted: {
    totalAmount: number;
    netAmount: number;
    currency: string;
  };
}

export interface ITransferBookingResponse {
  status: TTransferBookStatus;
  reference: string; // HBX booking reference
  clientReference?: string; // your ID
  pickupDateTime?: string;
  pickupPoint?: string;
  destinationPoint?: string;
  vehicleName?: string;
  totalAmount?: number;
  currency?: string;
  supplierPhone?: string;
  message: string;
}
