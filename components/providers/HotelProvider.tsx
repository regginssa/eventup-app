import services from "@/api/services/hotel";
import { IHotelBookingResponse, IHotelOffer } from "@/types/hotel";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthProvider";

interface HotelContextProps {
  topOffers: IHotelOffer[];
  offer: IHotelOffer | null;
  search: (params: any) => Promise<IHotelOffer | null>;
  quote: (rateId: string) => Promise<IHotelOffer | null>;
  book: (quoteId: string) => Promise<IHotelBookingResponse>;
  updateOffer: (offer: IHotelOffer | null) => void;
  initialize: () => void;
}

const HotelContext = createContext<HotelContextProps | undefined>(undefined);

export const useHotel = () => {
  const ctx = useContext(HotelContext);
  if (!ctx) {
    throw new Error("useHotel must be within HotelsProvider");
  }
  return ctx;
};

interface HotelProviderProps {
  children: React.ReactNode;
}

const HotelProvider: React.FC<HotelProviderProps> = ({ children }) => {
  const [offer, setOffer] = useState<IHotelOffer | null>(null);
  const [topOffers, setTopOffers] = useState<IHotelOffer[]>([]);

  const { user } = useAuth();

  const search = async (params: IHotelOffer | null) => {
    const response = await services.get(params);
    setTopOffers(response.data);
    setOffer(response.data[0]);
    return response.data[0];
  };

  const quote = async (rateId: string): Promise<IHotelOffer | null> => {
    const response = await services.quote(rateId);
    if (response.data) {
      setOffer(response.data);
    }
    return response.data;
  };

  const book = async (quoteId: string): Promise<IHotelBookingResponse> => {
    const body = {
      quoteId,
      phoneNumber: user?.phone,
      guestInfo: {
        given_name: user?.firstName,
        family_name: user?.lastName,
        born_on: user?.birthday,
        email: user?.email,
      },
      specialRequests: "",
    };

    const response = await services.book(body);
    return response.data;
  };

  const initialize = () => {
    setOffer(null);
    setTopOffers([]);
  };
  const updateOffer = (offer: IHotelOffer | null) => setOffer(offer);

  return (
    <HotelContext.Provider
      value={{ offer, topOffers, search, quote, book, initialize, updateOffer }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export default HotelProvider;
