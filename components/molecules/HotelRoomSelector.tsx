import { ScrollView, Text, View } from "react-native";
import { RoomCard } from "../common";

interface HotelRoomSelectorProps {
  paxCount: number;
  rooms: any[];
  selectedRooms: number[];
  onSelect: (roomNo: number, roomIndex: number) => void;
}

const HotelRoomSelector: React.FC<HotelRoomSelectorProps> = ({
  paxCount,
  rooms,
  selectedRooms,
  onSelect,
}) => {
  return (
    <View className="w-full mt-4">
      {Array.from({ length: paxCount }).map((_, index) => (
        <View key={`room-pax-${index}`} className="mt-6">
          <View className="flex flex-row items-center gap-2 mb-3">
            <Text className="font-dm-sans-bold text-gray-700">
              Room {index + 1}
            </Text>
            <View className="flex-1 bg-gray-300 h-[1px]" />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {rooms.map((room, i) => (
              <RoomCard
                key={`room-option-${i}`}
                room={room}
                selected={selectedRooms[index] === i}
                onSelect={() => onSelect(index, i)}
              />
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

export default HotelRoomSelector;
