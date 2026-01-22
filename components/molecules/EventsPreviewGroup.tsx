import { IEvent } from "@/types/event";
import {
  formatEventDateTime,
  formatEventLabel,
  formatTimezoneShort,
} from "@/utils/format";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Spinner } from "../common";

interface EventsPreviewGroupProps {
  events: IEvent[];
  loading?: boolean;
  onReachedBottomChange?: (isAtBottom: boolean) => void;
}

const BOTTOM_PAD = 24;

const EventsPreviewGroup: React.FC<EventsPreviewGroupProps> = ({
  events,
  loading,
  onReachedBottomChange,
}) => {
  const contentHeightRef = useRef(0);
  const containerHeightRef = useRef(0);
  const lastIsBottomRef = useRef(false);

  const router = useRouter();

  const setIsAtBottom = useCallback(
    (v: boolean) => {
      if (v !== lastIsBottomRef.current) {
        lastIsBottomRef.current = v;
        onReachedBottomChange?.(v);
      }
    },
    [onReachedBottomChange]
  );

  const handleLayout = useCallback((e: any) => {
    containerHeightRef.current = e?.nativeEvent?.layout?.height ?? 0;
  }, []);

  const handleContentSizeChange = useCallback((_w: number, h: number) => {
    contentHeightRef.current = h ?? 0;
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      // ⚠️ Do NOT store `e` for later; read values synchronously:
      const { contentOffset, layoutMeasurement, contentSize } = e.nativeEvent;

      const y = contentOffset?.y ?? 0;
      const layoutH =
        layoutMeasurement?.height ?? containerHeightRef.current ?? 0;
      const contentH = contentSize?.height ?? contentHeightRef.current ?? 0;

      const isAtBottom = layoutH + y >= contentH - BOTTOM_PAD;
      setIsAtBottom(isAtBottom);
    },
    [setIsAtBottom]
  );

  return (
    <View className="flex-1 bg-white rounded-2xl p-4">
      {loading ? (
        <Spinner size="md" />
      ) : events.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-2">
          <MaterialCommunityIcons
            name="database-off-outline"
            size={48}
            color="#1f2937"
          />
          <Text className="text-gray-800 font-poppins-semibold">No Events</Text>
        </View>
      ) : (
        <ScrollView
          onScroll={handleScroll}
          onContentSizeChange={handleContentSizeChange}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 42,
            marginBottom: 0,
            boxSizing: "border-box",
            gap: 16,
          }}
          bounces={false}
        >
          {events.map((event, index) => (
            <View
              className="rounded-xl relative w-full h-[212px] overflow-hidden bg-white"
              key={index}
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
                  source={event.images[0]}
                  alt={event.name}
                  style={styles.image}
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
                      {formatEventLabel(
                        event.classifications.category as string
                      )}
                    </Text>
                  </View>

                  {/* Favorite */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center"
                  >
                    <Ionicons
                      name="heart-outline"
                      s
                      size={16}
                      color="#1f2937"
                    />
                  </TouchableOpacity>
                </View>

                <View className="w-full">
                  <Text className="font-poppins-semibold text-white">
                    {event.name}
                  </Text>

                  <View className="w-full flex flex-row items-end justify-between mt-2">
                    <View className="gap-1">
                      <View className="flex flex-row items-center gap-2">
                        <MaterialCommunityIcons
                          name="map-marker-outline"
                          size={16}
                          color="white"
                        />
                        <Text className="font-dm-sans-medium text-sm text-white">
                          {event.location.city?.name
                            ? `${event.location.city.name}, ${event.location.country.code}`
                            : event.location.country.name}
                        </Text>
                      </View>

                      <View className="flex flex-row items-center gap-2">
                        <MaterialCommunityIcons
                          name="calendar-outline"
                          size={16}
                          color="white"
                        />
                        <Text className="font-dm-sans-medium text-sm text-white">
                          {formatEventDateTime(
                            event.dates.start.date as string,
                            event.dates.start.time as string
                          )}{" "}
                          ({formatTimezoneShort(event.dates.timezone as string)}
                          )
                        </Text>
                      </View>
                    </View>

                    <Button
                      type="primary"
                      label="View package"
                      buttonClassName="w-[125px] h-10"
                      textClassName="text-sm"
                      onPress={() => router.push(`/event/${event._id}` as any)}
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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

export default EventsPreviewGroup;
