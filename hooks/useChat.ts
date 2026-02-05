import { fetchConversationMessages } from "@/api/services/message";
import { IMessage, TMessageStatus } from "@/types/message";
import { useEffect, useState } from "react";

export const useChat = (conversationId: string, socket: any) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  // join conversation room
  useEffect(() => {
    if (!socket.current) return;
    socket.current.emit("join_conversation", conversationId);
  }, [socket]);

  // fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      const res = await fetchConversationMessages(conversationId);
      setMessages(res.data);
    };
    fetchMessages();
  }, [conversationId]);

  // listen for new messages
  useEffect(() => {
    if (!socket.current) return;

    socket.current.on("new_message", (msg: IMessage) => {
      if (msg.conversation === conversationId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.current.off("new_message");
    };
  }, [socket, conversationId]);

  const sendMessage = (payload: any) => {
    socket.current.emit("send_message", payload);
  };

  const updateStatus = (messageId: string, status: TMessageStatus) => {
    socket.current.emit("update_message_status", { messageId, status });
  };

  return { messages, sendMessage, updateStatus };
};
