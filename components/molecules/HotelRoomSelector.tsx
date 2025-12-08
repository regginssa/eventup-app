import { ScrollView, View } from "react-native";
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
    <View className="w-full mt-2">
      {Array.from({ length: paxCount }).map((_, index) => (
        <ScrollView
          key={`hotel-room-item-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {rooms.map((room, i) => (
            <RoomCard
              key={`room-option-${i}`}
              room={room}
              selected={selectedRooms[index] === i}
              onSelect={() => onSelect(index, i)}
            />
          ))}
        </ScrollView>
      ))}
    </View>
  );
};

export default HotelRoomSelector;
