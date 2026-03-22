import { fetchAllTickets } from "@/api/services/ticket";
import { ICommunityTicket } from "@/types/ticket";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

interface CommunityTicketContextProps {
  communityTickets: ICommunityTicket[];
  updateCommunityTickets: (val: ICommunityTicket[]) => void;
  getBySku: (sku: string) => ICommunityTicket | null;
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

  const { isAuthenticated } = useAuth();

  const getBySku = (sku: string): ICommunityTicket | null => {
    return (
      communityTickets.find(
        (ct) =>
          ct.currency.toUpperCase() === sku.split(".")[2] &&
          ct.price.toString() === sku.split(".")[3],
      ) || null
    );
  };

  useEffect(() => {
    const getAllTickets = async () => {
      const response = await fetchAllTickets();

      if (response.data) {
        setCommunityTickets(response.data);
      }
    };

    getAllTickets();
  }, [isAuthenticated]);

  const updateCommunityTickets = (tickets: ICommunityTicket[]) =>
    setCommunityTickets(tickets);

  return (
    <CommunityTicketContext.Provider
      value={{ communityTickets, updateCommunityTickets, getBySku }}
    >
      {children}
    </CommunityTicketContext.Provider>
  );
};

export default CommunityTicketProvider;
