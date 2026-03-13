import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface PasswordInputProps {
  placeholder: string;
  disabled?: boolean;
  invalid?: boolean;
  invalidTxt?: string;
  bordered?: boolean;
  value: any;
  isConfirm?: boolean;
  onChange: (val: any) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  placeholder,
  disabled,
  invalid,
  bordered,
  invalidTxt,
  isConfirm,
  value,
  onChange,
}) => {
  const [isSecured, setIsSecured] = useState<boolean>(true);

  return (
    <View className="w-full gap-2">
      <View
        className="px-3 gap-2 bg-white rounded-full flex flex-row items-center"
        style={{
          minHeight: 40,
          borderWidth: bordered ? 1 : 0,
          borderColor: "#d1d5db",
        }}
      >
        {isConfirm ? (
          <Feather name="check-circle" size={16} color="#4b5563" />
        ) : (
          <Feather name="lock" size={16} color="#4b5563" />
        )}
        <TextInput
          placeholder={placeholder}
          className="flex-1 bg-none text-black font-dm-sans text-sm"
          editable={disabled}
          secureTextEntry={isSecured}
          value={value}
          onChangeText={onChange}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsSecured(!isSecured)}
        >
          <Feather
            name={!isSecured ? "eye-off" : "eye"}
            size={16}
            color="#4b5563"
          />
        </TouchableOpacity>
      </View>

      {invalid && invalidTxt && (
        <Text className="text-red-500 font-dm-sans text-sm">{invalidTxt}</Text>
      )}
    </View>
  );
};

export default PasswordInput;
