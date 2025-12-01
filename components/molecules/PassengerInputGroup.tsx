import { TDropdownItem, TPassengerInfo } from "@/types";
import { useState } from "react";
import { View } from "react-native";
import { Dropdown } from "../common";

interface PassengerInputGroupProps {
  type: "adult" | "child";
  items: TPassengerInfo[];
}

const adultsTitles: TDropdownItem[] = [
  { label: "Mr", value: "Mr" },
  { label: "Mrs", value: "Mrs" },
];
const childTitles: TDropdownItem[] = [
  { label: "Master", value: "Master" },
  { label: "Miss", value: "Miss" },
];

const PassengerInputGroup: React.FC<PassengerInputGroupProps> = ({
  type,
  items,
}) => {
  const [title, setTitle] = useState<TDropdownItem>(
    type === "adult" ? adultsTitles[0] : childTitles[0]
  );

  return (
    <View className="w-full">
      {items.map((item, index) => (
        <View
          key={`passenger-input-group-item-${index}`}
          className="w-full px-4"
        >
          <Dropdown
            items={type === "adult" ? adultsTitles : childTitles}
            selectedItem={title}
            onSelect={setTitle}
          />
        </View>
      ))}
    </View>
  );
};

export default PassengerInputGroup;
