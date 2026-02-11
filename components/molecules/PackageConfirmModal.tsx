import {
  fetchFlightOffersPricing,
  fetchHotelOfferPricing,
} from "@/api/services/booking";
import {
  updateBookingFlightOfferById,
  updateBookingHotelByIndex,
} from "@/store/slices/booking.slice";
import { TTransfer } from "@/types";
import { TAmadeusFlightOffer, TAmadeusHotelOffer } from "@/types/amadeus";
import { ITicket } from "@/types/ticket";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { useDispatch } from "react-redux";
import {
  Button,
  FlightItem,
  HotelItem,
  Modal,
  UserTicketItem,
} from "../common";
import TransferAvailabilityGroup from "./TransferAvailabilityGroup";

interface PackageConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageType: "standard" | "gold";
  eventId: string;
  ticket?: ITicket;
  flight?: TAmadeusFlightOffer;
  hotel?: TAmadeusHotelOffer;
  transfer: TTransfer | null;
}

const PackageConfirmModal: React.FC<PackageConfirmModalProps> = ({
  isOpen,
  onClose,
  packageType,
  eventId,
  ticket,
  flight,
  hotel,
  transfer,
}) => {
  const [loading, setLoading] = useState<boolean>(false);

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
        const response = await fetchHotelOfferPricing(hotel.offers[0].id);

        if (response.ok) {
          dispatch(
            updateBookingHotelByIndex({
              index: 0,
              offer: response.data,
            }),
          );
        }
      }

      router.push({
        pathname: "/booking/booking-form",
        params: { eventId, packageType, ticketId: ticket?._id },
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
      scrolled
    >
      {ticket && <UserTicketItem item={ticket} />}

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
          <HotelItem data={hotel} hiddenImages={true} />
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
    </Modal>
  );
};

export default PackageConfirmModal;
