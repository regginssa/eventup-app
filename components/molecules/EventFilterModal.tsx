import { EVENT_CATEGORIES } from "@/constants/events";
import { TDropdownItem } from "@/types";
import { Country, RegionType } from "@/types/location.types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { View } from "react-native";
import {
  Button,
  CountryPicker,
  DateTimePicker,
  Dropdown,
  Modal,
  RegionPicker,
} from "../common";

interface EventFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (
    date: Date,
    country: Country | null,
    region: RegionType | null,
    category: string | null,
  ) => Promise<void>;
  onReset: () => Promise<void>;
}

const EventFilterModal: React.FC<EventFilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  onReset,
}) => {
  const [date, setDate] = useState<Date>(new Date());
  const [country, setCountry] = useState<Country | null>(null);
  const [region, setRegion] = useState<RegionType | null>(null);
  const [category, setCategory] = useState<TDropdownItem | null>(null);

  const handleApply = async () => {
    await onApply(
      date,
      country,
      region,
      category ? category.value.toString() : null,
    );
  };

  const handleReset = async () => {
    await onReset();
    setDate(new Date());
    setCountry(null);
    setRegion(null);
    setCategory(null);
  };

  return (
    <Modal title="Filter Events" isOpen={isOpen} onClose={onClose} scrolled>
      <View className="w-full flex flex-col gap-4">
        <DateTimePicker
          mode="date"
          className="rounded-lg"
          bordered
          value={date}
          onPick={setDate}
        />
        <CountryPicker
          placeholder="Select country"
          bordered
          className="rounded-lg"
          value={country}
          onPick={setCountry}
        />
        <RegionPicker
          placeholder="Select your country first"
          countryCode={country?.cca2}
          bordered
          className="rounded-lg"
          value={region}
          onPick={setRegion}
        />
        <Dropdown
          placeholder="Select category"
          icon={
            <MaterialCommunityIcons name="apps" size={16} color="#4b5563" />
          }
          items={EVENT_CATEGORIES}
          bordered
          className="rounded-md"
          selectedItem={category}
          onSelect={setCategory}
        />
      </View>

      <View className="w-full flex flex-row items-center justify-between mt-6">
        <Button
          type="white"
          label="Reset"
          icon={
            <MaterialCommunityIcons name="restore" size={16} color="#6b7280" />
          }
          iconPosition="left"
          buttonClassName="h-10 border border-gray-300 rounded-lg px-4"
          onPress={handleReset}
        />

        <Button
          type="primary"
          label="Apply"
          icon={
            <MaterialCommunityIcons
              name="checkbox-marked-circle-outline"
              size={16}
              color="white"
            />
          }
          iconPosition="right"
          buttonClassName="h-10 w-36"
          onPress={handleApply}
        />
      </View>
    </Modal>
  );
};

export default EventFilterModal;
