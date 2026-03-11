import IapAPI from "@/api/services/iap";
import { IOS_SKUS } from "@/constants/skus";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as RNIap from "react-native-iap";
import { useAuth } from "./AuthProvider";
import { useCommunityTicket } from "./CommunityTicketProvider";
import { useSubscription } from "./SubscriptionProvider";
import { useToast } from "./ToastProvider";

type IapContextType = {
  ready: boolean;
  products: RNIap.Product[];
  lastPurchase: {
    ok: boolean;
    type?: "ticket" | "subscription";
    message?: string;
    ticketId?: string;
    subscriptionId?: string;
  };
  buy: (sku: string) => Promise<void>;
  resetPurchase: () => void;
};

export const IapContext = createContext<IapContextType>({
  ready: false,
  products: [],
  buy: async () => {},
  lastPurchase: {
    ok: false,
    message: "",
  },
  resetPurchase: () => {},
});

export const useIap = () => useContext(IapContext);

interface IapProviderProps {
  children: React.ReactNode;
}

const IapProvider: React.FC<IapProviderProps> = ({ children }) => {
  const [lastPurchase, setLastPurchase] = useState<any>({
    ok: false,
    type: undefined,
    message: "",
    ticketId: undefined,
    subscriptionId: undefined,
  });

  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<RNIap.Product[]>([]);
  const { user } = useAuth();
  const { getBySku: getSubBySku } = useSubscription();
  const { getBySku: getTicketBySku } = useCommunityTicket();
  const toast = useToast();

  const purchaseSub = useRef<ReturnType<
    typeof RNIap.purchaseUpdatedListener
  > | null>(null);

  const errorSub = useRef<ReturnType<
    typeof RNIap.purchaseErrorListener
  > | null>(null);

  function resolvePurchaseMeta(productId: string) {
    if (productId.startsWith("EVENTWORLD.SUBSCRIPTION")) {
      const sub = getSubBySku(productId);
      return {
        type: "subscription",
        subscriptionId: sub?._id,
        currency: sub?.currency,
        amount: sub?.price,
        ticketId: null,
      };
    }

    if (productId.startsWith("EVENTWORLD.TICKET")) {
      const ticket = getTicketBySku(productId);

      return {
        type: "ticket",
        ticketId: ticket?._id,
        currency: ticket?.currency,
        amount: ticket?.price,
        subscriptionId: null,
      };
    }

    return null;
  }

  useEffect(() => {
    let mounted = true;

    async function initIap() {
      try {
        const ok = await RNIap.initConnection();
        if (!ok || !mounted) return;

        const allSkus = [
          ...Object.values(IOS_SKUS.subscription),
          ...Object.values(IOS_SKUS.ticket),
        ];

        const prods = await RNIap.fetchProducts({
          skus: allSkus,
        });

        if (mounted && prods) {
          setProducts(prods as RNIap.Product[]);
        }

        setReady(true);
      } catch (error) {
        console.warn("IAP init error:", error);
      }
    }

    initIap();

    purchaseSub.current = RNIap.purchaseUpdatedListener(async (purchase) => {
      try {
        if (!user?._id) return;

        const receipt = purchase.purchaseToken;
        if (!receipt) return;

        const meta = resolvePurchaseMeta(purchase.productId);

        if (!meta) {
          toast.error("Unknown SKU");
          return;
        }

        const res = await IapAPI.verify({
          userId: user._id,
          type: meta.type,
          ticketId: meta.ticketId,
          subscriptionId: meta.subscriptionId,
          currency: meta.currency,
          amount: meta.amount,
          productId: purchase.productId,
          transactionId: purchase.transactionId,
          receiptData: receipt,
        });

        if (res.ok) {
          await RNIap.finishTransaction({
            purchase,
            isConsumable: meta.type === "ticket",
          });
          setLastPurchase({
            ok: true,
            type: meta.type as any,
            ticketId: meta.ticketId,
            subscriptionId: meta.subscriptionId,
            message: "Purchase successful",
          });
        }
      } catch (error) {
        toast.error("Purchase failed");
      }
    });

    errorSub.current = RNIap.purchaseErrorListener((error) => {
      console.warn("IAP purchase error:", error);
    });

    return () => {
      mounted = false;

      purchaseSub.current?.remove();
      errorSub.current?.remove();

      RNIap.endConnection();
    };
  }, [user?._id]);

  const buy = async (sku: string) => {
    if (!ready) return;

    const isSubscription = sku.startsWith("EVENTWORLD.SUBSCRIPTION");

    try {
      await RNIap.requestPurchase({
        type: isSubscription ? "subs" : "in-app",
        request: isSubscription
          ? {
              ios: { sku },
              android: { skus: [sku] },
            }
          : {
              ios: { sku },
              android: { skus: [sku] },
            },
      });
    } catch (error) {
      console.warn("Purchase request error:", error);
    }
  };

  const resetPurchase = () => {
    setLastPurchase({
      ok: false,
      type: undefined,
      message: "",
      ticketId: undefined,
      subscriptionId: undefined,
    });
  };

  return (
    <IapContext.Provider
      value={{
        ready,
        products,
        lastPurchase,
        buy,
        resetPurchase,
      }}
    >
      {children}
    </IapContext.Provider>
  );
};

export default IapProvider;
