import eventRestServices from "@/api/services/event";
import { Button, Modal } from "@/components/common";
import { MapMarker } from "@/components/molecules";
import { LayoutContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { COLORFUL_MAP_STYLE } from "@/constants/themes";
import { IEvent } from "@/types/event";
import { formatDateTime, formatEventLabel } from "@/utils/format";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  InteractionManager,
  StyleSheet,
  Text,
  View,
} from "react-native";
import RNMapView, { Marker } from "react-native-maps";

const MapScreen = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | undefined>();
  const [pressing, setPressing] = useState(false);
  const [region, setRegion] = useState<any>(null);

  const mapRef = useRef<RNMapView | null>(null);

  const { user } = useAuth();
  const router = useRouter();

  /**
   * Select event
   */
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

  /**
   * Fetch events inside visible map
   */
  const fetchEvents = async (region: any) => {
    try {
      setLoading(true);

      const { latitude, longitude, latitudeDelta, longitudeDelta } = region;

      const north = latitude + latitudeDelta / 2;
      const south = latitude - latitudeDelta / 2;
      const east = longitude + longitudeDelta / 2;
      const west = longitude - longitudeDelta / 2;

      const response = await eventRestServices.getByBounds({
        north,
        south,
        east,
        west,
      });

      if (response?.ok) {
        setEvents(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Debounce map movement
   */
  const debouncedFetch = useCallback(
    debounce((region) => {
      fetchEvents(region);
    }, 600),
    [],
  );

  /**
   * Trigger fetch when region changes
   */
  useEffect(() => {
    if (!region) return;
    debouncedFetch(region);
  }, [region]);

  return (
    <LayoutContainer title="Map">
      {/* Event Counter */}
      <View className="flex flex-row items-center gap-2">
        <View className="w-2 h-2 rounded-full bg-emerald-500" />
        <Text className="font-poppins-semibold text-[11px] uppercase tracking-widest text-gray-500">
          {events.length} events visible
        </Text>
      </View>

      {loading && (
        <View className="absolute top-10 left-0 right-0 items-center z-50">
          <ActivityIndicator size={40} color="#C427E0" />
        </View>
      )}

      {/* Map */}
      <View className="flex-1 rounded-3xl overflow-hidden mt-4">
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
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
          onRegionChangeComplete={(region) => {
            setRegion(region);
          }}
        >
          {/* Event markers */}
          {events.map((event, index) => (
            <MapMarker
              key={event._id ?? index}
              coordinate={{
                latitude: event?.location?.coordinate.latitude || 0,
                longitude: event?.location?.coordinate.longitude || 0,
              }}
              onPress={() => handleSelectEvent(event._id)}
            />
          ))}

          {/* User location marker */}
          <Marker
            coordinate={{
              latitude: user?.location.coordinate.latitude ?? 0,
              longitude: user?.location.coordinate.longitude ?? 0,
            }}
          >
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

      {/* Event Modal */}
      <Modal
        title=""
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        scrolled={true}
      >
        <View className="w-full flex flex-row gap-4 mb-4">
          <View className="relative w-[125px] h-[125px] rounded-lg overflow-hidden">
            {selectedEvent?.images && selectedEvent.images.length > 0 ? (
              <Image
                source={{ uri: selectedEvent?.images[0] }}
                alt={selectedEvent?.name}
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
              {selectedEvent?.name}
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
                {selectedEvent?.classifications?.category
                  ? formatEventLabel(selectedEvent?.classifications?.category)
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
                {selectedEvent?.location?.city.name},{" "}
                {selectedEvent?.location?.country.code}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2.5">
              <MaterialCommunityIcons
                name="calendar-blank-outline"
                size={16}
                color="#1f2937"
              />
              <Text className="font-dm-sans text-gray-800">
                {selectedEvent?.dates?.start.date
                  ? `${selectedEvent.dates.start.time} / ${formatDateTime(
                      selectedEvent.dates.start.date,
                    )}`
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>

        <Button
          type="primary"
          label="View"
          buttonClassName="h-12"
          onPress={() =>
            router.push({
              pathname: `/event/details/${selectedEvent?.type}` as any,
              params: { id: selectedEvent?._id },
            })
          }
        />
      </Modal>
    </LayoutContainer>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

export default MapScreen;
