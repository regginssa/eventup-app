import { fetchUserConversations } from "@/api/services/conversation";
import { useSocket } from "@/hooks/useSocket";
import { IConversation, TConversationType } from "@/types/conversation";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

interface ConversationContextProps {
  conversations: IConversation[];
  createConversation: (
    type: TConversationType,
    payload: {
      user1Id: string;
      user2Id: string;
    },
  ) => Promise<IConversation>;
}

const ConversationContext = createContext<ConversationContextProps | undefined>(
  undefined,
);

export const useConversation = () => {
  const context = useContext(ConversationContext);

  if (!context) {
    throw new Error("useConversation must be within ConversationProvider");
  }

  return context;
};

interface ConversationProviderProps {
  children: React.ReactNode;
}

const ConversationProvider: React.FC<ConversationProviderProps> = ({
  children,
}) => {
  const [conversations, setConversations] = useState<IConversation[]>([]);

  const { user } = useAuth();
  const socket = useSocket(user as any);

  useEffect(() => {
    const getUserConversations = async () => {
      if (!user?._id) return;

      const response = await fetchUserConversations(user._id);

      if (!response.data) return;
      setConversations(response.data);
    };
    getUserConversations();
  }, [user]);

  const createConversation = async (
    type: "dm" | "group",
    payload: { user1Id: string; user2Id: string },
  ): Promise<IConversation> => {
    return new Promise((resolve, reject) => {
      if (!socket.current) return reject("Socket not connected");

      // Emit creation request
      socket.current.emit(`create_${type}`, payload);

      // Listen for success response
      const successEvent = `${type}_created`;
      const errorEvent = `${type}_error`;

      const handleSuccess = (data: any) => {
        resolve(data);
        cleanup();
      };

      const handleError = (err: any) => {
        reject(err);
        cleanup();
      };

      const cleanup = () => {
        socket.current.off(successEvent, handleSuccess);
        socket.current.off(errorEvent, handleError);
      };

      socket.current.on(successEvent, handleSuccess);
      socket.current.on(errorEvent, handleError);
    });
  };

  return (
    <ConversationContext.Provider value={{ conversations, createConversation }}>
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;
