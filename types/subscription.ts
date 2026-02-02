export interface ISubscription {
  month: number;
  price: number;
  features: string[];
  isActive?: boolean;
  isRecommended?: boolean;
  save?: number;
}
