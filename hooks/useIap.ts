import IapAPI from "@/api/services/iap";
import { IOS_SKUS } from "@/constants/skus";
import { useEffect, useRef, useState } from "react";
import * as RNIap from "react-native-iap";

type UseIapOpts = {
  userId: string;
  onVerified?: () => Promise<void> | void; // call handleSuccess here
};

export const useIap = ({ userId, onVerified }: UseIapOpts) => {
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<RNIap.Product[]>([]);
  const purchaseSub = useRef<ReturnType<
    typeof RNIap.purchaseUpdatedListener
  > | null>(null);
  const errorSub = useRef<ReturnType<
    typeof RNIap.purchaseErrorListener
  > | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const ok = await RNIap.initConnection();
      if (!ok || !mounted) return;

      const prods = await RNIap.getProducts(Object.values(IOS_SKUS) as any);
      if (mounted) setProducts(prods);
      setReady(true);
    })();

    purchaseSub.current = RNIap.purchaseUpdatedListener(async (purchase) => {
      try {
        const receipt = purchase.transactionReceipt;
        if (!receipt) return;

        const response = await IapAPI.verify({
          userId,
          productId: purchase.productId,
          transactionId: purchase.transactionId,
          receiptData: receipt,
        });

        if (response.ok) {
          await RNIap.finishTransaction({ purchase, isConsumable: false });

          await onVerified?.(); // call handleSuccess from the screen
        } else {
          console.warn("IAP verify failed:", response.message);
        }
      } catch (error: any) {
        console.warn("IAP verify error:", error);
      }
    });

    errorSub.current = RNIap.purchaseErrorListener((e) => {
      console.warn("IAP error", e);
    });

    return () => {
      mounted = false;
      purchaseSub.current?.remove();
      errorSub.current?.remove();
      RNIap.endConnection();
    };
  }, [userId, onVerified]);

  const buy = async (sku: string) => {
    await RNIap.requestPurchase({
      sku,
      andDangerouslyFinishTransactionAutomaticallyIOS: false,
    });
  };

  return { ready, products, buy };
};
