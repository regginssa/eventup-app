import {
  fetchFlightOffersPricing,
  fetchHotelOfferPricing,
} from "@/api/scripts/booking";
import { updateBookingFlightOfferById } from "@/redux/slices/booking.slice";
import { TTransfer } from "@/types";
import { TAmadeusFlightOffer, TAmadeusHotelOffer } from "@/types/amadeus";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { Button, FlightItem, HotelItem, Modal } from "../common";
import TransferAvailabilityGroup from "./TransferAvailabilityGroup";

interface PackageConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageType: "standard" | "gold";
  eventId: string;
  flight?: TAmadeusFlightOffer;
  hotel?: TAmadeusHotelOffer;
  transfer: TTransfer | null;
}

const PackageConfirmModal: React.FC<PackageConfirmModalProps> = ({
  isOpen,
  onClose,
  packageType,
  eventId,
  flight,
  hotel,
  transfer,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedOfferIndex, setSelectedOfferIndex] = useState<number>(0);

  const router = useRouter();
  const dispatch = useDispatch();

  const handleProceedToBooking = async () => {
    try {
      setLoading(true);

      if (flight) {
        const response = await fetchFlightOffersPricing({ offers: [flight] });

        if (response.ok) {
          dispatch(
            updateBookingFlightOfferById({
              id: flight.id,
              offer: response.data[0],
            }),
          );
        }
      }

      if (hotel) {
        // Use the selected offer's ID for pricing
        const selectedOffer = hotel.offers?.[selectedOfferIndex];
        if (selectedOffer?.id) {
          const response = await fetchHotelOfferPricing(selectedOffer.id);
          // TODO: Handle the pricing response and update booking state
        }
      }

      router.push({
        pathname: "/booking",
        params: { eventId, packageType },
      });
    } catch (error: any) {
      console.log("error updating flight offer price: ", error);
    } finally {
      setLoading(false);
    }
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
          <FlightItem data={flight} />
        )}
      </View>

      <View className="w-full gap-3 p-2 rounded-lg border border-gray-200 mb-3">
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
          <HotelItem
            data={hotel}
            hiddenImages={true}
            selectedOfferIndex={selectedOfferIndex}
            onOfferChange={setSelectedOfferIndex}
          />
        )}
      </View>

      <View className="w-full gap-3 p-2 rounded-lg border border-gray-200 mb-3">
        {!transfer ? (
          <View className="w-full flex flex-col items-center justify-center gap-3">
            <MaterialCommunityIcons name="car-off" size={24} color="#4b5563" />
            <Text className="font-poppins-semibold text-gray-600">
              No transfers
            </Text>
          </View>
        ) : (
          <TransferAvailabilityGroup transfer={transfer} />
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
