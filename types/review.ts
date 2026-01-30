import { IEvent } from "./event";
import { IUser } from "./user";

export interface IReview {
  _id?: string;
  from: IUser;
  to: IUser;
  event: IEvent;
  description: string;
  score: number;
  createdAt: Date;
}
