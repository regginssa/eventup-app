import { fetchConversationMessages } from "@/api/services/message";
import { IMessage } from "@/types/message";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useConversation } from "./ConversationProvider";
import { useSocket } from "./SocketProvider";

interface MessageContextProps {
  messages: IMessage[];
  currentConversationId: string;
  updateCurrentConversationId: (id: string) => void;
  loadMessages: (conversationId: string) => Promise<void>;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendMessage: (payload: any) => void;
  markMessageSeen: (payload: any) => void;
  removeMessage: (payload: any) => void;
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
  const [currentConversationId, setCurrentConversationId] =
    useState<string>("");

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
      if (msg.conversation !== currentConversationId) return;
      setMessages((prev) => [...prev, msg]);
    };

    const handleSuccessMessageSeen = ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      if (conversationId !== currentConversationId) return;

      updateUnread(currentConversationId, userId, 0);

      setMessages((prev) =>
        prev.map((m) =>
          m.sender._id === user?._id ? { ...m, status: "seen" } : m,
        ),
      );
    };

    const handleMessageRemoved = ({
      messageId,
      conversationId,
    }: {
      messageId: string;
      conversationId: string;
    }) => {
      if (conversationId !== currentConversationId) return;
      setMessages(messages.filter((m) => m._id !== messageId));
    };

    socket.on("new_message", handleIncoming);
    socket.on("messages_seen", handleSuccessMessageSeen);
    socket.on("message_removed", handleMessageRemoved);

    return () => {
      socket.off("new_message", handleIncoming);
      socket.off("messages_seen");
    };
  }, [socket, currentConversationId]);

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

  // REMOVE A MESSAGE
  const removeMessage = (payload: any) => {
    socket.emit("send_message", payload);
  };

  // CLEAR MESSAGE
  const clearMessages = () => setMessages([]);

  // UPDATE CURRENT CONVERSATION ID
  const updateCurrentConversationId = (convId: string) => {
    setCurrentConversationId(convId);
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        currentConversationId,
        updateCurrentConversationId,
        loadMessages,
        joinConversation,
        leaveConversation,
        sendMessage,
        markMessageSeen,
        removeMessage,
        clearMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
