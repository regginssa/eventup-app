import {
  createRestConversation,
  fetchUserConversations,
} from "@/api/services/conversation";
import { IConversation, TConversationType } from "@/types/conversation";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useSocket } from "./SocketProvider";

interface ConversationContextProps {
  conversations: IConversation[];
  totalMessagesUnreads: number;
  loadConversations: () => Promise<void>;
  createConversation: (
    type: TConversationType,
    payload: {
      user1Id: string;
      user2Id: string;
    },
  ) => Promise<IConversation>;
  createGroupConversation: (payload: any) => Promise<IConversation>;
  updateUnread: (conversationId: string, userId: string, value: number) => void;
  deleteDMConversation: (payload: any) => Promise<string>;
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
  const [unreads, setUnreads] = useState<number>(0);

  const { user } = useAuth();
  const { socket } = useSocket();

  const loadConversations = async () => {
    if (!user?._id) return;

    const response = await fetchUserConversations(user._id);

    if (!response.data) return;
    setConversations(response.data);
  };

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

      const handleSuccess = (data: any) => {
        setConversations([...conversations, data]);
        resolve(data);
        cleanup();
      };

      const cleanup = () => {
        socket.off(successEvent, handleSuccess);
      };

      socket.on(successEvent, handleSuccess);
    });
  };

  const createGroupConversation = async (
    payload: any,
  ): Promise<IConversation> => {
    const response = await createRestConversation(payload);
    setConversations((prev) => [...prev, response.data]);
    return response.data;
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

  const deleteDMConversation = async (payload: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!socket) return reject("Socket not connected");

      socket.emit("delete_dm_conversation", payload);

      socket.once("conversation_dm_deleted", (conversationId: string) => {
        setConversations((prev) =>
          prev.filter((p) => p._id !== conversationId),
        );
        resolve(conversationId);
      });
    });
  };

  useEffect(() => {
    if (!user?._id) return;

    let counts = 0;

    conversations.map((c) => {
      counts += c.unread?.[user?._id as any] || 0;
    });

    setUnreads(counts);
  }, [conversations]);

  useEffect(() => {
    const getAllConversations = async () => {
      if (!user?._id) return;

      const response = await fetchUserConversations(user._id);
      if (!response.data) return;
      setConversations(response.data);
    };
    getAllConversations();
  }, [user]);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        totalMessagesUnreads: unreads,
        loadConversations,
        createConversation,
        createGroupConversation,
        updateUnread,
        deleteDMConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export default ConversationProvider;
