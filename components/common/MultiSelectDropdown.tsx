import { TDropdownItem } from "@/types";
import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface MultiSelectDropdownProps {
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  bordered?: boolean;
  className?: string;
  disabled?: boolean;
  items: TDropdownItem[];
  selectedItems: TDropdownItem[];
  onChange: (vals: TDropdownItem[]) => void;
  direction?: "up" | "down";
  invalid?: boolean;
  invalidTxt?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  placeholder,
  icon,
  bordered,
  items,
  selectedItems,
  className,
  disabled,
  onChange,
  direction = "down",
  invalid,
  invalidTxt,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedMap = useMemo(() => {
    const map = new Map<string | number, TDropdownItem>();
    selectedItems.forEach((it) => map.set(it.value ?? it.label, it));
    return map;
  }, [selectedItems]);

  const isSelected = (it: TDropdownItem) =>
    selectedMap.has(it.value ?? it.label);

  const toggleItem = (it: TDropdownItem) => {
    if (isSelected(it)) {
      onChange(
        selectedItems.filter(
          (s) => (s.value ?? s.label) !== (it.value ?? it.label),
        ),
      );
    } else {
      onChange([...selectedItems, it]);
    }
  };

  const removeItem = (it: TDropdownItem) => {
    onChange(
      selectedItems.filter(
        (s) => (s.value ?? s.label) !== (it.value ?? it.label),
      ),
    );
  };

  const displayValue =
    selectedItems.length === 0
      ? ""
      : selectedItems.map((s) => s.label).join(", ");

  return (
    <View className="w-full gap-2 relative">
      {label ? (
        <Text className="font-dm-sans text-sm text-gray-700">{label}</Text>
      ) : null}

      {/* Trigger */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={disabled}
        onPress={() => !disabled && setIsOpen((prev) => !prev)}
        className={`py-1 px-4 gap-2 bg-white flex flex-row items-center rounded-full`}
        style={[
          {
            borderWidth: bordered ? 1 : 0,
            borderColor: "#d1d5db",
            minHeight: 40,
          },
        ]}
      >
        {icon}
        <TextInput
          placeholder={placeholder}
          className="flex-1 bg-none text-black font-dm-sans text-sm"
          editable={false}
          value={displayValue}
          pointerEvents="none"
        />
        <Feather
          name={`chevron-${isOpen ? "up" : "down"}`}
          size={16}
          color="#4b5563"
        />
      </TouchableOpacity>

      {/* Selected chips (horizontal only) */}
      {selectedItems.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          style={{ marginTop: 6 }}
        >
          {selectedItems.map((it) => {
            const key = String(it.value ?? it.label);
            return (
              <View key={key} className="bg-white" style={styles.chip}>
                <Text className="text-xs text-gray-800" numberOfLines={1}>
                  {it.label}
                </Text>
                <Pressable
                  onPress={() => removeItem(it)}
                  hitSlop={6}
                  style={styles.chipClose}
                >
                  <AntDesign name="close" size={10} color="#4b5563" />
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Dropdown panel */}
      {isOpen && !disabled && (
        <>
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

          <View
            className={`absolute left-0 right-0 bg-white z-20 rounded-3xl ${
              direction === "up" ? "bottom-full mb-1" : "top-full mt-1"
            }`}
            style={styles.dropdownContainer}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              {items.length === 0 ? (
                <View className="px-4 py-6">
                  <Text className="text-sm text-gray-500">No results</Text>
                </View>
              ) : (
                items.map((item) => {
                  const key = String(item.value ?? item.label);
                  const selected = isSelected(item);
                  return (
                    <Pressable
                      key={key}
                      onPress={() => toggleItem(item)}
                      className="px-4 py-3 flex-row items-center"
                      android_ripple={{ color: "#e5e7eb" }}
                      style={{
                        backgroundColor: selected ? "#f3f4f6" : "white",
                      }}
                    >
                      <Text className="text-sm text-gray-900 flex-1">
                        {item.label}
                      </Text>
                      {selected ? (
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
  chipsRow: {
    paddingHorizontal: 4,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 16,
    gap: 6,
    maxWidth: 180,
  },
  chipClose: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E7EB",
  },
});

export default MultiSelectDropdown;
