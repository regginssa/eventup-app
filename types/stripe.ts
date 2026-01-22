export interface IPaymentMethod {
  payment_method_id: string;
  brand: string;
  expiryMonth: number;
  expiryYear: number;
  last4: number;
  postalCode: string;
}

export interface IStripe {
  customer_id: string;
  payment_methods: IPaymentMethod[];
}
