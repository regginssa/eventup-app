import { Checkbox as ECheckbox } from "expo-checkbox";
import { Text, View } from "react-native";

interface CheckboxProps {
  label: string;
  isChecked: boolean;
  onCheck: (val: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, isChecked, onCheck }) => {
  return (
    <View className="flex flex-row items-center gap-2">
      <ECheckbox
        value={isChecked}
        onValueChange={onCheck}
        color={isChecked ? "#3b82f6" : "#d1d5db"}
        style={{
          width: 16,
          height: 16,
          borderWidth: 1,
        }}
      />

      <Text className="font-dm-sans text-sm text-gray-600">{label}</Text>
    </View>
  );
};

export default Checkbox;
