import { TFlight, THotel, TTransfer } from "@/types";
import {
  TAmadeusFlightBookingRequest,
  TAmadeusFlightOffer,
  TAmadeusHotelBookingRequest,
  TAmadeusHotelOffer,
  TAmadeusTransferBookingRequest,
} from "@/types/amadeus";
import { createContext, useContext, useState } from "react";

interface BookingContextProps {
  flight: TFlight | null;
  hotel: THotel | null;
  transfer: TTransfer | null;
  travelers: number;
  hotelRooms: number;
  setBookingFlight: (val: TFlight | null) => void;
  setBookingHotel: (val: THotel | null) => void;
  setBookingTransfer: (val: TTransfer | null) => void;
  setBookingFlightRequest: (val: TAmadeusFlightBookingRequest) => void;
  setBookingHotelRequest: (val: TAmadeusHotelBookingRequest) => void;
  setBookingTransferRequest: (val: TAmadeusTransferBookingRequest[]) => void;
  setBookingHotelRooms: (val: number) => void;
  setBookingTravelers: (val: number) => void;
  updateBookingFlightOfferById: (val: {
    id: string;
    offer: TAmadeusFlightOffer;
  }) => void;
  updateBookingHotelByIndex: (val: {
    index: number;
    offer: TAmadeusHotelOffer;
  }) => void;
}

const BookingContext = createContext<BookingContextProps | undefined>(
  undefined,
);

export const useBooking = () => {
  const ctx = useContext(BookingContext);

  if (!ctx) {
    throw new Error("useBooking must be within BookingProvider");
  }

  return ctx;
};

interface BookingProviderProps {
  children: React.ReactNode;
}

const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [flight, setFlight] = useState<TFlight | null>(null);
  const [hotel, setHotel] = useState<THotel | null>(null);
  const [transfer, setTransfer] = useState<TTransfer | null>(null);
  const [travelers, setTransvelers] = useState<number>(0);
  const [hotelRooms, setHotelRooms] = useState<number>(0);

  const setFlightRequest = (request: TAmadeusFlightBookingRequest) => {
    if (flight) {
      setFlight({ ...flight, request });
    }
  };

  const setHotelRequest = (request: TAmadeusHotelBookingRequest) => {
    if (!hotel) return;
    setHotel({ ...hotel, request });
  };

  const setTransferRequest = (requests: TAmadeusTransferBookingRequest[]) => {
    if (!transfer) return;
    setTransfer({ ...transfer, requests });
  };

  const updateBookingFlightOfferById = ({
    id,
    offer,
  }: {
    id: string;
    offer: TAmadeusFlightOffer;
  }) => {
    if (!flight) return;
    const updated = flight.offers.map((o) => (o.id === id ? offer : o));
    setFlight({ ...flight, offers: updated });
  };

  const updateBookingHotelByIndex = ({
    index,
    offer,
  }: {
    index: number;
    offer: any;
  }) => {
    setHotel((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        offers: [
          {
            ...prev.offers[0],
            offers: prev.offers[0].offers.map((o, i) =>
              i === index ? offer : o,
            ),
          },
        ],
      };
    });
  };

  return (
    <BookingContext.Provider
      value={{
        flight,
        hotel,
        transfer,
        travelers,
        hotelRooms,
        setBookingFlight: setFlight,
        setBookingHotel: setHotel,
        setBookingTransfer: setTransfer,
        setBookingFlightRequest: setFlightRequest,
        setBookingHotelRequest: setHotelRequest,
        setBookingTransferRequest: setTransferRequest,
        setBookingHotelRooms: setHotelRooms,
        setBookingTravelers: setTransvelers,
        updateBookingFlightOfferById,
        updateBookingHotelByIndex,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingProvider;
