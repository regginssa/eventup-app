import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Country,
  FlagButton,
  FlagType,
  getAllCountries,
} from "react-native-country-picker-modal";
import Input from "./Input";
import Modal from "./Modal";

interface NationalityPickerProps {
  label?: string;
  placeholder?: string;
  value: string;
  icon?: React.ReactNode;
  className?: string;
  bordered?: boolean;
  onChange: (val: string) => void;
}

const NationalityPicker: React.FC<NationalityPickerProps> = ({
  label,
  placeholder,
  icon,
  className,
  bordered,
  value,
  onChange,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchAllCountries = async () => {
      setLoading(true);
      const countries = await getAllCountries(FlagType.EMOJI);
      setCountries(countries);
      setLoading(false);
    };

    if (isOpen) {
      fetchAllCountries();
    }
  }, [isOpen]);

  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countries;

    return countries.filter((c) => {
      const name = c?.name?.toString?.() ?? "";
      const cca2 = c?.cca2 ?? "";
      const calling = c?.callingCode != null ? String(c.callingCode) : "";

      const haystack = [name.toLowerCase(), cca2.toLowerCase(), calling];

      return haystack.some((s) => s.includes(q));
    });
  }, [search, countries]);

  return (
    <View className="w-full gap-2">
      {label && (
        <Text className="font-dm-sans text-sm text-gray-700">{label}</Text>
      )}
      <TouchableOpacity
        activeOpacity={0.8}
        className={`py-1 px-4 gap-2 bg-white flex flex-row items-center ${className}`}
        style={[{ borderWidth: bordered ? 1 : 0, borderColor: "#d1d5db" }]}
        onPress={() => {
          setIsOpen(!isOpen);
          setSearch("");
        }}
      >
        {icon && icon}
        <TextInput
          placeholder={placeholder}
          className="flex-1 bg-none text-black font-dm-sans text-sm"
          editable={false}
          value={value}
        />
      </TouchableOpacity>

      <Modal
        title="Select Nationality"
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
              data={filteredCountries}
              keyExtractor={(c) => c.cca2 || c.name.toString()}
              renderItem={({ item: c }) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="p-1 flex flex-row items-center gap-2 w-full"
                  onPress={() => {
                    onChange(c.cca2);
                    setIsOpen(false);
                  }}
                >
                  <FlagButton
                    countryCode={c.cca2}
                    placeholder=""
                    containerButtonStyle={{ marginBottom: 4 }}
                  />
                  <Text className="font-dm-sans text-sm text-gray-700">
                    {c.name.toString()}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-gray-100" />
              )}
              style={{ flex: 1 }}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default NationalityPicker;
