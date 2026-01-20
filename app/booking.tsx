import { fetchEvent } from "@/api/scripts/event";
import { Button, Spinner } from "@/components/common";
import TravelerDetailInputGroup, {
  TFlightTraveler,
} from "@/components/molecules/TravelerDetailInputGroup";
import BookingContainer from "@/components/organisms/BookingContainer";
import { RootState } from "@/redux/store";
import { IEvent } from "@/types/data";
import { formatEventDate } from "@/utils/format";
import { Fontisto, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
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

interface TravelerDetailsFormProps {
  travelers: number;
  onTravelerDetailsConfirm: (
    travelerDetails: TFlightTraveler,
    id: number,
  ) => void;
  isConfirmed: boolean[];
}

const TravelerDetailsForm: React.FC<TravelerDetailsFormProps> = ({
  travelers,
  onTravelerDetailsConfirm,
  isConfirmed,
}) => {
  return (
    <>
      <View className="w-full bg-white rounded-xl p-4 gap-6">
        <Text className="font-poppins-semibold text-lg text-gray-800">
          Traveler Details
        </Text>

        {Array.from({ length: travelers }).map((_, index) => (
          <TravelerDetailInputGroup
            key={index}
            id={index + 1}
            title={`Traveler ${index + 1}`}
            onConfirm={(travelerDetails) =>
              onTravelerDetailsConfirm(travelerDetails, index + 1)
            }
          />
        ))}
      </View>

      <View className="w-full bg-white rounded-xl p-4 gap-6">
        {Array.from({ length: travelers }).map((_, index) => (
          <View
            key={index}
            className="w-full flex flex-row items-center justify-between"
          >
            <Text className="font-poppins-semibold text-sm text-gray-800">
              Traveler {index + 1}
            </Text>

            {isConfirmed[index] ? (
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={24}
                color="green"
              />
            ) : (
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={24}
                color="red"
              />
            )}
          </View>
        ))}
      </View>
    </>
  );
};

const BookingScreen = () => {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { eventId, packageType } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { flight, hotel, transfer } = useSelector(
    (state: RootState) => state.booking,
  );
  const [passengers, setPassengers] = useState<TFlightTraveler[]>([]);
  const [isConfirmed, setIsConfirmed] = useState<boolean[]>(
    Array.from({ length: 2 }, () => false),
  );

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

  const handleTravelerDetailsConfirm = (
    passengerDetails: TFlightTraveler,
    id: number,
  ) => {
    setPassengers((prev) => {
      const newPassengers = [...prev];
      newPassengers[id - 1] = passengerDetails;
      return newPassengers;
    });
    setIsConfirmed((prev) => {
      const newIsConfirmed = [...prev];
      newIsConfirmed[id - 1] = true;
      return newIsConfirmed;
    });
  };

  const handleCheckout = async () => {
    if (isConfirmed.every((confirmed) => !confirmed))
      return Alert.alert("Error", "Please confirm all passenger details");
  };

  return (
    <BookingContainer>
      <View className="flex-1 gap-4">
        <EventDetail loading={loading} event={event} />

        <TravelerDetailsForm
          travelers={2}
          onTravelerDetailsConfirm={handleTravelerDetailsConfirm}
          isConfirmed={isConfirmed}
        />
      </View>

      <Button
        type="primary"
        label="Checkout"
        buttonClassName="h-12"
        disabled={isConfirmed.every((confirmed) => !confirmed)}
        onPress={handleCheckout}
      />
    </BookingContainer>
  );
};

export default BookingScreen;
