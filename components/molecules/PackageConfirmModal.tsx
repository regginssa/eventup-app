import { TFlightAvailability, THotelAvailability } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button, FlightItem, HotelItem, Modal } from "../common";
import { useTheme } from "../providers/ThemeProvider";

interface PackageConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageType: "standard" | "gold";
  eventId: string;
  flight?: TFlightAvailability;
  hotel?: THotelAvailability;
}

const PackageConfirmModal: React.FC<PackageConfirmModalProps> = ({
  isOpen,
  onClose,
  packageType,
  eventId,
  flight,
  hotel,
}) => {
  const { theme } = useTheme();

  const router = useRouter();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Confirm ${packageType} package`}
      scrolled={true}
    >
      <View className="w-full gap-3 p-2 rounded-lg border border-gray-200 mb-3">
        {!flight ? (
          <View className="w-full flex flex-col items-center justify-center gap-3">
            <MaterialCommunityIcons
              name="airplane-off"
              size={24}
              color="#4b5563"
            />
            <Text className="font-poppins-semibold text-gray-600">
              No flight
            </Text>
          </View>
        ) : (
          <FlightItem flight={flight} />
        )}
      </View>

      <View className="w-full gap-2 p-2 rounded-lg border border-gray-200 mb-3">
        {!hotel ? (
          <View className="w-full flex flex-col items-center justify-center gap-3">
            <MaterialCommunityIcons
              name="bank-off-outline"
              size={24}
              color="#4b5563"
            />
            <Text className="font-poppins-semibold text-gray-600">
              No hotel
            </Text>
          </View>
        ) : (
          <HotelItem hotel={hotel} hiddenImages={true} />
        )}
      </View>

      <Button
        type="primary"
        label="Proceed to Booking"
        buttonClassName="h-12"
        textClassName="text-lg"
        onPress={() =>
          router.push({ pathname: "/booking", params: { eventId } })
        }
      />
      <View className="h-3"></View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

export default PackageConfirmModal;
