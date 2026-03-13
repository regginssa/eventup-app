import { TAccountType, TCoordinate, TEventLocation, TKycStatus } from ".";
import { IStripe } from "./stripe";
import { ICommunityTicket } from "./ticket";

export interface IKyc {
  sessionId: string;
  sessionNumber: number;
  sessionToken: string;
  vendorData: string;
  status: TKycStatus;
  url: string;
}

export type TUserLocation = {
  country: {
    name?: string;
    code?: string;
  };
  region: {
    name?: string;
    code?: string;
  };
  city: {
    name?: string;
    code?: string;
  };
  address?: string;
  coordinate: TCoordinate;
};

export type TOnlineStatus = "online" | "offline";

export interface IUser {
  _id?: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  title?: string;
  description?: string;
  location: TUserLocation;
  rate: number;
  accountType: TAccountType;
  signOption: "email" | "google" | "apple";
  googleId?: string;
  appleId?: string;
  blocked: boolean;
  idVerified: boolean;
  kyc: IKyc;
  preferred: {
    category: string;
    subcategories: string[];
    vibe: string[];
    venueType: string[];
    location: TEventLocation;
  };
  stripe?: IStripe;
  tickets: ICommunityTicket[];
  subscription: {
    id: string;
    startedAt?: string;
  };
  status: TOnlineStatus;
  birthday: string;
  phone: string;
  gender: "mr" | "ms";
  emailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
