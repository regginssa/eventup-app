import { IEvent } from "@/types/event";
import { ICommunityTicket } from "@/types/ticket";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import {
  Button,
  CommunityTicketItem,
  FlightItem,
  HotelItem,
  Modal,
  OfficialTicketItem,
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
  const { offer: hotelOffer, quote } = useHotel();
  const { airportToHotelOffer, hotelToEventOffer } = useTransfer();
  const toast = useToast();

  const handleCheckout = async () => {
    if (!event?._id) {
      return toast.warn("Event isn't selected");
    }
    try {
      setLoading(true);

      if (hotelOffer) {
        const offerQuote = await quote(hotelOffer.id);
        if (!offerQuote) {
          setLoading(false);
          return toast.error("Checking hotel rates failed");
        }
      }
      onClose();
      router.push({
        pathname: "/booking/checkout",
        params: {
          eventId: event._id,
          packageType,
          ticketId: communityTicket?._id,
        },
      });
    } catch (err) {
      toast.error("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const total = (
    (Number(flightOffer?.converted?.totalAmount) || 0) +
    (Number(hotelOffer?.converted?.totalAmount) || 0) +
    (Number(airportToHotelOffer?.converted?.totalAmount) || 0) +
    (Number(hotelToEventOffer?.converted?.totalAmount) || 0)
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
    <View className="flex flex-row items-center gap-2 mb-4 mt-2 px-1">
      <View
        style={{ backgroundColor: `${color}15` }}
        className="p-1.5 rounded-lg"
      >
        <MaterialCommunityIcons name={icon} size={16} color={color} />
      </View>
      <Text className="font-dm-sans-bold text-[11px] uppercase tracking-[1.5px] text-slate-400">
        {title}
      </Text>
    </View>
  );

  const isValid: boolean = !!(
    (event?.type === "user" && event.fee?.type === "paid" && communityTicket) ||
    (event?.type === "user" && event.fee?.type === "free") ||
    (event?.type === "ai" &&
      (flightOffer || hotelOffer || airportToHotelOffer || hotelToEventOffer))
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" scrolled>
      <View className="flex-1 pb-4">
        {/* PACKAGE BADGE */}
        <View className="items-center mb-6">
          <LinearGradient
            colors={isGold ? ["#FACC15", "#EAB308"] : ["#844AFF", "#C427E0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="px-6 py-2 shadow-md"
            style={{ borderRadius: 24 }}
          >
            <Text className="font-poppins-bold text-white text-xs uppercase tracking-widest">
              {isGold ? "✨ Gold Package" : "Standard Package"}
            </Text>
          </LinearGradient>
        </View>

        {/* 1. TICKET INFO */}
        <View className="mb-8">
          <SectionHeader
            title="Admission"
            icon="ticket-confirmation-outline"
            color="#844AFF"
          />
          {event?.type === "ai" ? (
            <OfficialTicketItem event={event} />
          ) : (
            <>
              {communityTicket && (
                <CommunityTicketItem item={communityTicket} />
              )}
            </>
          )}
        </View>

        {/* 2. LOGISTICS TIMELINE */}
        <View className="px-1">
          <SectionHeader
            title="Flight & Hotel & Logistics"
            icon="map-marker-path"
            color="#C427E0"
          />

          <View className="relative">
            {/* Timeline Vertical Line */}
            <View className="absolute left-[21px] top-6 bottom-6 w-[2px] bg-slate-100" />

            {/* Flight */}
            <View className="flex-row gap-4 mb-4">
              <View className="z-10 bg-white w-10 h-10 rounded-full items-center justify-center border-2 border-slate-50 shadow-sm">
                <MaterialCommunityIcons
                  name="airplane-takeoff"
                  size={18}
                  color="#844AFF"
                />
              </View>
              <View className="flex-1">
                {flightOffer ? (
                  <FlightItem data={flightOffer} />
                ) : (
                  <Text className="italic text-slate-400 text-xs py-2">
                    No flight selected
                  </Text>
                )}
              </View>
            </View>

            {/* Airport Transfer */}
            <View className="flex-row gap-4 mb-4">
              <View className="z-10 bg-white w-10 h-10 rounded-full items-center justify-center border-2 border-slate-50 shadow-sm">
                <MaterialCommunityIcons
                  name="car-cog"
                  size={18}
                  color="#C427E0"
                />
              </View>
              <View className="flex-1">
                {airportToHotelOffer ? (
                  <TransferItem data={airportToHotelOffer} />
                ) : (
                  <Text className="italic text-slate-400 text-xs py-2">
                    No airport transfer
                  </Text>
                )}
              </View>
            </View>

            {/* Hotel */}
            <View className="flex-row gap-4 mb-4">
              <View className="z-10 bg-white w-10 h-10 rounded-full items-center justify-center border-2 border-slate-50 shadow-sm">
                <MaterialCommunityIcons
                  name="bed-king"
                  size={18}
                  color="#844AFF"
                />
              </View>
              <View className="flex-1">
                {hotelOffer ? (
                  <HotelItem data={hotelOffer} />
                ) : (
                  <Text className="italic text-slate-400 text-xs py-2">
                    No hotel selected
                  </Text>
                )}
              </View>
            </View>

            {/* Event Transfer */}
            <View className="flex-row gap-4">
              <View className="z-10 bg-white w-10 h-10 rounded-full items-center justify-center border-2 border-slate-50 shadow-sm">
                <MaterialCommunityIcons
                  name="map-check"
                  size={18}
                  color="#C427E0"
                />
              </View>
              <View className="flex-1">
                {hotelToEventOffer ? (
                  <TransferItem data={hotelToEventOffer} />
                ) : (
                  <Text className="italic text-slate-400 text-xs py-2">
                    No event transfer
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* 4. TOTAL SUMMARY CARD */}
        <View className="mt-10">
          <View className="flex-row justify-between items-end mb-6">
            <View className="gap-1">
              <Text className="font-dm-sans-bold text-slate-400 text-[10px] uppercase tracking-widest mb-1">
                Grand Total in usd
              </Text>

              <View className="flex flex-row items-end gap-1">
                <Text className="text-sm text-slate-400 font-poppins-semibold">
                  USD
                </Text>
                <Text className="font-poppins-bold text-slate-900 text-3xl">
                  {total}
                </Text>
              </View>
            </View>
            <View className="bg-emerald-100 px-3 py-1.5 rounded-xl flex-row items-center">
              <MaterialCommunityIcons
                name="shield-check"
                size={14}
                color="#059669"
              />
              <Text className="text-emerald-700 font-dm-sans-bold text-[10px] ml-1 uppercase">
                Secure
              </Text>
            </View>
          </View>

          <Button
            type="primary"
            label={loading ? "Verifying..." : "Confirm & Checkout"}
            buttonClassName="h-12 shadow-xl shadow-purple-200"
            textClassName="text-lg font-poppins-bold"
            disabled={!isValid}
            loading={loading}
            onPress={handleCheckout}
          />

          <Text className="text-center text-[10px] text-slate-400 mt-4 leading-4 font-dm-sans-medium px-4">
            By proceeding, you agree to the booking terms.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default PackageConfirmModal;
