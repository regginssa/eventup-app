import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "./Input";
import Modal from "./Modal";

interface TimezonePickerProps {
  label?: string;
  placeholder?: string;
  bordered?: boolean;
  className?: string;
  disabled?: boolean;
  value: string | null;
  onPick: (timezone: string) => void;
  invalid?: boolean;
  invalidTxt?: string;
}

const TimezonePicker: React.FC<TimezonePickerProps> = ({
  label,
  placeholder = "Select timezone",
  bordered,
  className,
  disabled,
  value,
  onPick,
  invalid,
  invalidTxt,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [timezones, setTimezones] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const tz = moment.tz.names();
      const filteredTimezones = tz.filter((timezone) =>
        timezone.toLowerCase().includes(search.toLowerCase()),
      );
      setTimezones(filteredTimezones);
      setLoading(false);
    }
  }, [isOpen, search]);

  return (
    <View className="w-full gap-2 relative">
      {label && (
        <Text className="font-dm-sans text-sm text-gray-700">{label}</Text>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        className={`py-1 px-4 gap-2 bg-white flex flex-row items-center rounded-full`}
        style={[{ borderWidth: bordered ? 1 : 0, borderColor: "#d1d5db" }]}
        onPress={!disabled ? () => setIsOpen((p) => !p) : undefined}
        disabled={disabled}
      >
        <TextInput
          placeholder={placeholder}
          className="flex-1 bg-none text-black font-dm-sans text-sm"
          editable={false}
          value={value ?? ""}
        />
        <Feather
          name={`chevron-${isOpen ? "up" : "down"}`}
          size={16}
          color="#4b5563"
        />
      </TouchableOpacity>

      {invalid && invalidTxt && (
        <Text className="text-red-500 font-dm-sans text-sm">{invalidTxt}</Text>
      )}

      <Modal
        title="Select Timezone"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <View className="flex-1 gap-4">
          <Input
            type="string"
            placeholder="Search"
            icon={<Feather name="search" size={16} color="#4b5563" />}
            className="rounded-md"
            bordered={true}
            disabled={loading}
            value={search}
            onChange={setSearch}
          />
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color="#4b5563" size={24} />
            </View>
          ) : (
            <FlatList
              data={timezones}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="p-2 flex flex-row items-center gap-2"
                  onPress={() => {
                    onPick(item);
                    setIsOpen(false);
                    setSearch("");
                  }}
                >
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color="#62748E"
                  />
                  <Text
                    numberOfLines={1}
                    className="text-[14px] text-slate-700 flex-1"
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    elevation: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    overflow: "hidden",
  },
});

export default TimezonePicker;
