import SubscriptionAPI from "@/api/services/subscription";
import { ISubscription } from "@/types/subscription";
import { createContext, useContext, useEffect, useState } from "react";

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
  }, []);

  return (
    <Context.Provider value={{ subscriptions, getBySku }}>
      {children}
    </Context.Provider>
  );
};

export default SubscriptionProvider;
