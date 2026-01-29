import { TDropdownItem, TPassengerInfo } from "@/src/types";
import { formatBookingDate } from "@/src/utils/format";
import { Text, View } from "react-native";
import { DateTimePicker, Dropdown, Input, NationalityPicker } from "../common";

interface PassengerInputGroupProps {
  type: "adult" | "child" | "infant";
  items: TPassengerInfo[];
  onChange: (idx: number, val: any, label: keyof TPassengerInfo) => void;
  bookingType?: "flight" | "hotel"; // Determines which titles to use for children
}

const adultsTitles: TDropdownItem[] = [
  { label: "Mr", value: "Mr" },
  { label: "Mrs", value: "Mrs" },
];
const flightChildTitles: TDropdownItem[] = [
  { label: "Master", value: "Master" },
  { label: "Miss", value: "Miss" },
];
const hotelChildTitles: TDropdownItem[] = [
  { label: "Mr", value: "Mr" },
  { label: "Mrs", value: "Mrs" },
];

const PassengerInputGroup: React.FC<PassengerInputGroupProps> = ({
  type,
  items,
  onChange,
  bookingType = "flight", // Default to flight for backward compatibility
}) => {
  const getChildTitles = () => {
    return bookingType === "hotel" ? hotelChildTitles : flightChildTitles;
  };

  const getAvailableTitles = () => {
    if (type === "adult") return adultsTitles;
    return getChildTitles();
  };
  return (
    <View className="w-full flex flex-col gap-4">
      {items.map((item, index) => (
        <View
          key={`passenger-input-group-item-${index}`}
          className="w-full px-4 flex flex-col gap-3"
        >
          <View className="w-full flex flex-row items-center justify-center gap-2">
            <Text className="font-dm-sans-bold text-gray-600 text-sm">
              {type.toUpperCase()} {index + 1}
            </Text>
            <View className="flex-1 bg-gray-200 h-[1px]"></View>
          </View>
          <Dropdown
            label="Title"
            bordered={true}
            className="rounded-lg"
            items={getAvailableTitles()}
            selectedItem={
              getAvailableTitles().find((t) => t.value === item.title) ||
              (getAvailableTitles()[0] as any)
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
          <NationalityPicker
            label="Nationality"
            placeholder="e,g. PL"
            bordered={true}
            className="rounded-lg"
            value={item.nationality}
            onChange={(val) => onChange(index, val, "nationality")}
          />
        </View>
      ))}
    </View>
  );
};

export default PassengerInputGroup;
