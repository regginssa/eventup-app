import flightsServices from "@/api/services/flight";
import { IFlightBookingResponse, IFlightOffer } from "@/types/flight";
import { createContext, useContext, useState } from "react";

interface FlightsContextProps {
  offer: IFlightOffer | null;
  search: (params: any) => Promise<void>;
  book: (bodyData: any) => Promise<IFlightBookingResponse>;
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
  const [offer, setOffer] = useState<IFlightOffer | null>(null);

  const search = async (params: any) => {
    const response = await flightsServices.get(params);
    if (!response.data) return;
    setOffer(response.data);
  };

  const book = async (params: any): Promise<IFlightBookingResponse> => {
    const response = await flightsServices.book(params);
    return response.data;
  };

  return (
    <FlightsContext.Provider value={{ offer, search, book }}>
      {children}
    </FlightsContext.Provider>
  );
};

export default FlightsProvider;
