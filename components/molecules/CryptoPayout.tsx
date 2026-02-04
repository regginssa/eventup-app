import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Input } from "../common";

interface CryptoPayoutProps {
  method: "chrle" | "babyu";
  walletAddress: string;
  tokenAmounts: { chrle: 0; babyu: 0 };
  onSelectMethod: (val: "chrle" | "babyu") => void;
  onWalletAddressChange: (val: string) => void;
}

const chrleIcon = require("@/assets/images/logo.png");
const babyuIcon = require("@/assets/images/babyu.png");

const CryptoPayout: React.FC<CryptoPayoutProps> = ({
  method,
  walletAddress,
  tokenAmounts,
  onSelectMethod,
  onWalletAddressChange,
}) => {
  const methods = [
    { label: "CHRLE", value: "chrle", img: chrleIcon },
    { label: "BABYU", value: "babyu", img: babyuIcon },
  ];

  return (
    <View className="w-full bg-white rounded-xl p-4 gap-6">
      <View>
        <Text className="font-poppins-semibold text-gray-700">Our Tokens</Text>

        <Text className="font-dm-sans text-sm text-gray-600">
          Choose which token you want to receive from your sale.
        </Text>
      </View>

      <View className="w-full flex flex-row items-center justify-between">
        {methods.map((m) => (
          <TouchableOpacity
            key={m.value}
            activeOpacity={0.8}
            className="flex-1 aspect-square rounded-md relative mx-4"
            onPress={() => onSelectMethod(m.value as any)}
          >
            <View className="absolute inset-[1px] bg-gray-300 rounded-md z-10"></View>
            {method === m.value && (
              <LinearGradient
                colors={["#C427E0", "#844AFF", "#12A9FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.paymentMethodGradient}
              />
            )}

            <View className="absolute inset-[2px] bg-[#F2F4F3] z-30 rounded-md flex flex-col items-center justify-center gap-2">
              <Image
                source={m.img}
                alt={m.label}
                style={{ width: 60, height: 60 }}
                contentFit="cover"
              />

              <Text className="font-poppins-bold text-lg text-gray-800">
                {m.label}
              </Text>
            </View>

            {method === m.value && (
              <View className="absolute w-8 h-8 flex items-center justify-center bg-green-500 z-40 -right-3 -top-1 rounded-sm">
                <MaterialCommunityIcons
                  name="check-bold"
                  size={16}
                  color="white"
                />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View className="w-full flex flex-row items-center gap-4">
        <Image
          source={methods.find((m) => m.value === method)?.img}
          alt={method.toUpperCase()}
          style={{ width: 32, height: 32 }}
          contentFit="cover"
        />

        <View className="flex flex-row items-start gap-1">
          <Text className="font-poppins-semibold text-gray-600 text-xs">
            ${methods.find((m) => m.value === method)?.label}
          </Text>

          <Text className="font-poppins-bold text-gray-800 text-xl">
            {tokenAmounts[method]}
          </Text>
        </View>
      </View>

      <Input
        type="string"
        placeholder="Enter your Solana payout wallet address"
        bordered
        className="rounded-lg"
        icon={
          <MaterialCommunityIcons
            name="wallet-outline"
            size={20}
            color="#9ca3af"
          />
        }
        value={walletAddress}
        onChange={onWalletAddressChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  paymentMethodGradient: {
    position: "absolute",
    inset: 1,
    borderRadius: 6,
    zIndex: 10,
  },

  cryptoIcon: {
    width: 16,
    height: 16,
  },
});

export default CryptoPayout;
