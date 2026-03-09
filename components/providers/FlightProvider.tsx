import flightServices from "@/api/services/flight";
import { IFlightBookingResponse, IFlightOffer } from "@/types/flight";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthProvider";

interface FlightContextProps {
  offer: IFlightOffer | null;
  search: (params: any) => Promise<IFlightOffer | null>;
  book: (offer: IFlightOffer) => Promise<IFlightBookingResponse>;
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

  const { user } = useAuth();

  const search = async (params: any): Promise<IFlightOffer | null> => {
    const response = await flightServices.get(params);
    setOffer(response.data);
    return response.data;
  };

  const book = async (offer: IFlightOffer): Promise<IFlightBookingResponse> => {
    if (!offer || offer.passengerIds.length === 0 || !offer.totalAmount)
      return { status: "processing", message: "Invalid offer data" };

    const bodyData = {
      offerId: offer.id,
      passengers: [
        {
          id: offer.passengerIds[0],
          type: "adult",
          given_name: user?.firstName,
          family_name: user?.lastName,
          gender: user?.gender === "mr" ? "m" : "f",
          born_on: user?.birthday,
          email: user?.email,
          phone_number: user?.phone,
          title: user?.gender,
        },
      ],
      totalAmount: Number(offer.totalAmount),
      currency: offer.currency,
    };

    const response = await flightServices.book(bodyData);
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
