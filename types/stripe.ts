export interface IPaymentMethod {
  id: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  last4: number;
  postalCode: string;
}

export interface IStripe {
  customerId: string;
  paymentMethods: IPaymentMethod[];
}

export interface IStripePayload {
  customerId: string;
  paymentMethodId: string;
  amount: number;
  currency: string;
  metadata: any;
}
