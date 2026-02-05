import { ITicket } from "./ticket";
import { IUser } from "./user";

type TM = {
  eventId?: string;
  url?: string;
  locale?: string;
  sales: {
    startDateTime?: string;
    endDateTime?: string;
    code?: string;
  };
  venueId?: string;
  ticketLimitInfo?: string;
};

export type EventDates = {
  start: {
    date?: string;
    time?: string;
  };
  end?: {
    date?: string;
    time?: string;
  };
  timezone?: string;
};

type Location = {
  name?: string;
  postalCode?: string;
  country: {
    name?: string;
    code?: string;
  };
  city: {
    name?: string;
    code?: string;
  };
  state: {
    name?: string;
    code?: string;
  };
  address?: string;
  coordinate: {
    longitude?: number;
    latitude?: number;
  };
};

type Classifications = {
  category?: string;
  subcategories?: string[];
  vibe?: string[];
  venue?: string[];
};

export type TEventFee = {
  type?: "free" | "paid";
  amount?: number;
  currency?: string;
};

export type TEventStatus =
  | "open"
  | "closed"
  | "pending"
  | "completed"
  | "cancelled";

export type TAttendees = {
  user: IUser;
  ticket?: ITicket;
  status: "approved" | "blocked";
};

export interface IEvent {
  _id?: string;
  type?: "ai" | "user";
  name?: string;
  description?: string;
  tm?: TM;
  dates?: EventDates;
  location?: Location;
  classifications?: Classifications;
  seatmap?: string;
  images?: string[];
  fee?: TEventFee;
  hoster?: IUser;
  status?: TEventStatus;
  attendees?: TAttendees[];
}
