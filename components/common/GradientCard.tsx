import { LinearGradient } from "expo-linear-gradient";
import { View } from "react-native";

const GradientCard: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <LinearGradient
      colors={["#844AFF", "#C427E0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 24, padding: 1, marginBottom: 16 }}
    >
      <View className="bg-white/95 rounded-[23px] p-5 overflow-hidden">
        {children}
      </View>
    </LinearGradient>
  );
};

export default GradientCard;
