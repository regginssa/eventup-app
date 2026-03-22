import SubscriptionAPI from "@/api/services/subscription";
import { ISubscription } from "@/types/subscription";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useSocket } from "./SocketProvider";

interface SubscriptionContextProps {
  subscriptions: ISubscription[];
  getBySku: (sku: string) => ISubscription | null;
}

const Context = createContext<SubscriptionContextProps | undefined>(undefined);

export const useSubscription = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("useSubscription must be within SubscriptionProvider");
  }
  return ctx;
};

interface SubscriptionProviderProps {
  children: React.ReactNode;
}

const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
}) => {
  const [subscriptions, setSubscriptions] = useState<ISubscription[]>([]);

  const { user, setAuthUser, isAuthenticated } = useAuth();
  const { socket } = useSocket();

  const getBySku = (sku: string): ISubscription | null => {
    return (
      subscriptions.find((s) => s.month.toString() === sku.split(".")[2]) ||
      null
    );
  };

  useEffect(() => {
    const loadSubscriptions = async () => {
      const res = await SubscriptionAPI.getAll();
      setSubscriptions(res.data);
    };
    loadSubscriptions();
  }, [isAuthenticated]);

  useEffect(() => {
    if (!socket || !user?._id) return;

    const handleActivated = ({ subId, startedAt, userId }: any) => {
      if (user._id !== userId) return;

      setAuthUser({
        ...user,
        subscription: {
          id: subId,
          startedAt,
        },
      });
    };

    const handleExpire = ({ freeSubId, userId }: any) => {
      if (user._id !== userId) return;

      setAuthUser({
        ...user,
        subscription: {
          id: freeSubId,
          startedAt: undefined,
        },
      });
    };

    socket.on("subscription_activated", handleActivated);
    socket.on("subscription_expired", handleExpire);

    return () => {
      socket.off("subscription_activated", handleActivated);
      socket.off("subscription_expired", handleExpire);
    };
  }, [socket, user]);

  return (
    <Context.Provider value={{ subscriptions, getBySku }}>
      {children}
    </Context.Provider>
  );
};

export default SubscriptionProvider;
