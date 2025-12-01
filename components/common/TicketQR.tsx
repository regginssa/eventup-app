import { View } from "react-native";
import QRCode from "react-native-qrcode-svg";

interface TicketQRProps {
  size: number;
}

const TicketQR: React.FC<TicketQRProps> = ({ size }) => {
  return (
    <View className="flex items-center justify-center rounded-md overflow-hidden bg-gray-100 p-1.5">
      <QRCode size={size} />
    </View>
  );
};

export default TicketQR;
