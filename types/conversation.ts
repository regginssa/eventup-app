import { IEvent } from "./event";
import { IMessage } from "./message";
import { IUser } from "./user";

export type TConversationType = "dm" | "group";

export interface IConversation {
  _id?: string;
  type: TConversationType;
  participants: IUser[];
  name?: string;
  avatar?: string;
  creator?: IUser;
  event?: IEvent;
  lastMessage?: IMessage;
  unread?: Record<string, number>;
  hiddenFor: string[];
  createdAt: Date;
  updatedAt: Date;
}
