import { IRoomRate } from "@/types";
import { getCurrencySymbol } from "@/utils/format";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BadgeGroup, ImageGroup } from "../molecules";
import Modal from "./Modal";
import RadioButton from "./RadioButton";

interface RoomCardProps {
  room: IRoomRate;
  selected: boolean;
  onSelect: () => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <View className={`p-4 rounded-xl border border-gray-300 w-64 mr-3`}>
        <View className="w-full flex flex-row justify-end">
          <RadioButton checked={selected} onPress={onSelect} />
        </View>
        <View className="flex-1">
          <Text className="font-dm-sans-bold text-sm mt-2">
            {room.roomType.split("|t|")[0]}
          </Text>
          <Text className="font-dm-sans-medium text-gray-600 text-xs mt-1">
            {room.boardType.split("|t|")[0]}
          </Text>
          <Text className="font-dm-sans-medium text-gray-600 text-xs mt-1">
            {room.facilities.length} facilities
          </Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => setIsOpen(true)}>
            <Text className="font-poppins-semibold text-gray-700 text-sm mt-2">
              View details
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="font-poppins-bold text-gray-700 text-xl mt-3 text-right">
          {getCurrencySymbol(room.currency.toLowerCase() as any)}{" "}
          {room.netPrice}
        </Text>
      </View>

      <Modal
        title={room.roomType.split("|t|")[0]}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        scrolled={true}
      >
        <Text className="font-poppins-semibold text-gray-700 text-sm mt-2">
          {room.roomType.split("|t|")[0]}
        </Text>
        <Text className="font-poppins-semibold text-gray-700 text-sm mt-2">
          {room.boardType.split("|t|")[0]}
        </Text>
        <View className="w-full flex flex-col gap-2 mt-2">
          <View className="flex flex-row items-center gap-2">
            <MaterialIcons name="checkroom" size={16} color="#4b5563" />

            <Text className="font-poppins-semibold text-gray-700 text-sm">
              Facilities ({room.facilities.length}):
            </Text>
          </View>
          <BadgeGroup
            badges={room.facilities}
            showCount={room.facilities.length}
          />
        </View>

        <ImageGroup imgs={room.roomImages} />
      </Modal>
    </>
  );
};

export default RoomCard;
