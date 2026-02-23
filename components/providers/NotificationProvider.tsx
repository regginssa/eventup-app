import notificationServices from "@/api/services/notification";
import { INotification } from "@/types/notification";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useSocket } from "./SocketProvider";

interface NotificationContextProps {
  notifications: INotification[];
  totalNotificationsUnreads: number;
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
  const [totalNotificationsUnreads, setTotalNotificationsUnreads] =
    useState<number>(0);

  const { user } = useAuth();
  const { socket } = useSocket();

  // LISTEN FOR NOTIFICATIONS EVENTS
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = ({
      notification,
      userId,
    }: {
      notification: INotification;
      userId: string;
    }) => {
      if (user?._id !== userId) return;
      setNotifications((prev) => [notification, ...prev]);
    };

    socket.on("notification_sent", handleIncoming);

    return () => {
      socket.off("notification_sent", handleIncoming);
    };
  }, [socket, user?._id]);

  useEffect(() => {
    const init = async () => {
      if (!user?._id) return;
      const response = await notificationServices.getByUserId(user._id);
      if (!response.data) return;
      setNotifications(response.data);
    };

    init();
  }, [user?._id]);

  useEffect(() => {
    const unreadCount = notifications.filter((n) => !n.isRead).length;
    setTotalNotificationsUnreads(unreadCount);
  }, [notifications]);

  const sendNotification = (payload: any) => {
    if (!socket) return;
    socket.emit("send_notification", payload);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, totalNotificationsUnreads, sendNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
