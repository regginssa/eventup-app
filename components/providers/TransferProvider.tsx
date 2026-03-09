import services from "@/api/services/transfer";
import { ITransferBookingResponse, ITransferOffer } from "@/types/transfer";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthProvider";

interface TransferContextProps {
  airportToHotelOffer: ITransferOffer | null;
  hotelToEventOffer: ITransferOffer | null;
  search: (params: any, transferType: "ah" | "he") => Promise<void>;
  book: (offer: ITransferOffer) => Promise<ITransferBookingResponse>;
  initialize: () => void;
}

const TransferContext = createContext<TransferContextProps | undefined>(
  undefined,
);

export const useTransfer = () => {
  const ctx = useContext(TransferContext);
  if (!ctx) {
    throw new Error("useTransfer must be within TransferProvider");
  }
  return ctx;
};

interface TransferProviderProps {
  children: React.ReactNode;
}

const TransferProvider: React.FC<TransferProviderProps> = ({ children }) => {
  const [airportToHotelOffer, setAirportToHotelOffer] =
    useState<ITransferOffer | null>(null);
  const [hotelToEventOffer, setHotelToEventOffer] =
    useState<ITransferOffer | null>(null);

  const { user } = useAuth();

  const search = async (params: any, transferType: "ah" | "he") => {
    const response = await services.get(params);
    if (transferType === "ah") {
      setAirportToHotelOffer(response.data);
    } else {
      setHotelToEventOffer(response.data);
    }
  };

  const book = async (
    offer: ITransferOffer,
  ): Promise<ITransferBookingResponse> => {
    const body = {
      quoteId: offer.id,
      offerHash: offer.offerHash,
      passenger: {
        title: user?.gender,
        firstName: user?.firstName,
        lastName: user?.lastName,
        countryCode: user?.location.country.code,
        email: user?.email,
        phone: user?.phone,
      },
      offer: offer,
      pickupDateTime: offer.pickupDateTime,
    };
    const response = await services.book(body);
    return response.data;
  };

  const initialize = () => {
    setAirportToHotelOffer(null);
    setHotelToEventOffer(null);
  };

  return (
    <TransferContext.Provider
      value={{
        airportToHotelOffer,
        hotelToEventOffer,
        search,
        book,
        initialize,
      }}
    >
      {children}
    </TransferContext.Provider>
  );
};

export default TransferProvider;
