import services from "@/api/services/hotel";
import { IHotelBookingResponse, IHotelOffer } from "@/types/hotel";
import { createContext, useContext, useState } from "react";

interface HotelContextProps {
  offer: IHotelOffer | null;
  search: (params: any) => Promise<IHotelOffer | null>;
  checkRates: (params: any) => Promise<IHotelOffer | null>;
  book: (bodyData: any) => Promise<IHotelBookingResponse>;
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

  const search = async (params: IHotelOffer | null) => {
    const response = await services.get(params);
    setOffer(response.data);
    return response.data;
  };

  const checkRates = async (params: any): Promise<IHotelOffer | null> => {
    const response = await services.checkRates(params);
    setOffer(response.data);
    return response.data;
  };

  const book = async (bodyData: any): Promise<IHotelBookingResponse> => {
    const response = await services.book(bodyData);
    return response.data;
  };

  const initialize = () => setOffer(null);

  return (
    <HotelContext.Provider
      value={{ offer, search, checkRates, book, initialize }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export default HotelProvider;
