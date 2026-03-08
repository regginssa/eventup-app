import { TDropdownItem } from "@/types";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DropdownProps {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  bordered?: boolean;
  width?: string;
  className?: string;
  disabled?: boolean;
  items: TDropdownItem[];
  selectedItem: TDropdownItem | null;
  onSelect: (val: TDropdownItem) => void;
  direction?: "up" | "down";
  invalid?: boolean;
  invalidTxt?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholder,
  icon,
  bordered,
  items,
  selectedItem,
  width,
  className,
  disabled,
  onSelect,
  direction = "down",
  invalid,
  invalidTxt,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <View className={`${width ? width : "w-full"} gap-2 relative`}>
      {label && (
        <Text className="font-dm-sans text-sm text-gray-700">{label}</Text>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        className={`py-1 px-4 gap-2 bg-white flex flex-row items-center rounded-full ${className}`}
        style={[{ borderWidth: bordered ? 1 : 0, borderColor: "#d1d5db" }]}
        onPress={!disabled ? () => setIsOpen((p) => !p) : undefined}
        disabled={disabled}
      >
        {icon && icon}
        <TextInput
          placeholder={placeholder}
          className="flex-1 bg-none text-black font-dm-sans text-sm"
          editable={false}
          value={selectedItem?.label ?? ""}
        />
        <Feather
          name={`chevron-${isOpen ? "up" : "down"}`}
          size={16}
          color="#4b5563"
        />
      </TouchableOpacity>

      {isOpen && (
        <>
          <Pressable
            onPress={() => setIsOpen(false)}
            className="absolute inset-0 z-10"
          />

          <View
            className={`absolute left-0 right-0 bg-white z-20 rounded-3xl ${
              direction === "up" ? "bottom-full mb-1" : "top-full mt-1"
            }`}
            style={styles.dropdownContainer}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={{ borderRadius: 24 }}
            >
              {items.length === 0 ? (
                <View className="px-4 py-6">
                  <Text className="font-dm-sans-medium text-sm text-gray-500">
                    No results
                  </Text>
                </View>
              ) : (
                items.map((item) => {
                  const isSelected = item.value === selectedItem?.value;
                  return (
                    <Pressable
                      key={String(item.value ?? item.label)}
                      onPress={() => {
                        onSelect(item);
                        setIsOpen(false);
                      }}
                      className="px-4 py-3 flex-row items-center"
                      android_ripple={{ color: "#e5e7eb" }}
                      style={{
                        backgroundColor: isSelected ? "#f3f4f6" : "white",
                      }}
                    >
                      <Text className="font-dm-sans-medium text-sm text-gray-900 flex-1">
                        {item.label}
                      </Text>
                      {isSelected ? (
                        <AntDesign name="check" size={14} color="#4b5563" />
                      ) : null}
                    </Pressable>
                  );
                })
              )}
            </ScrollView>
          </View>
        </>
      )}

      {invalid && invalidTxt && (
        <Text className="text-red-500 font-dm-sans text-sm">{invalidTxt}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    elevation: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    maxHeight: 240,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    overflow: "hidden",
  },
});

export default Dropdown;
