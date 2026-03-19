import DuffelAPI from "@/api/services/duffel";
import { createContext, useContext, useState } from "react";

interface DuffelContextProps {
  clientKey: string | null;
  initClientKey: (body: any) => Promise<string | null>;
}

const DuffelContext = createContext<DuffelContextProps | undefined>(undefined);

export const useDuffel = () => {
  const ctx = useContext(DuffelContext);
  if (!ctx) {
    throw new Error("useDuffel must be within DuffelProvider");
  }
  return ctx;
};

interface DuffelProviderProps {
  children: React.ReactNode;
}

const DuffelProvider: React.FC<DuffelProviderProps> = ({ children }) => {
  const [clientKey, setClientKey] = useState<string | null>(null);

  const initClientKey = async (body: any): Promise<string | null> => {
    const res = await DuffelAPI.createPaymentIntent(body);
    setClientKey(res.data?.clientToken || null);
    return res.data?.clientToken || null;
  };

  return (
    <DuffelContext.Provider value={{ clientKey, initClientKey }}>
      {children}
    </DuffelContext.Provider>
  );
};

export default DuffelProvider;
