import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FlagType, getAllCountries } from "react-native-country-picker-modal";
import Input from "./Input";

interface CurrencyListProps {
  value: string;
  onSelect: (currency: string) => void;
}

const CurrencyList: React.FC<CurrencyListProps> = ({ value, onSelect }) => {
  const [allCurrencies, setAllCurrencies] = useState<string[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchAllCountries = async () => {
      const countries = await getAllCountries(FlagType.EMOJI);
      const priority = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "SGD", "HKD"];

      const list = Array.from(
        new Set(
          countries.map((country) => country.currency?.[0]).filter(Boolean),
        ),
      );

      list.sort((a, b) => {
        const ai = priority.indexOf(a);
        const bi = priority.indexOf(b);

        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return -1;
        if (bi !== -1) return 1;
        return a.localeCompare(b);
      });
      setAllCurrencies(list);
      setCurrencies(list);
    };

    fetchAllCountries();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setCurrencies(allCurrencies);
      return;
    }

    const searched = allCurrencies.filter((c) =>
      c.toUpperCase().includes(search.toUpperCase()),
    );

    setCurrencies(searched);
  }, [search, allCurrencies]);

  return (
    <>
      {isOpen && (
        <Pressable
          style={{
            position: "absolute",
            top: -1000,
            bottom: -1000,
            left: -1000,
            right: -1000,
            zIndex: 10,
          }}
          onPress={() => setIsOpen(false)}
        />
      )}
      <View className={`w-full gap-2 relative z-20`}>
        <TouchableOpacity
          activeOpacity={0.8}
          className={`px-4 gap-2 bg-white flex flex-row items-center rounded-full`}
          style={[
            {
              borderWidth: 1,
              borderColor: "#d1d5db",
              minHeight: 40,
            },
          ]}
          onPress={() => setIsOpen((p) => !p)}
        >
          <TextInput
            className="flex-1 bg-none text-black font-dm-sans text-sm"
            editable={false}
            value={value}
          />
          <Feather
            name={`chevron-${isOpen ? "up" : "down"}`}
            size={16}
            color="#4b5563"
          />
        </TouchableOpacity>

        {isOpen && (
          <View
            className="absolute left-0 right-0 bg-white z-20 rounded-3xl top-full mt-1"
            style={[
              {
                borderWidth: 1,
                borderColor: "#d1d5db",
              },
            ]}
          >
            <View className="w-full p-4">
              <Input
                type="string"
                placeholder="Search"
                icon={<Feather name="search" size={16} color="#4b5563" />}
                className="rounded-md"
                bordered={true}
                value={search}
                onChange={setSearch}
              />
            </View>

            <ScrollView
              nestedScrollEnabled
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
              style={{ borderRadius: 24, maxHeight: 200 }}
            >
              {currencies.map((cu, index) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={index}
                  className="w-full flex flex-row items-center gap-2 py-4 px-6"
                  onPress={() => {
                    onSelect(cu);
                    setIsOpen(false);
                  }}
                >
                  <Text className="font-poppins-semibold text-sm text-gray-800">
                    {cu}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </>
  );
};

export default CurrencyList;
