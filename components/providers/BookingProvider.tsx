import { IBooking } from "@/types/booking";
import { createContext, useContext, useState } from "react";

interface BookingContextProps {
  bookings: IBooking[];
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
  const [bookings, setBookings] = useState<IBooking[]>([]);

  return (
    <BookingContext.Provider value={{ bookings }}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingProvider;
