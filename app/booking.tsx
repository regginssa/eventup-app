import { fetchEvent } from "@/api/scripts/event";
import {
  FlightItem,
  Input,
  Modal,
  Spinner,
  Textarea,
} from "@/components/common";
import BookingContainer from "@/components/organisms/BookingContainer";
import { RootState } from "@/redux/store";
import { TFlight } from "@/types";
import { IEvent } from "@/types/data";
import { formatEventDate } from "@/utils/format";
import {
  Feather,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const EventDetail = ({
  loading,
  event,
}: {
  loading: boolean;
  event: IEvent | null;
}) => {
  return (
    <View className="w-full bg-white rounded-xl p-4 gap-6">
      {loading ? (
        <View className="w-full h-40 flex flex-col items-center justify-center">
          <Spinner size="md" text="Loading Event Details..." />
        </View>
      ) : !event ? (
        <View className="flex-1 items-center justify-center">
          <View className="flex-1 items-center justify-center gap-2">
            <MaterialCommunityIcons
              name="emoticon-sad-outline"
              size={24}
              color="#1f2937"
            />
            <Text className="text-gray-700 font-poppins-semibold text-sm">
              No event data
            </Text>
          </View>
        </View>
      ) : (
        <>
          <View className="w-full flex flex-row items-center gap-4 overflow-hidden">
            <Image
              source={event.image}
              contentFit="cover"
              style={{ width: 100, height: 100, borderRadius: 6 }}
            />
            <View className="gap-4 flex-1">
              <Text className="font-poppins-semibold text-gray-700 line-clamp-2">
                {event.title}
              </Text>

              <View className="gap-2">
                <View className="flex flex-row items-center gap-2">
                  <Fontisto name="map-marker-alt" size={20} color="#374151" />
                  <Text className="font-dm-sans-medium text-sm text-gray-700">
                    {event?.venue?.city
                      ? `${event.venue.city}, ${event.country}`
                      : event?.country}
                  </Text>
                </View>
                <View className="flex flex-row items-center gap-2">
                  <Ionicons name="calendar-outline" size={16} color="#374151" />
                  <Text className="font-dm-sans-medium text-sm text-gray-700">
                    {formatEventDate(event?.opening_date as Date)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const FlightForm = ({ flight }: { flight: TFlight | null }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const selected = flight?.recommend;

  return (
    <View className="w-full bg-white rounded-xl p-4 gap-6">
      <TouchableOpacity
        activeOpacity={0.8}
        className="w-full flex flex-row items-center justify-between"
        onPress={() => setIsOpen(!isOpen)}
      >
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons name="airplane" size={20} color="#374151" />
          <Text className="font-dm-sans-bold text-gray-700">Flight</Text>
        </View>

        <Feather
          name={`chevron-${isOpen ? "up" : "down"}`}
          size={24}
          color="#374151"
        />
      </TouchableOpacity>

      <View className="w-full flex flex-col gap-3">
        {selected?.details.paxDetails && (
          <View className="w-full">
            {selected?.details.paxDetails.adults.map((adult, index) => (
              <View key={`booking-adult-${index}`}></View>
            ))}
          </View>
        )}
        <View className="w-full h-[1px] bg-gray-200"></View>
        <View className="w-full">
          <View className="flex flex-row items-center gap-1">
            <MaterialCommunityIcons
              name="account-outline"
              size={18}
              color="#374151"
            />
            <Text className="font-poppins-semibold text-sm text-gray-700">
              Customer Information
            </Text>
          </View>
          <View className="w-full p-4 flex flex-col gap-3">
            <Input
              type="string"
              label="Customer email"
              placeholder="you@example.com"
              bordered={true}
              className="rounded-lg"
              value={email}
              onChange={setEmail}
            />
            <Input
              type="string"
              label="Customer phone"
              placeholder="+4811422424"
              bordered={true}
              className="rounded-lg"
              value={phone}
              onChange={setPhone}
            />
            <Textarea
              label="Booking note"
              placeholder="Note your booking"
              bordered={true}
              className="rounded-lg"
              value={note}
              onChange={setNote}
            />
          </View>
        </View>
      </View>

      <Modal
        title="Flight Details"
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      >
        {!selected ? (
          <View className="w-full flex flex-col items-center justify-center gap-2">
            <MaterialCommunityIcons
              name="airplane-off"
              size={24}
              color="#4b5563"
            />
            <Text className="font-poppins-semibold text-gray-600">
              No Flight Details
            </Text>
          </View>
        ) : (
          <FlightItem flight={selected} hiddenHeader={true} />
        )}
      </Modal>
    </View>
  );
};

const BookingScreen = () => {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { eventId } = useLocalSearchParams();
  const { flight, hotel } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();

  const init = useCallback(async () => {
    if (!eventId || typeof eventId !== "string") return;

    try {
      setLoading(true);

      const response = await fetchEvent(eventId);

      setEvent(response.data);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    init();
  }, []);

  return (
    <BookingContainer>
      <EventDetail loading={loading} event={event} />
      <FlightForm flight={flight} />
    </BookingContainer>
  );
};

export default BookingScreen;
