import hotelsServices from "@/api/services/hotel";
import { IHotelBookingResponse, IHotelOffer } from "@/types/hotel";
import { createContext, useContext, useState } from "react";

interface HotelsContextProps {
  offer: IHotelOffer | null;
  search: (params: any) => Promise<void>;
  checkRates: (params: any) => Promise<void>;
  book: (bodyData: any) => Promise<IHotelBookingResponse>;
}

const HotelsContext = createContext<HotelsContextProps | undefined>(undefined);

export const useHotels = () => {
  const ctx = useContext(HotelsContext);
  if (!ctx) {
    throw new Error("useHotels must be within HotelsProvider");
  }
  return ctx;
};

interface HotelsProviderProps {
  children: React.ReactNode;
}

const HotelsProvider: React.FC<HotelsProviderProps> = ({ children }) => {
  const [offer, setOffer] = useState<IHotelOffer | null>(null);

  const search = async (params: any) => {
    const response = await hotelsServices.get(params);
    setOffer(response.data);
  };

  const checkRates = async (params: any) => {
    const response = await hotelsServices.checkRates(params);
    setOffer(response.data);
  };

  const book = async (bodyData: any): Promise<IHotelBookingResponse> => {
    const response = await hotelsServices.book(bodyData);
    return response.data;
  };

  return (
    <HotelsContext.Provider value={{ offer, search, checkRates, book }}>
      {children}
    </HotelsContext.Provider>
  );
};

export default HotelsProvider;
