import { IPaymentMethod } from "@/types/stripe";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";

interface StripePaymentMethodGroupProps {
  methods: IPaymentMethod[];
  selectedMethodId: string;
  onSelectMethod: (methodId: string) => void;
}

const cardBrandIcon = {
  visa: "cc-visa",
  mastercard: "cc-mastercard",
  amex: "cc-amex",
  discover: "cc-discover",
  diners: "cc-diners-club",
  jcb: "cc-jcb",
  unionpay: "credit-card",
  unknown: "credit-card",
};

const StripePaymentMethodGroup: React.FC<StripePaymentMethodGroupProps> = ({
  methods,
  onSelectMethod,
  selectedMethodId,
}) => {
  return (
    <View className="w-full gap-2">
      {methods.map((method) => (
        <TouchableOpacity
          key={method.payment_method_id}
          activeOpacity={0.8}
          className="w-full flex flex-row items-center justify-between"
          onPress={() => onSelectMethod(method.payment_method_id)}
        >
          <View className="flex flex-row items-center gap-2">
            <FontAwesome6 name="cc-visa" size={20} color="#4b5563" />
            <Text className="font-poppins-semibold text-gray-600 text-sm">
              {method.brand.toUpperCase()} **** {method.last4}
            </Text>
          </View>

          <View className="w-[18px] h-[18px] bg-gray-300 rounded-full relative z-0">
            <View className="absolute inset-[1px] rounded-full bg-white flex items-center justify-center z-20">
              {selectedMethodId === method.payment_method_id && (
                <MaskedView
                  style={{ width: 16, height: 16 }}
                  maskElement={
                    <Ionicons
                      name="checkmark-circle-sharp"
                      size={16}
                      color="black"
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
              )}
            </View>

            {selectedMethodId === method.payment_method_id && (
              <LinearGradient
                colors={["#C427E0", "#844AFF", "#12A9FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 9,
                  zIndex: 10,
                }}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default StripePaymentMethodGroup;
