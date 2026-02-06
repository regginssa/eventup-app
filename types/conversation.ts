import { IMessage } from "./message";
import { IUser } from "./user";

export type TConversationType = "dm" | "group";

export interface IConversation {
  _id?: string;
  type: TConversationType;
  participants: IUser[];
  name?: string;
  avatar?: string;
  lastMessage: IMessage;
  createdAt: Date;
  updatedAt: Date;
}
