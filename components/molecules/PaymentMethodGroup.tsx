import { TPaymentMethod } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { CardPayment, CryptoPayment, TokenPayment } from "../common";

interface PaymentMethodGroupProps {
  method: TPaymentMethod;
  stripePaymentMethodId: string;
  selectedCryptoCurrency?: string;
  onSelectCryptoCurrency?: (currency: string) => void;
  onSelectMethod: (method: TPaymentMethod) => void;
  onSelectStripePaymentMethod: (id: string) => void;
}

const PaymentMethodGroup: React.FC<PaymentMethodGroupProps> = ({
  method,
  stripePaymentMethodId,
  selectedCryptoCurrency,
  onSelectCryptoCurrency,
  onSelectMethod,
  onSelectStripePaymentMethod,
}) => {
  return (
    <View
      style={styles.container}
      className="bg-slate-50 rounded-[24px] border border-slate-200"
    >
      <View style={styles.inner}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text className="font-poppins-bold text-lg text-slate-800">
            Payment Method
          </Text>

          <Text className="font-dm-sans text-xs text-slate-400">
            Choose how you want to pay
          </Text>
        </View>

        {/* PAYMENT METHODS */}
        <View style={styles.methodsRow}>
          <PaymentMethodCard
            icon="credit-card-outline"
            label="Card"
            selected={method === "credit"}
            onPress={() => onSelectMethod("credit")}
          />

          <PaymentMethodCard
            icon="bitcoin"
            label="Crypto"
            selected={method === "crypto"}
            onPress={() => onSelectMethod("crypto")}
          />

          <PaymentMethodCard
            icon="unicorn-variant"
            label="Token"
            selected={method === "token"}
            onPress={() => onSelectMethod("token")}
          />
        </View>

        <View style={styles.divider} />

        {/* PAYMENT CONTENT */}
        {method === "credit" ? (
          <CardPayment
            methodId={stripePaymentMethodId}
            onSelectMethod={onSelectStripePaymentMethod}
          />
        ) : method === "crypto" ? (
          <CryptoPayment
            selectedCryptoCurrency={selectedCryptoCurrency}
            onSelectCryptoCurrency={onSelectCryptoCurrency}
          />
        ) : (
          <TokenPayment
            token={selectedCryptoCurrency}
            onSelect={onSelectCryptoCurrency}
          />
        )}
      </View>
    </View>
  );
};

export default PaymentMethodGroup;

interface CardProps {
  icon: any;
  label: string;
  selected: boolean;
  onPress: () => void;
}

const PaymentMethodCard: React.FC<CardProps> = ({
  icon,
  label,
  selected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.methodCard}
      onPress={onPress}
    >
      {selected && (
        <LinearGradient
          colors={["#C427E0", "#844AFF", "#12A9FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.selectedGradient}
        />
      )}

      <View
        style={[styles.methodInner, selected && { borderColor: "transparent" }]}
      >
        <MaterialCommunityIcons
          name={icon}
          size={30}
          color={selected ? "#844AFF" : "#64748b"}
        />

        <Text
          style={{
            marginTop: 6,
            fontSize: 12,
            fontWeight: "600",
            color: selected ? "#1e293b" : "#64748b",
          }}
        >
          {label}
        </Text>
      </View>

      {selected && (
        <View style={styles.check}>
          <MaterialCommunityIcons name="check-bold" size={14} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    shadowColor: "#c084fc",
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },

  gradientBorder: {
    borderRadius: 24,
    padding: 1,
  },

  inner: {
    borderRadius: 23,
    padding: 20,
  },

  header: {
    marginBottom: 20,
  },

  methodsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  methodCard: {
    width: 90,
    height: 90,
    borderRadius: 18,
    position: "relative",
  },

  methodInner: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },

  selectedGradient: {
    position: "absolute",
    inset: -1,
    borderRadius: 18,
    padding: 1,
  },

  check: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 8,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 20,
  },
});
