import { Ionicons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity, View } from "react-native";

interface RadioButtonProps {
  checked: boolean;
  onPress: () => void;
  size?: number; // optional, default 20
}

const RadioButton: React.FC<RadioButtonProps> = ({
  checked,
  onPress,
  size = 20,
}) => {
  const innerSize = size - 4;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <View
        className="rounded-full bg-gray-300"
        style={{ width: size, height: size }}
      />

      {checked && (
        <LinearGradient
          colors={["#C427E0", "#844AFF", "#12A9FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: size / 2,
          }}
        />
      )}

      <View
        className="absolute rounded-full bg-white flex items-center justify-center"
        style={{ inset: 2, borderRadius: innerSize / 2 }}
      >
        {checked && (
          <MaskedView
            style={{ width: innerSize, height: innerSize }}
            maskElement={
              <Ionicons
                name="checkmark-circle-sharp"
                size={innerSize}
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
    </TouchableOpacity>
  );
};

export default RadioButton;
