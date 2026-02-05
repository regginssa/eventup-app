import { IMessage } from "./message";
import { IUser } from "./user";

export interface IConversation {
  _id?: string;
  type: "dm" | "group";
  participants: IUser[];
  name?: string;
  avatar?: string;
  lastMessage: IMessage;
  createdAt: Date;
  updatedAt: Date;
}
