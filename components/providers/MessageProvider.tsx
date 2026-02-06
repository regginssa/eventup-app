import { fetchConversationMessages } from "@/api/services/message";
import { IMessage } from "@/types/message";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocket } from "./SocketProvider";

interface MessageContextProps {
  messages: IMessage[];
  loadMessages: (conversationId: string) => Promise<void>;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (payload: any) => void;
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
  const { socket } = useSocket();
  const [messages, setMessages] = useState<IMessage[]>([]);

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

  // LISTEN FOR new_message
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (msg: IMessage) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("new_message", handleIncoming);

    return () => {
      socket.off("new_message", handleIncoming);
    };
  }, [socket]);

  // SEND MESSAGE (no callback)
  const sendMessage = (payload: any) => {
    if (!socket) return;
    socket.emit("send_message", payload);
  };

  const clearMessages = () => setMessages([]);

  return (
    <MessageContext.Provider
      value={{
        messages,
        loadMessages,
        joinConversation,
        leaveConversation,
        sendMessage,
        clearMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
