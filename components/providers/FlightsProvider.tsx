import flightsServices from "@/api/services/flights";
import { IFlightBookingResponse, IFlightOffer } from "@/types/flight";
import { createContext, useContext, useState } from "react";

interface FlightsContextProps {
  offers: IFlightOffer[];
  search: (params: any) => Promise<void>;
  book: (params: any) => Promise<IFlightBookingResponse>;
}

const FlightsContext = createContext<FlightsContextProps | undefined>(
  undefined,
);

export const useFlights = () => {
  const ctx = useContext(FlightsContext);
  if (!ctx) {
    throw new Error("useFlights must be within FlightsProvider");
  }
  return ctx;
};

interface FlightsProviderProps {
  children: React.ReactNode;
}

const FlightsProvider: React.FC<FlightsProviderProps> = ({ children }) => {
  const [offers, setOffers] = useState<IFlightOffer[]>([]);

  const search = async (params: any) => {
    const response = await flightsServices.get(params);
    if (!response.data) return;
    setOffers(response.data);
  };

  const book = async (params: any): Promise<IFlightBookingResponse> => {
    const response = await flightsServices.book(params);
    return response.data;
  };

  return (
    <FlightsContext.Provider value={{ offers, search, book }}>
      {children}
    </FlightsContext.Provider>
  );
};

export default FlightsProvider;
