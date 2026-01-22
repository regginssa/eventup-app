import { IEvent } from "./event";
import { IUser } from "./user";

export interface ApiResponse<T> {
  ok: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  user: IUser;
}

export interface EventsFeedResponse {
  events: IEvent[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}

// Payment Method Types
export interface SavedPaymentMethod {
  id: string;
  userId: string;
  type: "card" | "wallet"; // card = credit/debit card, wallet = digital wallet
  cardBrand?: "visa" | "mastercard" | "amex" | "discover"; // Only for card type
  last4Digits: string; // Last 4 digits for display
  expiryMonth?: number; // Only for card
  expiryYear?: number; // Only for card
  cardholderName?: string; // Only for card
  stripePaymentMethodId?: string; // Stripe's payment method ID for tokenized payments
  walletProvider?: string; // For wallet type: "paypal", "apple_pay", "google_pay"
  isPrimary: boolean;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface AddPaymentMethodRequest {
  type: "card" | "wallet";
  stripeToken: string; // Stripe token from Stripe.js
  cardholderName?: string;
  isPrimary?: boolean;
  billingDetails?: {
    name: string;
    email: string;
    phone?: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
}

export interface PaymentMethodResponse {
  id: string;
  last4Digits: string;
  cardBrand?: string;
  isPrimary: boolean;
  createdAt: Date;
}

export interface CheckoutPaymentRequest {
  paymentMethodId: string;
  amount: number;
  currency: "usd" | "eur" | "pln";
  orderId: string;
  orderDetails: {
    eventId: string;
    packageType: "standard" | "gold";
    items: {
      type: "flight" | "hotel" | "ticket" | "transfer";
      quantity: number;
      price: number;
    }[];
  };
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "succeeded" | "failed";
  message: string;
  timestamp: Date;
}

export interface BookingFlightResponse {
  errorMessage: string;
  status: string;
  success: boolean;
  target: string;
  tktTimeLimit: string;
  uniqueId: string;
}

export interface TicketFlightResponse {
  errorMessage: string;
  success: boolean;
  uniqueId: string;
}

export interface IBookingResponse {
  status: string;
  supplierConfirmationNum: string;
  referenceNum: string;
  clientRefNum: string;
  productId: string;
  roomBookDetails: RoomBookDetails;
  error: string;
}

export interface RoomBookDetails {
  hotelId: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  days: number;
  currency: string;
  NetPrice: string;
  fareType: string;
  cancellationPolicy: string; // raw text format from API
  customerEmail: string;
  customerPhone: string;
  rooms: RoomInfo[];
}

export interface RoomInfo {
  name: string;
  description: string;
  boardType: string;
  paxDetails: PaxDetails;
}

export interface PaxDetails {
  name: string[];
}
