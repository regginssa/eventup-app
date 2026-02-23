import { INotification } from "@/types/notification";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useSocket } from "./SocketProvider";

interface NotificationContextProps {
  notifications: INotification[];
  sendNotification: (payload: any) => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(
  undefined,
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be within NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const { user } = useAuth();
  const { socket } = useSocket();

  // LISTEN FOR NOTIFICATIONS EVENTS
  useEffect(() => {
    if (!socket) return;

    //   socket.on("new_message", handleIncoming);

    return () => {
      // socket.off("new_message", handleIncoming);
    };
  }, [socket, user?._id]);

  const sendNotification = (payload: any) => {
    if (!socket) return;
    socket.emit("send_notification", payload);
  };

  return (
    <NotificationContext.Provider value={{ notifications, sendNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
