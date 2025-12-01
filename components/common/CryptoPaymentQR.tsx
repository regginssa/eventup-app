import { buildPaymentURI } from "@/utils/paymentUri";
import { useMemo } from "react";
import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

export type TCrypto = "eth" | "usdt" | "usdc" | "bnb" | "sol" | "ton";

interface CryptoPaymentQRProps {
  network: TCrypto;
  amount: number;
  address: string;
  size: number;
}

const logos: Record<TCrypto, any> = {
  eth: require("@/assets/images/icons/eth.png"),
  usdt: require("@/assets/images/icons/usdt.png"),
  usdc: require("@/assets/images/icons/usdc.png"),
  bnb: require("@/assets/images/icons/bnb.png"),
  sol: require("@/assets/images/icons/sol.png"),
  ton: require("@/assets/images/icons/ton.png"),
};

const CryptoPaymentQR: React.FC<CryptoPaymentQRProps> = ({
  network,
  amount,
  address,
  size,
}) => {
  const uri = useMemo(
    () => buildPaymentURI(network, address, amount),
    [network, address, amount]
  );

  return (
    <View className="flex items-center justify-center rounded-md overflow-hidden">
      <QRCode
        value={uri}
        size={size}
        logo={logos[network]}
        logoSize={size * 0.22}
        logoBackgroundColor="transparent"
      />
    </View>
  );
};

export default CryptoPaymentQR;
