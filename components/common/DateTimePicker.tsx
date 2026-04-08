import { formatDateTime, formatTime } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface CustomDatePickerProps {
  mode?: "date" | "datetime";
  label?: string;
  placeholder?: string;
  className?: string;
  bordered?: boolean;
  value: Date | null;
  onPick: (date: Date) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  mode,
  label,
  placeholder,
  className,
  bordered,
  value,
  onPick,
}) => {
  const [showDate, setShowDate] = useState(false);

  const openPicker = () => {
    setShowDate(true);
  };

  return (
    <View className="w-full gap-2">
      {label && (
        <Text className="font-dm-sans text-sm text-gray-700">{label}</Text>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        className={`px-4 gap-2 bg-white flex flex-row items-center rounded-full`}
        style={[
          {
            borderWidth: bordered ? 1 : 0,
            borderColor: "#d1d5db",
            minHeight: 40,
          },
        ]}
        onPress={openPicker}
      >
        <MaterialCommunityIcons
          name="calendar-outline"
          color="#4b5563"
          size={16}
        />
        <TextInput
          placeholder={placeholder}
          className="flex-1 bg-none text-black font-dm-sans text-sm"
          editable={false}
          value={
            value
              ? `${
                  mode === "datetime"
                    ? `${formatTime(value)} / ${formatDateTime(value.toISOString())}`
                    : formatDateTime(value.toISOString())
                }`
              : ""
          }
        />
      </TouchableOpacity>

      {/* DATE PICKER */}
      <DateTimePickerModal
        isVisible={showDate}
        mode={mode || "date"}
        display="inline"
        onConfirm={(date) => {
          onPick(date);
          setShowDate(false);
        }}
        onCancel={() => setShowDate(false)}
      />
    </View>
  );
};

export default CustomDatePicker;
