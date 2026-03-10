import SubscriptionAPI from "@/api/services/subscription";
import { ISubscription } from "@/types/subscription";
import { createContext, useContext, useEffect, useState } from "react";

interface SubscriptionContextProps {
  subscriptions: ISubscription[];
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

  useEffect(() => {
    const loadSubscriptions = async () => {
      const res = await SubscriptionAPI.getAll();
      setSubscriptions(res.data);
    };
    loadSubscriptions();
  }, []);

  return (
    <Context.Provider value={{ subscriptions }}>{children}</Context.Provider>
  );
};

export default SubscriptionProvider;
