import { IEvent } from "@/types/event";
import { ICommunityTicket } from "@/types/ticket";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import {
  Button,
  CommunityTicketItem,
  FlightItem,
  HotelItem,
  Modal,
  TransferItem,
} from "../common";
import { useFlight } from "../providers/FlightProvider";
import { useHotel } from "../providers/HotelProvider";
import { useToast } from "../providers/ToastProvider";
import { useTransfer } from "../providers/TransferProvider";

interface PackageConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageType: "standard" | "gold";
  communityTicket?: ICommunityTicket;
  event?: IEvent;
}

const PackageConfirmModal: React.FC<PackageConfirmModalProps> = ({
  isOpen,
  onClose,
  packageType,
  communityTicket,
  event,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const isGold = packageType === "gold";

  const router = useRouter();
  const { offer: flightOffer } = useFlight();
  const { offer: hotelOffer, checkRates } = useHotel();
  const { airportToHotelOffer, hotelToEventOffer } = useTransfer();
  const toast = useToast();

  // Calculate Total (Mock logic - replace with your actual price summing)
  const total = (
    (Number(flightOffer?.totalAmount) || 0) +
    (Number(hotelOffer?.totalAmount) || 0) +
    (Number(airportToHotelOffer?.totalAmount) || 0) +
    (Number(hotelToEventOffer?.totalAmount) || 0)
  ).toFixed(2);

  const SectionHeader = ({
    title,
    icon,
    color,
  }: {
    title: string;
    icon: any;
    color: string;
  }) => (
    <View className="flex flex-row items-center gap-2 mb-3 mt-2">
      <MaterialCommunityIcons name={icon} size={18} color={color} />
      <Text className="font-dm-sans-bold text-xs uppercase tracking-[2px] text-gray-400">
        {title}
      </Text>
    </View>
  );

  const EmptyState = ({ label }: { label: string }) => (
    <View className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-200 items-center justify-center">
      <Text className="font-dm-sans-medium text-gray-400 text-xs italic">
        {label}
      </Text>
    </View>
  );

  const handleCheckout = async () => {
    if (!event?._id) {
      return toast.warn("Event isn't selected");
    }
    try {
      setLoading(true);

      if (hotelOffer) {
        const checkedOffer = await checkRates({ rateKey: hotelOffer.rateKey });
        if (!checkedOffer) {
          setLoading(false);
          return toast.error("Checking hotel rates failed");
        }
      }

      router.push({
        pathname: "/booking/checkout",
        params: {
          eventId: event._id,
          packageType,
          ticketId: communityTicket?._id,
        },
      });
    } catch (err) {
      setLoading(false);
      toast.error("Checkout failed");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${packageType.toUpperCase()} PACKAGE`}
      scrolled
    >
      <View className="flex-1">
        {/* 1. TICKET INFO (The Base) */}
        <View className="mb-6">
          {communityTicket && <CommunityTicketItem item={communityTicket} />}
        </View>

        <View className="px-1">
          {/* 2. FLIGHT SECTION */}
          <SectionHeader
            title="Outbound Flight"
            icon="airplane"
            color="#3b82f6"
          />
          <View className="mb-6">
            {!flightOffer ? (
              <EmptyState label="No flight selected" />
            ) : (
              <FlightItem data={flightOffer} />
            )}
          </View>

          {/* 3. TRANSFERS & HOTEL (The "Stay" Group) */}
          <View className="relative">
            {/* Vertical Connecting Line */}
            <View className="absolute left-[18px] top-4 bottom-4 w-[1px] bg-gray-200 border-dashed" />

            {/* Airport Transfer */}
            <View className="flex flex-row gap-4 mb-4">
              <View className="z-10 bg-blue-500 w-9 h-9 rounded-full items-center justify-center shadow-sm">
                <MaterialCommunityIcons name="car" size={18} color="white" />
              </View>
              <View className="flex-1">
                {!airportToHotelOffer ? (
                  <EmptyState label="No airport transfer" />
                ) : (
                  <TransferItem data={airportToHotelOffer} />
                )}
              </View>
            </View>

            {/* Hotel */}
            <View className="flex flex-row gap-4 mb-4">
              <View className="z-10 bg-indigo-500 w-9 h-9 rounded-full items-center justify-center shadow-sm">
                <MaterialCommunityIcons
                  name="office-building"
                  size={18}
                  color="white"
                />
              </View>
              <View className="flex-1">
                {!hotelOffer ? (
                  <EmptyState label="No hotel selected" />
                ) : (
                  <HotelItem data={hotelOffer} />
                )}
              </View>
            </View>

            {/* Event Transfer */}
            <View className="flex flex-row gap-4 mb-6">
              <View className="z-10 bg-orange-500 w-9 h-9 rounded-full items-center justify-center shadow-sm">
                <MaterialCommunityIcons
                  name="map-marker-distance"
                  size={18}
                  color="white"
                />
              </View>
              <View className="flex-1">
                {!hotelToEventOffer ? (
                  <EmptyState label="No event transfer" />
                ) : (
                  <TransferItem data={hotelToEventOffer} />
                )}
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* 4. TOTAL SUMMARY & PROCEED */}
      <View className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <View className="flex flex-row justify-between items-center mb-4">
          <Text className="font-dm-sans-bold text-gray-500">
            Estimated Total
          </Text>
          <View className="flex flex-row items-start gap-1">
            <Text className="font-poppins-semibold text-gray-600 text-xs">
              {flightOffer?.currency || "USD"}
            </Text>
            <Text className="font-poppins-bold text-2xl text-green-600">
              {total}
            </Text>
          </View>
        </View>

        <Button
          type="primary"
          label={loading ? "Checking Rates..." : "Checkout"}
          buttonClassName="h-12 rounded-xl"
          textClassName="text-lg font-poppins-bold"
          loading={loading}
          onPress={handleCheckout}
        />
        <Text className="text-center text-xs text-gray-500 mt-3 font-dm-sans-medium">
          Prices and availability are subject to change until booking is
          confirmed.
        </Text>
      </View>
    </Modal>
  );
};

export default PackageConfirmModal;
