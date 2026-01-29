import { RegionType } from "@/src/types/location.types";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import countryRegionData from "country-region-data";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Input from "./Input";
import Modal from "./Modal";

interface RegionPickerProps {
  label?: string;
  placeholder?: string;
  invalid?: boolean;
  invalidText?: string;
  countryCode?: string;
  value: RegionType | null;
  onPick: (region: RegionType) => void;
}

const RegionPicker: React.FC<RegionPickerProps> = ({
  label,
  placeholder,
  invalid,
  invalidText,
  countryCode,
  value,
  onPick,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [regions, setRegions] = useState<RegionType[]>([]);

  const handleSelect = (region: RegionType) => {
    onPick(region);
    setIsOpen(false);
    setSearch("");
  };

  // Fetch regions when country changes
  useEffect(() => {
    if (countryCode) {
      const countryData: any = countryRegionData.find(
        (country: any) => country.countryShortCode === countryCode
      );

      if (countryData && countryData.regions) {
        const formattedRegions = countryData.regions.map((region: any) => ({
          code: region.shortCode || region.name.replace(/\s+/g, ""),
          name: region.name,
        }));

        setRegions(formattedRegions);
      } else {
        setRegions([]);
      }
    } else {
      setRegions([]);
    }
  }, [countryCode]);

  // ✅ Filter dynamically without mutating the original data
  const filteredRegions = useMemo(() => {
    if (!search) return regions;
    return regions.filter((r) =>
      r.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, regions]);

  return (
    <View className="w-full gap-2">
      <Text className="font-dm-sans text-sm text-gray-700">{label}</Text>

      <TouchableOpacity
        activeOpacity={0.8}
        className="py-1 px-4 gap-2 bg-white rounded-md flex flex-row items-center"
        onPress={() => setIsOpen(true)}
      >
        <MaterialCommunityIcons
          name="map-marker-outline"
          size={16}
          color="#4b5563"
        />

        <TextInput
          placeholder={placeholder}
          className="flex-1 bg-none text-black font-dm-sans text-sm"
          editable={false}
          value={value ? value.name.toString() : ""}
        />
        <Entypo name="chevron-small-down" size={16} color="#4b5563" />
      </TouchableOpacity>

      {invalid && invalidText && (
        <Text className="text-red-500 text-[12px] leading-4">
          {invalidText}
        </Text>
      )}

      <Modal
        title="Select Region"
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
            value={search}
            onChange={setSearch}
          />

          <FlatList
            data={filteredRegions}
            keyExtractor={(r) => r.code || r.name.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                className="p-2 flex flex-row items-center gap-2 w-full"
                onPress={() => handleSelect(item)}
              >
                <Text className="font-dm-sans text-sm text-gray-700">
                  {item.name.toString()}
                </Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View className="h-px bg-gray-100" />}
          />
        </View>
      </Modal>
    </View>
  );
};

export default RegionPicker;
