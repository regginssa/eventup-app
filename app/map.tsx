import eventRestServices from "@/api/services/event";
import { Button, Modal } from "@/components/common";
import { MapMarker } from "@/components/molecules";
import { SimpleContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { COLORFUL_MAP_STYLE } from "@/constants/themes";
import { IEvent } from "@/types/event";
import { formatEventDateTime, formatEventLabel } from "@/utils/format";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import RNMapView, { Marker } from "react-native-maps";

const MapScreen = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | undefined>();
  const [showSearchButton, setShowSearchButton] = useState(false);

  const mapRef = useRef<RNMapView | null>(null);
  const currentRegion = useRef<any>(null);

  const ignoreRegionChange = useRef(false);
  const isFetching = useRef(false);

  const { user } = useAuth();
  const router = useRouter();

  /**
   * Fetch events
   */
  const fetchEvents = async (region: any) => {
    if (isFetching.current) return;

    try {
      isFetching.current = true;
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
    } catch (err) {
      console.log(err);
    } finally {
      isFetching.current = false;
      setLoading(false);
    }
  };

  /**
   * When user moves map
   */
  const handleRegionChangeComplete = (region: any) => {
    if (ignoreRegionChange.current) return;

    currentRegion.current = region;
    setShowSearchButton(true);
  };

  /**
   * User taps "Search this area"
   */
  const handleSearchArea = () => {
    if (!currentRegion.current) return;

    fetchEvents(currentRegion.current);
    setShowSearchButton(false);
  };

  /**
   * Select marker
   */
  const handleSelectEvent = (id?: string) => {
    const event = events.find((e) => e._id === id);
    if (!event) return;

    ignoreRegionChange.current = true;

    setSelectedEvent(event);
    setIsOpen(true);

    setTimeout(() => {
      ignoreRegionChange.current = false;
    }, 200);
  };

  /**
   * Initial fetch
   */
  useEffect(() => {
    if (!user?.location?.coordinate) return;

    const initialRegion = {
      latitude: user.location.coordinate.latitude,
      longitude: user.location.coordinate.longitude,
      latitudeDelta: 5,
      longitudeDelta: 5,
    };

    currentRegion.current = initialRegion;

    fetchEvents(initialRegion);
  }, []);

  /**
   * Memo markers
   */
  const markers = useMemo(() => {
    return events.map((event, index) => (
      <MapMarker
        key={event._id ?? index}
        coordinate={{
          latitude: event?.location?.coordinate.latitude || 0,
          longitude: event?.location?.coordinate.longitude || 0,
        }}
        onPress={() => handleSelectEvent(event._id)}
      />
    ));
  }, [events]);

  return (
    <SimpleContainer title="Map">
      {/* Event Counter */}
      <View className="flex flex-row items-center gap-2">
        <View className="w-2 h-2 rounded-full bg-emerald-500" />
        <Text className="font-poppins-semibold text-[11px] uppercase tracking-widest text-gray-500">
          {events.length} events visible
        </Text>
      </View>

      {/* Map Container */}
      <View className="flex-1 rounded-3xl overflow-hidden">
        {/* Floating Search Button */}
        {showSearchButton && (
          <View
            style={{
              position: "absolute",
              top: 20,
              alignSelf: "center",
              zIndex: 50,
            }}
          >
            <Button
              label="Search this area"
              type="primary"
              buttonClassName="h-12"
              onPress={handleSearchArea}
            />
          </View>
        )}

        {/* Loader */}
        {loading && (
          <View
            style={{
              position: "absolute",
              top: 80,
              alignSelf: "center",
              zIndex: 50,
            }}
          >
            <ActivityIndicator size={36} color="#C427E0" />
          </View>
        )}

        <RNMapView
          ref={mapRef}
          provider="google"
          style={{ flex: 1 }}
          showsBuildings
          showsPointsOfInterest
          pitchEnabled
          rotateEnabled
          customMapStyle={COLORFUL_MAP_STYLE}
          initialRegion={{
            latitude: user?.location.coordinate.latitude ?? 0,
            longitude: user?.location.coordinate.longitude ?? 0,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {/* Event markers */}
          {markers}

          {/* User marker */}
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
      <Modal title="" isOpen={isOpen} onClose={() => setIsOpen(false)} scrolled>
        <View className="w-full flex flex-row gap-4 mb-4">
          <View className="relative w-[125px] h-[125px] rounded-lg overflow-hidden">
            {selectedEvent?.images?.length ? (
              <Image
                source={{ uri: selectedEvent.images[0] }}
                contentFit="cover"
                style={styles.image}
              />
            ) : (
              <View className="absolute inset-0 flex items-center justify-center">
                <MaterialIcons name="hide-image" size={32} color="#1f2937" />
                <Text className="text-gray-800 font-poppins-semibold">
                  No Image
                </Text>
              </View>
            )}
          </View>

          <View className="flex-1 justify-between">
            <Text className="font-poppins-semibold text-sm text-gray-800">
              {selectedEvent?.name}
            </Text>

            <View className="flex-row items-center gap-2">
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
                  ? formatEventLabel(selectedEvent.classifications.category)
                  : "Unknown"}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
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

            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="calendar-blank-outline"
                size={16}
                color="#1f2937"
              />
              <Text className="font-dm-sans text-gray-800">
                {formatEventDateTime(
                  selectedEvent?.dates?.start?.date,
                  selectedEvent?.dates?.start?.time,
                )}
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
    </SimpleContainer>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

export default MapScreen;
