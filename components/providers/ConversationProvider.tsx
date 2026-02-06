import { fetchUserConversations } from "@/api/services/conversation";
import { IConversation, TConversationType } from "@/types/conversation";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useSocket } from "./SocketProvider";

interface ConversationContextProps {
  conversations: IConversation[];
  createConversation: (
    type: TConversationType,
    payload: {
      user1Id: string;
      user2Id: string;
    },
  ) => Promise<IConversation>;
  updateUnread: (conversationId: string, userId: string, value: number) => void;
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
  const { socket } = useSocket();

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
      if (!socket) return reject("Socket not connected");

      // Emit creation request
      socket.emit(`create_${type}`, payload);

      // Listen for success response
      const successEvent = `${type}_created`;
      const errorEvent = `${type}_error`;

      const handleSuccess = (data: any) => {
        setConversations([...conversations, data]);
        resolve(data);
        cleanup();
      };

      const handleError = (err: any) => {
        reject(err);
        cleanup();
      };

      const cleanup = () => {
        socket.off(successEvent, handleSuccess);
        socket.off(errorEvent, handleError);
      };

      socket.on(successEvent, handleSuccess);
      socket.on(errorEvent, handleError);
    });
  };

  const updateUnread = (
    conversationId: string,
    userId: string,
    value: number,
  ) => {
    setConversations((prev) =>
      prev.map((c) =>
        c._id === conversationId
          ? {
              ...c,
              unread: {
                ...c.unread,
                [userId]: value,
              },
            }
          : c,
      ),
    );
  };

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        createConversation,
        updateUnread,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;
