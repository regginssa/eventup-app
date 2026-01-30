import { ActivityIndicator, Text, View } from "react-native";

interface SpinnerProps {
  text?: string;
  size: "sm" | "md" | "lg";
}

const Spinner: React.FC<SpinnerProps> = ({ text, size }) => {
  return (
    <View className="flex-1 items-center justify-center gap-2">
      <ActivityIndicator
        size={size === "sm" ? 24 : size === "md" ? 48 : 72}
        color="#C427E0"
      />
      <Text className="text-[#C427E0] font-poppins-semibold">
        {text ?? "Loading..."}
      </Text>
    </View>
  );
};

export default Spinner;
