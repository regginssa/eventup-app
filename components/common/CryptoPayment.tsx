import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CryptoPaymentQR, { TCrypto } from "./CryptoPaymentQR";

const ETH = require("@/assets/images/icons/eth.png");
const USDT = require("@/assets/images/icons/usdt.png");
const USDC = require("@/assets/images/icons/usdc.png");
const BNB = require("@/assets/images/icons/bnb.png");
const SOL = require("@/assets/images/icons/sol.png");
const TON = require("@/assets/images/icons/ton.png");

const CryptoPayment = () => {
  const [crypto, setCrypto] = useState<TCrypto>("eth");

  const cryptos = [
    { label: "ETH", icon: ETH, value: "eth" },
    { label: "USDT", icon: USDT, value: "usdt" },
    { label: "USDC", icon: USDC, value: "usdc" },
    { label: "BNB", icon: BNB, value: "bnb" },
    { label: "SOL", icon: SOL, value: "sol" },
    { label: "TON", icon: TON, value: "ton" },
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
              borderColor: crypto === c.value ? "#44F68F" : "white",
            }}
            onPress={() => setCrypto(c.value as TCrypto)}
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

            {crypto === c.value && (
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
              borderColor: crypto === c.value ? "#44F68F" : "white",
            }}
            onPress={() => setCrypto(c.value as TCrypto)}
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

            {crypto === c.value && (
              <MaterialIcons name="check-circle" size={16} color="#44F68F" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View className="w-full flex flex-row items-center gap-5">
        <CryptoPaymentQR
          amount={0.003}
          address=""
          network={crypto}
          size={120}
        />

        <View className="flex-1 flex-col justify-between gap-10">
          <Text className="font-dm-sans-bold text-gray-500">Order details</Text>

          <View className="">
            <View className="w-full flex flex-row items-center justify-between">
              <Text className="font-dm-sans text-gray-500">Total</Text>
              <Text className="font-dm-sans text-gray-500">144 USD</Text>
            </View>

            <View className="w-full flex flex-row items-center justify-between">
              <Text className="font-dm-sans text-gray-500">Amount</Text>
              <Text className="font-dm-sans text-gray-500">0.032 ETH</Text>
            </View>
            <View className="w-full h-[1px] bg-gray-200 mt-2"></View>
          </View>
        </View>
      </View>

      <Text className="font-dm-sans-bold text-gray-600">Scan the QR code</Text>
      <Text className="font-dm-sans-bold text-gray-600">
        Or Please send to address:
      </Text>
      <View className="w-full flex flex-row items-center p-2 rounded-md bg-[#F2F6FC]">
        <Text className="flex-1 text-gray-600 font-dm-sans-medium">
          1KJHD3GdHHS8JHGgfd........GDjkhfk7Y4e3Sc
        </Text>
        <TouchableOpacity activeOpacity={0.8} className="">
          <MaterialIcons name="copy-all" size={20} color="#4b5563" />
        </TouchableOpacity>
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
