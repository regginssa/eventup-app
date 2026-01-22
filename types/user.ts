import { TAccountType, TCoordinate, TEventLocation, TKycStatus } from ".";
import { IStripe } from "./stripe";

export interface IKyc {
  sessionId: string;
  sessionNumber: number;
  sessionToken: string;
  vendorData: string;
  status: TKycStatus;
  url: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  about?: string;
  location: {
    country?: string;
    country_code?: string;
    region?: string;
    region_code?: string;
    address?: string;
    coordinate: TCoordinate;
  };
  account_type: TAccountType;
  sign_option: "email" | "google" | "apple";
  google_id?: string;
  apple_id?: string;
  is_blocked: boolean;
  is_id_verified: boolean;
  kyc: IKyc;
  preferred: {
    category: string;
    subcategories: string[];
    vibe: string[];
    venue_type: string[];
    location: TEventLocation;
  };
  stripe: IStripe;
}
