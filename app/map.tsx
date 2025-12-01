import { fetchAllEvents } from "@/api/scripts/event";
import { Modal } from "@/components/common";
import { MapMarker } from "@/components/molecules";
import { MapContainer } from "@/components/organisms";
import { COLORFUL_MAP_STYLE } from "@/constants/themes";
import { RootState } from "@/redux/store";
import { IEvent } from "@/types/data";
import { formatEventDate, formatEventLabel } from "@/utils/format";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  InteractionManager,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RNMapView, { Marker } from "react-native-maps";
import { useSelector } from "react-redux";

const MapScreen = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | undefined>(
    undefined
  );
  const [pressing, setPressing] = useState(false);
  const mapRef = useRef<RNMapView | null>(null);

  const { user } = useSelector((state: RootState) => state.auth);

  const handleSelectEvent = (id?: string) => {
    if (pressing) return;
    setPressing(true);

    InteractionManager.runAfterInteractions(() => {
      const event = events.find((e) => e._id === id);
      if (!event) return;

      setSelectedEvent(event);
      setIsOpen(true);

      setTimeout(() => setPressing(false), 300);
    });
  };

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetchAllEvents();

      if (response.ok) {
        setEvents(response.data);
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <MapContainer>
      <View className="flex flex-row items-center gap-2">
        <MaterialIcons name="event-available" size={24} color="#374151" />
        <Text className="font-poppins-semibold text-sm text-gray-700">
          {events.length} events are available
        </Text>
      </View>
      {loading ? (
        <View className="flex-1 items-center justify-center gap-2">
          <ActivityIndicator size={48} color="#C427E0" />
          <Text className="text-[#C427E0] font-poppins-semibold">
            Loading...
          </Text>
        </View>
      ) : (
        <View className="flex-1 rounded-lg overflow-hidden">
          <RNMapView
            ref={mapRef}
            provider="google"
            showsBuildings
            showsPointsOfInterest
            pitchEnabled
            rotateEnabled
            style={{ flex: 1 }}
            customMapStyle={COLORFUL_MAP_STYLE}
            initialRegion={{
              latitude: user?.location.coordinate.latitude ?? 0,
              longitude: user?.location.coordinate.longitude ?? 0,
              latitudeDelta: 10.0,
              longitudeDelta: 12.0,
            }}
          >
            {events.map((event, index) => (
              <MapMarker
                key={event._id ?? index}
                coordinate={event.coordinate as any}
                onPress={() => handleSelectEvent(event._id)}
              />
            ))}

            {/* My location marker */}
            <Marker coordinate={user?.location.coordinate as any}>
              <View
                style={{
                  borderWidth: 3,
                  borderColor: "#fff",
                  borderRadius: 20,
                  overflow: "hidden",
                  elevation: 6,
                  shadowColor: "#C427E0",
                  shadowOpacity: 0.5,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 3 },
                }}
              >
                <Image
                  source={{ uri: user?.avatar }}
                  style={{ width: 20, height: 20, borderRadius: 10 }}
                  contentFit="cover"
                />
              </View>
            </Marker>
          </RNMapView>
        </View>
      )}

      <Modal
        title=""
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        scrolled={true}
      >
        <View className="w-full flex flex-row gap-4">
          <View className="relative w-[125px] h-[125px] rounded-lg overflow-hidden">
            {selectedEvent?.image ? (
              <Image
                source={{ uri: selectedEvent?.image }}
                alt={selectedEvent?.title}
                contentFit="cover"
                style={styles.image}
              />
            ) : (
              <View className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                <MaterialIcons name="hide-image" size={32} color="#1f2937" />
                <Text className="text-gray-800 font-poppins-semibold">
                  No Image
                </Text>
              </View>
            )}
          </View>

          <View className="flex-1 items-start justify-between">
            <Text className="font-poppins-semibold text-sm text-gray-800">
              {selectedEvent?.title}
            </Text>

            <View className="flex flex-row items-center gap-2.5">
              <View className="w-4 h-4 rounded-full overflow-hidden">
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
              <Text className="font-dm-sans text-gray-800">
                {selectedEvent?.category
                  ? formatEventLabel(selectedEvent?.category)
                  : "Unknown"}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2.5">
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={16}
                color="#1f2937"
              />
              <Text className="font-dm-sans text-gray-800">
                {selectedEvent?.venue?.city as string}, {selectedEvent?.country}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2.5">
              <MaterialCommunityIcons
                name="calendar-blank-outline"
                size={16}
                color="#1f2937"
              />
              <Text className="font-dm-sans text-gray-800">
                {selectedEvent?.opening_date
                  ? formatEventDate(selectedEvent?.opening_date)
                  : "Unknown"}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </MapContainer>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

export default MapScreen;
