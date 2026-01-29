import { Text, TextInput, View } from "react-native";

interface InputProps {
  type: "string" | "number";
  label?: string;
  placeholder: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  bordered?: boolean;
  invalid?: boolean;
  invalidTxt?: string;
  value: any;
  onChange: (val: any) => void;
}

const Input: React.FC<InputProps> = ({
  type,
  label,
  placeholder,
  icon,
  className,
  disabled,
  bordered,
  invalid,
  invalidTxt,
  value,
  onChange,
}) => {
  return (
    <View className="w-full gap-2">
      {label && (
        <Text className="font-dm-sans text-sm text-gray-700">{label}</Text>
      )}
      <View
        className={`py-1 px-4 gap-2 bg-white flex flex-row items-center ${className}`}
        style={[{ borderWidth: bordered ? 1 : 0, borderColor: "#d1d5db" }]}
      >
        {icon && icon}
        <TextInput
          placeholder={placeholder}
          keyboardType={type === "number" ? "numeric" : "default"}
          className="flex-1 bg-none text-black font-dm-sans text-sm"
          editable={!disabled}
          value={value}
          onChangeText={onChange}
        />
      </View>

      {invalid && invalidTxt && (
        <Text className="text-red-500 font-dm-sans text-sm">{invalidTxt}</Text>
      )}
    </View>
  );
};

export default Input;
