import services from "@/api/services/hotel";
import { IHotelBookingResponse, IHotelOffer } from "@/types/hotel";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthProvider";

interface HotelContextProps {
  offer: IHotelOffer | null;
  search: (params: any) => Promise<IHotelOffer | null>;
  quote: (rateId: string) => Promise<IHotelOffer | null>;
  book: (quoteId: string) => Promise<IHotelBookingResponse>;
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

  const { user } = useAuth();

  const search = async (params: IHotelOffer | null) => {
    const response = await services.get(params);
    setOffer(response.data);
    return response.data;
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
      phoneNumber: "+442080160509",
      guestInfo: {
        given_name: "Jhon",
        family_name: "Doe",
        born_on: "1990-01-01",
        email: user?.email,
      },
      specialRequests: "123",
    };

    const response = await services.book(body);
    return response.data;
  };

  const initialize = () => setOffer(null);

  return (
    <HotelContext.Provider value={{ offer, search, quote, book, initialize }}>
      {children}
    </HotelContext.Provider>
  );
};

export default HotelProvider;
