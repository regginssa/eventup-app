import { IBooking } from "@/types/booking";
import { formatEventLabel } from "@/utils/format";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Spinner } from "../common";

interface BookingCardGroupProps {
  bookings: IBooking[];
  loading?: boolean;
}

const BookingCardGroup: React.FC<BookingCardGroupProps> = ({
  bookings,
  loading,
}) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: IBooking }) => {
    const { flight, hotel, transfer, timezone, event } = item;

    return (
      <View
        className="rounded-xl relative w-full h-[250px] overflow-hidden bg-white"
        style={styles.item}
      >
        {!event.images || event.images.length === 0 ? (
          <View
            style={styles.image}
            className="flex flex-col items-center justify-center"
          >
            <MaterialIcons name="hide-image" size={32} color="#1f2937" />
            <Text className="text-gray-800 font-poppins-semibold">
              No Image
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: event.images?.[0] }}
            alt={event.name || ""}
            style={styles.image}
            contentFit="cover"
          />
        )}

        <View className="absolute inset-0 bg-black/40 backdrop-blur-sm"></View>

        <View className="absolute inset-0 z-10 p-4 flex flex-col justify-between">
          <View className="w-full flex flex-row items-center justify-between">
            {/* Event Category Marker */}
            <View className="p-2 bg-black/50 backdrop-blur-sm rounded-md flex flex-row items-center justify-center gap-2">
              <View className="w-3 h-3 rounded-full overflow-hidden">
                <LinearGradient
                  colors={["#C427E0", "#844AFF", "#12A9FF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View className="w-2 h-2 bg-white rounded-full"></View>
                </LinearGradient>
              </View>

              <Text className="font-dm-sans text-sm text-white">
                {formatEventLabel(event.classifications?.category as string)}
              </Text>
            </View>
          </View>

          <View className="w-full">
            <Text className="font-poppins-semibold text-white">
              {event.name}
            </Text>

            <View className="w-full flex flex-row items-end gap-4 mt-2">
              <View className="flex-1 gap-1">
                <View className="flex flex-row items-center gap-2">
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={16}
                    color="white"
                  />
                  <Text className="font-dm-sans-medium text-sm text-white">
                    {event.location?.city?.name
                      ? `${event.location?.city?.name}, ${event.location?.country?.code}`
                      : event.location?.country?.name}
                  </Text>
                </View>

                <View className="flex flex-row items-start gap-2">
                  <MaterialCommunityIcons name="apps" size={16} color="white" />

                  <View>
                    <View className="flex flex-row items-center gap-2">
                      {flight && (
                        <Text className="font-dm-sans-medium text-white text-sm">
                          • Flight
                        </Text>
                      )}
                      {hotel && (
                        <Text className="font-dm-sans-medium text-white text-sm">
                          • Hotel
                        </Text>
                      )}
                    </View>

                    <View className="flex flex-row items-center gap-2">
                      {transfer.ah && (
                        <Text className="font-dm-sans-medium text-white text-sm">
                          • Transfer(A/H)
                        </Text>
                      )}
                      {transfer.he && (
                        <Text className="font-dm-sans-medium text-white text-sm">
                          • Transfer(H/E)
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                className="w-10 h-10 rounded-lg flex items-center justify-center bg-white"
                onPress={() =>
                  router.push({
                    pathname: "/booked",
                    params: { bookingId: item._id, eventId: item.event._id },
                  })
                }
              >
                <Feather name="arrow-up-right" size={18} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white rounded-2xl p-4 flex flex-col items-center justify-center">
        <Spinner size="md" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white rounded-2xl p-4">
      <FlatList
        data={bookings}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  item: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default BookingCardGroup;
