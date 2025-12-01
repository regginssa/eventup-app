import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomDatePickerProps {
  label?: string;
  placeholder?: string;
  className?: string;
  bordered?: boolean;
  value: Date;
  onPick: (date: Date) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  placeholder,
  className,
  bordered,
  value,
  onPick,
}) => {
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  const openPicker = () => {
    setShowDate(true);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDate(false);

    if (selectedDate) {
      setTempDate(selectedDate); // Save date part
      setShowTime(true); // Open time picker next
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTime(false);

    if (selectedTime && tempDate) {
      const final = new Date(tempDate);
      final.setHours(selectedTime.getHours());
      final.setMinutes(selectedTime.getMinutes());

      onPick(final);
      setTempDate(null);
    }
  };

  return (
    <View className="w-full gap-2">
      {label && (
        <Text className="font-dm-sans text-sm text-gray-700">{label}</Text>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        className={`py-1 px-4 gap-2 bg-white flex flex-row items-center ${className}`}
        style={[{ borderWidth: bordered ? 1 : 0, borderColor: "#d1d5db" }]}
        onPress={openPicker}
      >
        <TextInput
          placeholder={placeholder}
          className="flex-1 bg-none text-black font-dm-sans text-sm"
          editable={false}
          value={value.toLocaleString()}
        />
      </TouchableOpacity>

      {/* DATE PICKER */}
      {showDate && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      {/* TIME PICKER */}
      {showTime && (
        <DateTimePicker
          value={value}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
};

export default CustomDatePicker;
