import { TDropdownItem } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Modal } from "../common";

interface FilterItemDropdownProps {
  items: TDropdownItem[];
  selectedItems: TDropdownItem[];
  label: string | number;
  onSelect: (val: TDropdownItem) => void;
}

const FilterItemDropdown: React.FC<FilterItemDropdownProps> = ({
  items,
  selectedItems,
  label,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <View className="relative">
      <TouchableOpacity
        activeOpacity={0.8}
        className="p-3 rounded-xl"
        style={styles.container}
        onPress={() => setIsOpen(true)}
      >
        <Text className="font-poppins text-sm text-gray-700">{label}</Text>0
      </TouchableOpacity>

      <Modal
        title={label.toString()}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        scrolled={true}
      >
        {items.map((item, index) => {
          const isSelected = selectedItems.some(
            (si) => si.value === item.value
          );
          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              className={`w-full flex flex-row items-center justify-between p-2 ${
                isSelected ? "bg-[#f3f4f6]" : "bg-white"
              }`}
              onPress={() => {
                onSelect(item);
              }}
            >
              <Text className="text-gray-700">{item.label}</Text>
              {isSelected ? (
                <AntDesign name="check" size={14} color="#4b5563" />
              ) : null}
            </TouchableOpacity>
          );
        })}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#374151",
  },
  dropdownContainer: {
    elevation: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    maxHeight: 240,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    overflow: "hidden",
  },
});

export default FilterItemDropdown;
