import { EVENT_CATEGORIES } from "@/constants/events";
import { TDropdownItem } from "@/types";
import { Country, RegionType } from "@/types/location.types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
  startDate: Date | null;
  country: Country | null;
  region: RegionType | null;
  category: TDropdownItem | null;
  onStartDatePick: (val: Date | null) => void;
  onCountryPick: (val: Country | null) => void;
  onRegionPick: (val: RegionType | null) => void;
  onCategoryChange: (val: TDropdownItem | null) => void;
  onApply: () => Promise<void>;
  onReset: () => Promise<void>;
}

const EventFilterModal: React.FC<EventFilterModalProps> = ({
  isOpen,
  onClose,
  startDate,
  country,
  region,
  category,
  onStartDatePick,
  onCountryPick,
  onRegionPick,
  onCategoryChange,
  onApply,
  onReset,
}) => {
  return (
    <Modal title="Filter Events" isOpen={isOpen} onClose={onClose} scrolled>
      <View className="w-full flex flex-col gap-4">
        <DateTimePicker
          mode="date"
          placeholder="Select start date"
          className="rounded-lg"
          bordered
          value={startDate}
          onPick={onStartDatePick}
        />
        <CountryPicker
          placeholder="Select country"
          bordered
          className="rounded-lg"
          value={country}
          onPick={onCountryPick}
        />
        <RegionPicker
          placeholder="Select your country first"
          countryCode={country?.cca2}
          bordered
          className="rounded-lg"
          value={region}
          onPick={onRegionPick}
        />
        <Dropdown
          placeholder="Select category"
          icon={
            <MaterialCommunityIcons name="apps" size={16} color="#4b5563" />
          }
          items={EVENT_CATEGORIES}
          direction="up"
          bordered
          className="rounded-md"
          selectedItem={category}
          onSelect={onCategoryChange}
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
          onPress={onReset}
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
          onPress={onApply}
        />
      </View>
    </Modal>
  );
};

export default EventFilterModal;
