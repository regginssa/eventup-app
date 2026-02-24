import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { useTheme } from "../providers/ThemeProvider";

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
  maxHeight?: number;
  multiline?: boolean;
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
  maxHeight = 120,
  multiline = false,
}) => {
  const [inputHeight, setInputHeight] = useState(40);
  const { theme } = useTheme();

  useEffect(() => {
    if (!value) {
      setInputHeight(40);
    }
  }, [value]);

  return (
    <View className="w-full gap-2">
      {label && (
        <Text
          className={`font-dm-sans text-sm ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}
        >
          {label}
        </Text>
      )}

      <View
        className={`py-1 px-3 gap-2 ${theme === "light" ? "bg-white" : "bg-[#262C2C]"} flex flex-row items-center ${className}`}
        style={{
          borderWidth: bordered ? 1 : 0,
          borderColor: "#d1d5db",
          minHeight: 40,
        }}
      >
        {icon && icon}

        <TextInput
          placeholder={placeholder}
          multiline={multiline}
          onContentSizeChange={(e) => {
            const h = e.nativeEvent.contentSize.height;
            setInputHeight(Math.min(h, maxHeight));
          }}
          style={{
            flex: 1,
            minHeight: 40,
            maxHeight: maxHeight,
            height: multiline ? inputHeight : 40,
          }}
          placeholderTextColor={theme === "dark" ? "white" : "black"}
          keyboardType={type === "number" ? "numeric" : "default"}
          editable={!disabled}
          value={value}
          onChangeText={onChange}
          className={`bg-none ${theme === "light" ? "text-black" : "text-white"} font-dm-sans text-sm`}
        />
      </View>

      {invalid && invalidTxt && (
        <Text className="text-red-500 font-dm-sans text-sm">{invalidTxt}</Text>
      )}
    </View>
  );
};

export default Input;
