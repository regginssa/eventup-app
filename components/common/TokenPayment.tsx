import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const CHRLE = require("@/assets/images/icons/chrle.png");
const BABYU = require("@/assets/images/icons/babyu.png");

interface TokenPaymentProps {
  token?: string;
  onSelect?: (token: string) => void;
}

const TokenPayment: React.FC<TokenPaymentProps> = ({ token, onSelect }) => {
  const cryptos = [
    { label: "CHRLE", icon: CHRLE, value: "chrle" },
    { label: "BABYU", icon: BABYU, value: "babyu" },
  ];

  return (
    <View className="w-full gap-4">
      <Text className="text-gray-500 font-dm-sans text-sm">Select token</Text>

      <View className="w-full flex flex-row gap-4">
        {cryptos.map((c, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            className="p-2 bg-[#F2F6FC] flex-1 rounded-md flex flex-row items-center justify-between"
            style={{
              borderWidth: 1,
              borderColor: token === c.value ? "#44F68F" : "white",
            }}
            onPress={onSelect ? () => onSelect(c.value as string) : undefined}
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

            {token === c.value && (
              <MaterialCommunityIcons
                name="check-circle"
                size={16}
                color="#44F68F"
              />
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

export default TokenPayment;
