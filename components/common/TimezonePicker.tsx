import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
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

// Format timezone name for display
const formatTimezoneLabel = (timezone: string): string => {
  try {
    // Extract city name from timezone (e.g., "America/New_York" -> "New York")
    const cityName = timezone.split("/").pop()?.replace(/_/g, " ") || timezone;

    // Try to get timezone abbreviation
    let timeZoneAbbr = "";
    try {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        timeZoneName: "short",
      });
      const parts = formatter.formatToParts(now);
      timeZoneAbbr =
        parts.find((part) => part.type === "timeZoneName")?.value || "";
    } catch {
      // Fallback: try to get offset
      const offset = getTimezoneOffset(timezone);
      const sign = offset >= 0 ? "+" : "";
      timeZoneAbbr = `UTC${sign}${offset}`;
    }

    return timeZoneAbbr ? `${cityName} (${timeZoneAbbr})` : cityName;
  } catch {
    return timezone;
  }
};

// Get timezone offset for sorting
const getTimezoneOffset = (timezone: string): number => {
  try {
    const now = new Date();
    const utc = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
    const tz = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    return (tz.getTime() - utc.getTime()) / (1000 * 60 * 60); // hours
  } catch {
    return 0;
  }
};

interface TimezonePickerProps {
  label?: string;
  placeholder?: string;
  bordered?: boolean;
  className?: string;
  disabled?: boolean;
  value: string | null;
  onSelect: (timezone: string) => void;
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
  onSelect,
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
      console.log(Intl.supportedValuesOf("timeZone"));
      setLoading(false);
    }
  }, [isOpen]);

  return (
    <View className="w-full gap-2 relative">
      {label && (
        <Text className="font-dm-sans text-sm text-gray-700">{label}</Text>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        className={`py-1 px-4 gap-2 bg-white flex flex-row items-center ${className}`}
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
                <TouchableOpacity className="p-2 flex flex-row items-center gap-2">
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
