import { TFlightAvailability } from "@/types";
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
  recommend?: TFlightAvailability;
  availabilities: TFlightAvailability[];
  isSearched: boolean;
  onSelect: (availability: TFlightAvailability) => void;
  onConfirm: () => void;
}

const FlightAvailabilityGroup: React.FC<FlightAvailabilityGroupProps> = ({
  recommend,
  availabilities,
  isSearched,
  onSelect,
  onConfirm,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const renderItem = ({ item }: { item: TFlightAvailability }) => {
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
        <FlightItem flight={item} />
      </TouchableOpacity>
    );
  };

  if (isSearched && !recommend) {
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
      {recommend && (
        <View className="w-full gap-4">
          <Text className="font-dm-sans-bold text-gray-700">
            Available Flights
          </Text>

          <View className="w-full px-2">
            <Text className="font-dm-sans-bold text-gray-700 text-sm">
              Recommend
            </Text>

            <FlightItem flight={recommend} hiddenHeader={true} />
          </View>

          <Button
            type="text"
            label="See more"
            textClassName="text-gray-700"
            onPress={() => setIsOpen(true)}
          />

          <Button
            type="primary"
            label="Confirm recommend"
            buttonClassName="h-12"
            onPress={onConfirm}
          />
        </View>
      )}

      <Modal
        title="Available Flights"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <FlatList
          data={availabilities}
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
