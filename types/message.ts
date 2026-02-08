import { IUser } from "./user";

export type TMessageFile = {
  url: string;
  type: "image" | "video" | "audio" | "file";
};

export type TMessageStatus = "sent" | "seen";

export interface IMessage {
  _id?: string;
  conversation: string;
  sender: IUser;
  text: string;
  files: TMessageFile[];
  status: TMessageStatus;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}
