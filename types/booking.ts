import { TPackageType } from ".";
import { IEvent } from "./event";
import {
  IFlightBookingResponse,
  IFlightOffer,
  TFlightBookStatus,
} from "./flight";
import { IHotelBookingResponse, IHotelOffer, THotelBookStatus } from "./hotel";
import { TTransactionStatus } from "./transaction";
import {
  ITransferBookingResponse,
  ITransferOffer,
  TTransferBookStatus,
} from "./transfer";
import { IUser } from "./user";

export interface IBooking {
  _id?: string;
  user: IUser;
  event: IEvent;
  status: "pending" | "confirmed" | "failed" | "partially_confirmed";

  // Flight Section
  flight: {
    offer: IFlightOffer;
    booking?: IFlightBookingResponse | any;
    status: TFlightBookStatus;
  };

  // Hotel Section
  hotel: {
    offer: IHotelOffer;
    booking?: IHotelBookingResponse | any;
    status: THotelBookStatus;
  };

  // Transfers (Always Two)
  transfer: {
    airportToHotel: {
      offer: ITransferOffer;
      booking?: ITransferBookingResponse | any;
      status: TTransferBookStatus;
    };
    hotelToEvent: {
      offer: ITransferOffer;
      booking?: ITransferBookingResponse | any;
      status: TTransferBookStatus;
    };
  };

  price: {
    totalAmount: number;
    currency: string;
  };
  packageType: TPackageType;
  paymentStatus: TTransactionStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
