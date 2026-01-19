import { TAmadeusFlightOffer } from "@/types/amadeus";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, FlightItem, Modal } from "../common";

interface FlightAvailabilityGroupProps {
  selected?: TAmadeusFlightOffer;
  items: TAmadeusFlightOffer[];
  isSearched: boolean;
  onSelect: (availability: TAmadeusFlightOffer) => void;
}

const FlightAvailabilityGroup: React.FC<FlightAvailabilityGroupProps> = ({
  selected,
  items,
  isSearched,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const renderItem = ({ item }: { item: TAmadeusFlightOffer }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className="w-full gap-4 p-2 bg-white border border-gray-200 rounded-xl"
        style={styles.listContainer}
        onPress={() => {
          onSelect(item);
          setIsOpen(false);
        }}
      >
        <FlightItem data={item} />
      </TouchableOpacity>
    );
  };

  if (isSearched && !selected) {
    return (
      <View className="w-full flex flex-col items-center justify-center gap-2">
        <MaterialCommunityIcons name="airplane-off" size={24} color="#4b5563" />
        <Text className="font-poppins-semibold text-gray-600">
          No available airlines
        </Text>
      </View>
    );
  }

  return (
    <>
      {selected && (
        <View className="w-full gap-4">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons name="airplane" size={20} color="#374151" />
            <Text className="font-dm-sans-bold text-gray-700">
              Available Flights
            </Text>
          </View>

          <FlightItem data={selected} hiddenHeader={true} />

          <Button
            type="text"
            label="See more"
            textClassName="text-gray-700"
            buttonClassName="h-8"
            onPress={() => setIsOpen(true)}
          />
        </View>
      )}

      <Modal
        title="Available Flights"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <FlatList
          data={items}
          keyExtractor={(_, index) => index.toString()}
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
});

export default FlightAvailabilityGroup;
