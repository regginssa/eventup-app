import { IUser } from "./user";

export type TNotificationType =
  | "new_event"
  | "new_attendees"
  | "event_update"
  | "ticket_purchase"
  | "event_ticket_released"
  | "event_ticket_refunded"
  | "receive_invite_group_chat"
  | "system"
  | "subscription_activated"
  | "subscription_expired"
  | "new_ticket_purchased"
  | "booking_payment_completed";

export interface INotification {
  _id?: string;
  user: IUser;
  type: TNotificationType;
  title: string;
  body?: string;
  link?: string;
  metadata: any;
  isRead: boolean;
  isArchived: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
