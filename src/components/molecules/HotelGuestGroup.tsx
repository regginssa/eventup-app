import { TDropdownItem, THotelPaxDetail } from "@/src/types";
import { Text, View } from "react-native";
import { Dropdown, Input } from "../common";

interface HotelGuestGroupProps {
  items: THotelPaxDetail[];
  onChange: (updated: THotelPaxDetail[]) => void;
}

const titles: TDropdownItem[] = [
  { label: "Mr", value: "Mr" },
  { label: "Mrs", value: "Mrs" },
];

const HotelGuestGroup: React.FC<HotelGuestGroupProps> = ({
  items,
  onChange,
}) => {
  // Helper to update nested values
  const handleFieldChange = (
    roomIdx: number,
    group: "adult" | "child",
    field: "title" | "firstName" | "lastName",
    guestIdx: number,
    value: string
  ) => {
    const updated = items.map((item, idx) => {
      if (idx !== roomIdx) return item;
      const groupData = { ...(item[group] || {}) };
      const arr = [...(groupData[field] || [])];
      arr[guestIdx] = value;
      return {
        ...item,
        [group]: {
          ...groupData,
          [field]: arr,
        },
      };
    });

    onChange(updated);
  };

  return (
    <View className="w-full flex flex-col gap-4">
      {items.map((item, index) => (
        <View
          key={`hotel-guest-group-item-${index}`}
          className="w-full px-4 flex flex-col gap-5"
        >
          {/* You can add more input fields here as needed */}
          <View className="w-full flex flex-row items-center justify-center gap-2">
            <Text className="font-dm-sans-bold text-gray-600 text-sm">
              Room {item.room_no}
            </Text>
            <View className="flex-1 bg-gray-200 h-[1px]"></View>
          </View>

          {item.adult.firstName.map((_, idx) => (
            <View
              key={`hotel-guest-group-item-adult-${idx}`}
              className="w-full flex flex-col items-start gap-3"
            >
              <View className="w-full flex flex-row items-center justify-center gap-2">
                <Text className="font-dm-sans-medium text-gray-700 text-sm">
                  Adult {idx + 1}
                </Text>
                <View className="flex-1 bg-gray-200 h-[1px]"></View>
              </View>

              <Dropdown
                label="Title"
                bordered={true}
                className="rounded-lg"
                items={titles}
                selectedItem={
                  titles.find((a) => a.value === item.adult.title[idx]) as any
                }
                onSelect={(selected: TDropdownItem) => {
                  handleFieldChange(
                    index,
                    "adult",
                    "title",
                    idx,
                    selected.value.toString()
                  );
                }}
              />

              <Input
                type="string"
                label="First Name"
                placeholder="Jhon"
                bordered={true}
                className="rounded-lg"
                value={item.adult.firstName[idx]}
                onChange={(val) => {
                  handleFieldChange(index, "adult", "firstName", idx, val);
                }}
              />
              <Input
                type="string"
                label="Last Name"
                placeholder="Doe"
                bordered={true}
                className="rounded-lg"
                value={item.adult.lastName[idx]}
                onChange={(val) => {
                  handleFieldChange(index, "adult", "lastName", idx, val);
                }}
              />
            </View>
          ))}

          {item?.child?.firstName.map((_, idx) => (
            <View
              key={`hotel-guest-group-item-child-${idx}`}
              className="w-full flex flex-col items-start gap-3"
            >
              <View className="w-full flex flex-row items-center justify-center gap-2">
                <Text className="font-dm-sans-medium text-gray-700 text-sm">
                  Child {idx + 1}
                </Text>
                <View className="flex-1 bg-gray-200 h-[1px]"></View>
              </View>

              <Dropdown
                label="Title"
                bordered={true}
                className="rounded-lg"
                items={titles}
                selectedItem={
                  titles.find((a) => a.value === item.child?.title[idx]) as any
                }
                onSelect={(selected: TDropdownItem) => {
                  handleFieldChange(
                    index,
                    "child",
                    "title",
                    idx,
                    selected.value.toString()
                  );
                }}
              />

              <Input
                type="string"
                label="First Name"
                placeholder="Jhon"
                bordered={true}
                className="rounded-lg"
                value={item.child?.firstName[idx] || ""}
                onChange={(val) => {
                  handleFieldChange(index, "child", "firstName", idx, val);
                }}
              />
              <Input
                type="string"
                label="Last Name"
                placeholder="Doe"
                bordered={true}
                className="rounded-lg"
                value={item.child?.lastName[idx] || ""}
                onChange={(val) => {
                  handleFieldChange(index, "child", "lastName", idx, val);
                }}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default HotelGuestGroup;
