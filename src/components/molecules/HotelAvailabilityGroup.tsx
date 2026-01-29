import { TAmadeusHotelOffer } from "@/src/types/amadeus";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, HotelItem, Modal } from "../common";

interface HotelAvailabilityGroupProps {
  items: TAmadeusHotelOffer[];
  selected?: TAmadeusHotelOffer;
  isSearched: boolean;
  onSelect: (hotel: TAmadeusHotelOffer) => void;
}

const HotelAvailabilityGroup: React.FC<HotelAvailabilityGroupProps> = ({
  items,
  selected,
  isSearched,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const renderItem = ({ item }: { item: TAmadeusHotelOffer }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        className="w-full p-3 bg-white border border-gray-200 rounded-xl"
        style={styles.listContainer}
        onPress={() => {
          onSelect(item);
          setIsOpen(false);
        }}
      >
        <HotelItem data={item} hiddenHeader={true} hiddenImages={true} />
      </TouchableOpacity>
    );
  };

  const handleViewImages = async () => {};

  if (isSearched && !selected) {
    return (
      <View className="w-full flex flex-col items-center justify-center gap-2">
        <MaterialCommunityIcons
          name="bank-off-outline"
          size={24}
          color="#4b5563"
        />
        <Text className="font-poppins-semibold text-gray-600">
          No available hotels
        </Text>
      </View>
    );
  }

  return (
    <>
      {selected && (
        <View className="w-full gap-4 overflow-hidden">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="home-outline"
              size={20}
              color="#374151"
            />
            <Text className="font-dm-sans-bold text-gray-700">
              Available Hotels
            </Text>
          </View>

          <HotelItem
            data={selected}
            hiddenHeader={true}
            onViewImages={handleViewImages}
          />

          {items.length > 1 && (
            <Button
              type="text"
              label="See more"
              textClassName="text-gray-700"
              buttonClassName="h-8"
              onPress={() => setIsOpen(true)}
            />
          )}
        </View>
      )}

      <Modal
        title="Available Hotels"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <FlatList
          data={items}
          keyExtractor={(item) => item.hotel?.hotelId || ""}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 16 }}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default HotelAvailabilityGroup;
