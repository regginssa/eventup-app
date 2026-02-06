import { fetchConversationMessages } from "@/api/services/message";
import { IMessage } from "@/types/message";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useConversation } from "./ConversationProvider";
import { useSocket } from "./SocketProvider";

interface MessageContextProps {
  messages: IMessage[];
  conversationId: string;
  setConversationId: (id: string) => void;
  loadMessages: (conversationId: string) => Promise<void>;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (payload: any) => void;
  markMessageSeen: (payload: any) => void;
  clearMessages: () => void;
}

const MessageContext = createContext<MessageContextProps | undefined>(
  undefined,
);

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) throw new Error("useMessage must be within MessageProvider");
  return context;
};

const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [conversationId, setConversationId] = useState<string>("");

  const { user } = useAuth();
  const { socket } = useSocket();
  const { updateUnread } = useConversation();

  // Load initial messages
  const loadMessages = async (conversationId: string) => {
    const response = await fetchConversationMessages(conversationId);

    if (!response.data) return;
    setMessages(response.data);
  };

  // JOIN ROOM
  const joinConversation = (conversationId: string) => {
    socket?.emit("join_conversation", conversationId);
    setMessages([]);
  };

  const leaveConversation = (conversationId: string) => {
    socket?.emit("leave_conversation", conversationId);
    setMessages([]);
  };

  // LISTEN FOR MESSAGES EVENTS
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (msg: IMessage) => {
      if (msg.conversation !== conversationId) return;
      setMessages((prev) => [...prev, msg]);
    };

    const handleSuccessMessageSeen = ({
      cnvId,
      userId,
    }: {
      cnvId: string;
      userId: string;
    }) => {
      if (cnvId !== conversationId) return;

      updateUnread(conversationId, userId, 0);

      setMessages((prev) =>
        prev.map((m) =>
          m.sender._id === user?._id ? { ...m, status: "seen" } : m,
        ),
      );
    };

    socket.on("new_message", handleIncoming);
    socket.on("messages_seen", handleSuccessMessageSeen);

    return () => {
      socket.off("new_message", handleIncoming);
      socket.off("messages_seen");
    };
  }, [socket]);

  // SEND MESSAGE (no callback)
  const sendMessage = (payload: any) => {
    if (!socket) return;
    socket.emit("send_message", payload);
  };

  // MARK SEEN
  const markMessageSeen = (payload: any) => {
    if (!socket) return;
    socket.emit("mark_message_seen", payload);
  };

  // CLEAR MESSAGE
  const clearMessages = () => setMessages([]);

  return (
    <MessageContext.Provider
      value={{
        messages,
        conversationId,
        setConversationId,
        loadMessages,
        joinConversation,
        leaveConversation,
        sendMessage,
        markMessageSeen,
        clearMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
