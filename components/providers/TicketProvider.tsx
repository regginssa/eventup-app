import { fetchAllTickets } from "@/api/services/ticket";
import { ITicket } from "@/types/ticket";
import React, { createContext, useContext, useEffect, useState } from "react";

interface TicketContextProps {
  tickets: ITicket[];
  setTickets: (val: ITicket[]) => void;
}

const TicketContext = createContext<TicketContextProps | undefined>(undefined);

export const useTicket = () => {
  const context = useContext(TicketContext);

  if (!context) {
    throw new Error("useTicket must be used within TicketProvider");
  }

  return context;
};

interface TicketProviderProps {
  children: React.ReactNode;
}

const TicketProvider: React.FC<TicketProviderProps> = ({ children }) => {
  const [tickets, setTickets] = useState<ITicket[]>([]);

  useEffect(() => {
    const getAllTickets = async () => {
      const response = await fetchAllTickets();

      if (response.data) {
        setTickets(response.data);
      }
    };

    getAllTickets();
  }, []);

  return (
    <TicketContext.Provider value={{ tickets, setTickets }}>
      {children}
    </TicketContext.Provider>
  );
};

export default TicketProvider;
