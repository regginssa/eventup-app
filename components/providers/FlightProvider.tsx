import flightServices from "@/api/services/flight";
import { IFlightBookingResponse, IFlightOffer } from "@/types/flight";
import { createContext, useContext, useState } from "react";

interface FlightContextProps {
  offer: IFlightOffer | null;
  search: (params: any) => Promise<IFlightOffer | null>;
  book: (bodyData: any) => Promise<IFlightBookingResponse>;
  initialize: () => void;
}

const FlightContext = createContext<FlightContextProps | undefined>(undefined);

export const useFlight = () => {
  const ctx = useContext(FlightContext);
  if (!ctx) {
    throw new Error("useFlight must be within FlightProvider");
  }
  return ctx;
};

interface FlightProviderProps {
  children: React.ReactNode;
}

const FlightProvider: React.FC<FlightProviderProps> = ({ children }) => {
  const [offer, setOffer] = useState<IFlightOffer | null>(null);

  const search = async (params: any): Promise<IFlightOffer | null> => {
    const response = await flightServices.get(params);
    setOffer(response.data);
    return response.data;
  };

  const book = async (params: any): Promise<IFlightBookingResponse> => {
    const response = await flightServices.book(params);
    return response.data;
  };

  const initialize = () => setOffer(null);

  return (
    <FlightContext.Provider value={{ offer, search, book, initialize }}>
      {children}
    </FlightContext.Provider>
  );
};

export default FlightProvider;
