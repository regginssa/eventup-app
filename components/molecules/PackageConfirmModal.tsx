import { fetchHotelRoomRates } from "@/api/scripts/booking";
import { setBookingHotelRoomRates } from "@/redux/slices/booking.slice";
import { TFlightAvailability, THotelAvailability } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { useDispatch } from "react-redux";
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
  const [loading, setLoading] = useState<boolean>(false);
  const { theme } = useTheme();

  const router = useRouter();
  const dispatch = useDispatch();

  const handleProceedToBooking = async () => {
    if (hotel) {
      if (!hotel.hotelId) {
        return Alert.alert("Error", "Invalid hotel selected.");
      }
      try {
        setLoading(true);

        const response = await fetchHotelRoomRates(hotel.hotelId);

        console.log("Fetched hotel room rates:", response.data);

        dispatch(setBookingHotelRoomRates(response.data));
      } catch (error: any) {
      } finally {
        setLoading(false);
      }
    }
    router.push({
      pathname: "/booking",
      params: { eventId, packageType },
    });
  };

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
        loading={loading}
        onPress={handleProceedToBooking}
      />

      <View className="h-3"></View>
    </Modal>
  );
};

export default PackageConfirmModal;
