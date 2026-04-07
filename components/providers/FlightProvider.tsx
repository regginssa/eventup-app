import flightServices from "@/api/services/flight";
import { IFlightBookingResponse, IFlightOffer } from "@/types/flight";
import { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthProvider";

interface FlightContextProps {
  topOffers: IFlightOffer[];
  offer: IFlightOffer | null;
  search: (params: any) => Promise<IFlightOffer | null>;
  book: (offer: IFlightOffer) => Promise<IFlightBookingResponse>;
  updateOffer?: (offer: IFlightOffer | null) => void;
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
  const [topOffers, setTopOffers] = useState<IFlightOffer[]>([]);

  const { user } = useAuth();

  const search = async (params: any): Promise<IFlightOffer | null> => {
    const response = await flightServices.get(params);
    setTopOffers(response.data);
    setOffer(response.data[0]);
    return response.data[0];
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

  const updateOffer = (offer: IFlightOffer | null) => {
    setOffer(offer);
  };

  const initialize = () => {
    setOffer(null);
    setTopOffers([]);
  };

  return (
    <FlightContext.Provider
      value={{ offer, topOffers, search, book, updateOffer, initialize }}
    >
      {children}
    </FlightContext.Provider>
  );
};

export default FlightProvider;
