import { IUser } from "./user";

export type TFile = {
  url: string;
  type: "image" | "video" | "audio" | "file";
};

export type TMessageStatus = "sent" | "delivered" | "seen";

export interface IMessage {
  _id?: string;
  conversation: string;
  sender: IUser;
  text: string;
  files: TFile[];
  status: TMessageStatus;
  createdAt: Date;
  updatedAt: Date;
}
