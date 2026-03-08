import { useState } from "react";
import { Text, TextInput, View } from "react-native";

interface TextareaProps {
  label?: string;
  placeholder?: string;
  invalid?: boolean;
  invalidText?: string;
  bordered?: boolean;
  className?: string;
  value: string;
  onChange: (val: string) => void;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  invalid,
  invalidText,
  bordered,
  className,
  value,
  onChange,
}) => {
  const [focused, setFocused] = useState<boolean>(false);
  const [translatedPlaceholder, setTranslatedPlaceholder] =
    useState<string>("");

  //   useEffect(() => {
  //     const translate = async () => {
  //       if (!placeholder) return "";
  //       const translatedText = await translateText(placeholder);
  //       setTranslatedPlaceholder(translatedText);
  //     };

  //     translate();
  //   }, [placeholder]);

  return (
    <View className="w-full flex flex-col items-start gap-2">
      {label && (
        <Text className="font-dm-sans text-sm text-gray-700">{label}</Text>
      )}
      <View
        className={`py-1 px-4 gap-2 bg-white rounded-3xl flex flex-row items-center`}
        style={{ borderWidth: bordered ? 1 : 0, borderColor: "#d1d5db" }}
      >
        <TextInput
          placeholder={placeholder}
          className="flex-1 h-[120px] text-black font-dm-sans text-sm"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={value}
          onChangeText={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </View>
      {invalid && invalidText && (
        <Text className="text-red-500 text-[12px] leading-4">
          {invalidText}
        </Text>
      )}
    </View>
  );
};

export default Textarea;
