import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ETH = require("@/assets/images/icons/eth.png");
const USDT = require("@/assets/images/icons/usdt.png");
const USDC = require("@/assets/images/icons/usdc.png");
const BNB = require("@/assets/images/icons/bnb.png");
const SOL = require("@/assets/images/icons/sol.png");
const TON = require("@/assets/images/icons/ton.png");

interface CryptoPaymentProps {
  selectedCryptoCurrency?: string;
  onSelectCryptoCurrency?: (currency: string) => void;
}

const CryptoPayment: React.FC<CryptoPaymentProps> = ({
  selectedCryptoCurrency,
  onSelectCryptoCurrency,
}) => {
  const cryptos = [
    { label: "ETH", icon: ETH, value: "eth" },
    { label: "USDT", icon: USDT, value: "usdt-eth" },
    { label: "USDC", icon: USDC, value: "usdc-eth" },
    { label: "SOL", icon: SOL, value: "sol" },
    { label: "USDT", icon: USDT, value: "usdt-sol" },
    { label: "USDC", icon: USDC, value: "usdc-sol" },
  ];

  return (
    <View className="w-full gap-4">
      <Text className="text-gray-500 font-dm-sans text-sm">Select coin</Text>

      <View className="w-full flex flex-row gap-4">
        {cryptos.slice(0, 3).map((c, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            className="p-2 bg-[#F2F6FC] flex-1 rounded-md flex flex-row items-center justify-between"
            style={{
              borderWidth: 1,
              borderColor:
                selectedCryptoCurrency === c.value ? "#44F68F" : "white",
            }}
            onPress={
              onSelectCryptoCurrency
                ? () => onSelectCryptoCurrency(c.value as string)
                : undefined
            }
          >
            <View className="flex flex-row items-center gap-2">
              <Image
                source={c.icon}
                alt={c.label}
                style={styles.cryptoIcon}
                contentFit="cover"
              />
              <Text className="font-dm-sans text-gray-700 text-sm">
                {c.label}
              </Text>
            </View>

            {selectedCryptoCurrency === c.value && (
              <MaterialIcons name="check-circle" size={16} color="#44F68F" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View className="w-full flex flex-row gap-4">
        {cryptos.slice(3, 6).map((c, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            className="p-2 bg-[#F2F6FC] flex-1 rounded-md flex flex-row items-center justify-between"
            style={{
              borderWidth: 1,
              borderColor:
                selectedCryptoCurrency === c.value ? "#44F68F" : "white",
            }}
            onPress={
              onSelectCryptoCurrency
                ? () => onSelectCryptoCurrency(c.value as string)
                : undefined
            }
          >
            <View className="flex flex-row items-center gap-2">
              <Image
                source={c.icon}
                alt={c.label}
                style={styles.cryptoIcon}
                contentFit="cover"
              />
              <Text className="font-dm-sans text-gray-700 text-sm">
                {c.label}
              </Text>
            </View>

            {selectedCryptoCurrency === c.value && (
              <MaterialIcons name="check-circle" size={16} color="#44F68F" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cryptoIcon: {
    width: 16,
    height: 16,
  },
});

export default CryptoPayment;
