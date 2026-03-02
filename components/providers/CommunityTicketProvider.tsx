import { fetchAllTickets } from "@/api/services/ticket";
import { ICommunityTicket } from "@/types/ticket";
import React, { createContext, useContext, useEffect, useState } from "react";

interface CommunityTicketContextProps {
  communityTickets: ICommunityTicket[];
  updateCommunityTickets: (val: ICommunityTicket[]) => void;
}

const CommunityTicketContext = createContext<
  CommunityTicketContextProps | undefined
>(undefined);

export const useCommunityTicket = () => {
  const context = useContext(CommunityTicketContext);

  if (!context) {
    throw new Error(
      "useCommunityTicket must be used within CommunityTicketProvider",
    );
  }

  return context;
};

interface CommunityTicketProviderProps {
  children: React.ReactNode;
}

const CommunityTicketProvider: React.FC<CommunityTicketProviderProps> = ({
  children,
}) => {
  const [communityTickets, setCommunityTickets] = useState<ICommunityTicket[]>(
    [],
  );

  useEffect(() => {
    const getAllTickets = async () => {
      const response = await fetchAllTickets();

      if (response.data) {
        setCommunityTickets(response.data);
      }
    };

    getAllTickets();
  }, []);

  const updateCommunityTickets = (tickets: ICommunityTicket[]) =>
    setCommunityTickets(tickets);

  return (
    <CommunityTicketContext.Provider
      value={{ communityTickets, updateCommunityTickets }}
    >
      {children}
    </CommunityTicketContext.Provider>
  );
};

export default CommunityTicketProvider;
