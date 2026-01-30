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
        <View key={`hotel-room-item-${index}`} className="mb-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
          >
            {rooms.map((room, i) => (
              <RoomCard
                key={`room-option-${i}`}
                room={room}
                selected={selectedRooms[index] === i}
                onSelect={() => onSelect(i, index)}
              />
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

export default HotelRoomSelector;
