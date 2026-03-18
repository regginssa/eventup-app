import notificationServices from "@/api/services/notification";
import { INotification } from "@/types/notification";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useSocket } from "./SocketProvider";

interface NotificationContextProps {
  notifications: INotification[];
  totalNotificationsUnreads: number;
  load: () => Promise<void>;
  send: (payload: any) => void;
  markRead: () => Promise<void>;
  remove: (id: string) => Promise<void>;
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

  const load = async () => {
    if (!user?._id) return;
    const res = await notificationServices.getByUserId(user._id);
    if (!res.data) return;
    setNotifications(res.data);
  };

  const send = (payload: any) => {
    if (!socket) return;
    socket.emit("send_notification", payload);
  };

  const markRead = async () => {
    const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n._id);
    if (unreadIds.length === 0) return;
    await notificationServices.markRead(unreadIds as string[]);
    setNotifications((prev) =>
      prev.map((n) => (unreadIds.includes(n._id) ? { ...n, isRead: true } : n)),
    );
  };

  const remove = async (id: string) => {
    await notificationServices.remove(id);
    setNotifications((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        totalNotificationsUnreads,
        load,
        send,
        markRead,
        remove,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
