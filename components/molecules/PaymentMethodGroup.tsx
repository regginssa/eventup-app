import { TPaymentMethod } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CardPayment, CryptoPayment } from "../common";

interface PaymentMethodGroupProps {
  method: TPaymentMethod;
  stripePaymentMethodId: string;
  onSelectMethod: (method: TPaymentMethod) => void;
  onSelectStripePaymentMethod: (id: string) => void;
}

const PaymentMethodGroup: React.FC<PaymentMethodGroupProps> = ({
  method,
  stripePaymentMethodId,
  onSelectMethod,
  onSelectStripePaymentMethod,
}) => {
  return (
    <View className="w-full bg-white  rounded-[24px] p-4 gap-6">
      <View>
        <Text className="font-poppins-semibold text-gray-700">
          Payment methods
        </Text>

        <Text className="font-dm-sans text-sm text-gray-400">
          Select your payment method
        </Text>
      </View>

      <View className="w-full flex flex-row items-center justify-between">
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-[82px] h-[82px] rounded-md relative"
          onPress={() => onSelectMethod("credit")}
        >
          <View className="absolute inset-[1px] bg-gray-300 rounded-md z-10"></View>
          {method === "credit" && (
            <LinearGradient
              colors={["#C427E0", "#844AFF", "#12A9FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.paymentMethodGradient}
            />
          )}

          <View className="absolute inset-[2px] bg-[#F2F4F3] z-30 rounded-md flex flex-col items-center justify-center gap-2">
            {method === "credit" ? (
              <MaskedView
                style={{ width: 40, height: 40 }}
                maskElement={
                  <MaterialCommunityIcons
                    name="credit-card-check-outline"
                    size={40}
                    color="#374151"
                  />
                }
              >
                <LinearGradient
                  colors={["#C427E0", "#844AFF", "#12A9FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1 }}
                />
              </MaskedView>
            ) : (
              <MaterialCommunityIcons
                name="credit-card-check-outline"
                size={40}
                color="#374151"
              />
            )}

            <Text className="font-poppins-medium text-lg text-gray-700">
              Card
            </Text>
          </View>

          {method === "credit" && (
            <View className="absolute w-8 h-8 flex items-center justify-center bg-green-500 z-40 -right-3 -top-1 rounded-sm">
              <MaterialCommunityIcons
                name="check-bold"
                size={16}
                color="white"
              />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-[82px] h-[82px] rounded-md relative"
          onPress={() => onSelectMethod("crypto")}
        >
          <View className="absolute inset-[1px] bg-gray-300 rounded-md z-10"></View>
          {method === "crypto" && (
            <LinearGradient
              colors={["#C427E0", "#844AFF", "#12A9FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.paymentMethodGradient}
            />
          )}

          <View className="absolute inset-[2px] bg-[#F2F4F3] z-30 rounded-md flex flex-col items-center justify-center gap-2">
            {method === "crypto" ? (
              <MaskedView
                style={{ width: 40, height: 40 }}
                maskElement={
                  <MaterialCommunityIcons
                    name="bitcoin"
                    size={40}
                    color="#374151"
                  />
                }
              >
                <LinearGradient
                  colors={["#C427E0", "#844AFF", "#12A9FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1 }}
                />
              </MaskedView>
            ) : (
              <MaterialCommunityIcons
                name="bitcoin"
                size={40}
                color="#374151"
              />
            )}

            <Text className="font-poppins-medium text-lg text-gray-700">
              Crypto
            </Text>
          </View>

          {method === "crypto" && (
            <View className="absolute w-8 h-8 flex items-center justify-center bg-green-500 z-40 -right-3 -top-1 rounded-sm">
              <MaterialCommunityIcons
                name="check-bold"
                size={16}
                color="white"
              />
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-[82px] h-[82px] rounded-md relative"
          onPress={() => onSelectMethod("token")}
        >
          <View className="absolute inset-[1px] bg-gray-300 rounded-md z-10"></View>
          {method === "token" && (
            <LinearGradient
              colors={["#C427E0", "#844AFF", "#12A9FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.paymentMethodGradient}
            />
          )}

          <View className="absolute inset-[2px] bg-[#F2F4F3] z-30 rounded-md flex flex-col items-center justify-center gap-2">
            {method === "token" ? (
              <MaskedView
                style={{ width: 40, height: 40 }}
                maskElement={
                  <MaterialCommunityIcons
                    name="unicorn-variant"
                    size={40}
                    color="#374151"
                  />
                }
              >
                <LinearGradient
                  colors={["#C427E0", "#844AFF", "#12A9FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1 }}
                />
              </MaskedView>
            ) : (
              <MaterialCommunityIcons
                name="unicorn-variant"
                size={40}
                color="#374151"
              />
            )}

            <Text className="font-poppins-medium text-lg text-gray-700">
              Token
            </Text>
          </View>

          {method === "token" && (
            <View className="absolute w-8 h-8 flex items-center justify-center bg-green-500 z-40 -right-3 -top-1 rounded-sm">
              <MaterialCommunityIcons
                name="check-bold"
                size={16}
                color="white"
              />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View className="w-full h-[1px] bg-gray-200"></View>

      {method === "credit" ? (
        <CardPayment
          methodId={stripePaymentMethodId}
          onSelectMethod={onSelectStripePaymentMethod}
        />
      ) : method === "crypto" ? (
        <CryptoPayment />
      ) : (
        <></>
      )}
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

export default PaymentMethodGroup;
