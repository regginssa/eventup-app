import { TDropdownItem, TPassengerInfo } from "@/types";
import { formatBookingDate } from "@/utils/format";
import { Text, View } from "react-native";
import { DateTimePicker, Dropdown, Input } from "../common";

interface PassengerInputGroupProps {
  type: "adult" | "child";
  items: TPassengerInfo[];
  onChange: (idx: number, val: any, label: keyof TPassengerInfo) => void;
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
  onChange,
}) => {
  return (
    <View className="w-full">
      {items.map((item, index) => (
        <View
          key={`passenger-input-group-item-${index}`}
          className="w-full px-4 flex flex-col gap-3"
        >
          <View className="w-full flex flex-row items-center justify-center gap-2">
            <Text className="font-dm-sans-medium text-gray-600 text-sm">
              {type.toUpperCase()} {index + 1}
            </Text>
            <View className="flex-1 bg-gray-200 h-[1px]"></View>
          </View>
          <Dropdown
            label="Title"
            bordered={true}
            className="rounded-lg"
            items={type === "adult" ? adultsTitles : childTitles}
            selectedItem={
              type === "adult"
                ? adultsTitles.find((a) => a.value === item.title)
                : type === "child"
                ? childTitles.find((c) => c.value === item.title)
                : (adultsTitles[0] as any)
            }
            onSelect={(selected: TDropdownItem) =>
              onChange(index, selected.value, "title")
            }
          />
          <Input
            type="string"
            label="First Name"
            placeholder="Jhon"
            bordered={true}
            className="rounded-lg"
            value={item.firstName}
            onChange={(val) => onChange(index, val, "firstName")}
          />
          <Input
            type="string"
            label="Last Name"
            placeholder="Doe"
            bordered={true}
            className="rounded-lg"
            value={item.lastName}
            onChange={(val) => onChange(index, val, "lastName")}
          />
          <DateTimePicker
            label="Birthday"
            placeholder=""
            bordered={true}
            className="rounded-lg"
            value={new Date(item.dob)}
            onPick={(date: Date) =>
              onChange(index, formatBookingDate(date), "dob")
            }
          />
        </View>
      ))}
    </View>
  );
};

export default PassengerInputGroup;
