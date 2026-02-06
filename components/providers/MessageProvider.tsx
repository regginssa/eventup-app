import { IMessage } from "@/types/message";
import { createContext, useContext, useState } from "react";
import { useSocket } from "./SocketProvider";

interface MessageContextProps {
  messages: IMessage[];
  sendMessage: (payload: any) => Promise<IMessage>;
  removeMessage: (messageId: string) => Promise<boolean>;
}

const MessageContext = createContext<MessageContextProps | undefined>(
  undefined,
);

export const useMessage = () => {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error("useMessage must be within MessageProvider");
  }

  return context;
};

interface MessageProviderProps {
  children: React.ReactNode;
}

const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { socket } = useSocket();

  const sendMessage = async (payload: any): Promise<IMessage> => {
    return new Promise((resolve, reject) => {
      if (!socket) return reject("Socket not connected");

      socket.emit("send_message");
    });
  };

  const removeMessage = async (messageId: string): Promise<boolean> => {
    return false;
  };

  return (
    <MessageContext.Provider value={{ messages, sendMessage, removeMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
