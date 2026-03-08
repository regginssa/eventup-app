import { Text, TextInput, View } from "react-native";
import CountryPicker from "react-native-country-picker-modal";

interface PhoneInputProps {
  label?: string;
  placeholder?: string;
  countryCode?: string;
  icon?: React.ReactNode;
  bordered?: boolean;
  value: string;
  invalid?: boolean;
  invalidTxt?: string;
  onChange: (val: string) => void;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  placeholder,
  countryCode,
  icon,
  bordered,
  invalid,
  invalidTxt,
  value,
  onChange,
}) => {
  return (
    <View className="w-full gap-2">
      {label && (
        <Text className={`font-dm-sans text-sm text-gray-700`}>{label}</Text>
      )}

      <View
        className={`py-1 px-3 gap-2 bg-white flex flex-row items-center rounded-full`}
        style={{
          borderWidth: bordered ? 1 : 0,
          borderColor: "#d1d5db",
          minHeight: 40,
        }}
      >
        {icon && icon}

        <CountryPicker
          countryCode={(countryCode as any) || "US"}
          withFilter
          withFlag
          withCallingCode
          withEmoji
        />

        <TextInput
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          className={`bg-none text-black font-dm-sans text-sm flex-1`}
        />
      </View>

      {invalid && invalidTxt && (
        <Text className="text-red-500 font-dm-sans text-sm">{invalidTxt}</Text>
      )}
    </View>
  );
};

export default PhoneInput;
