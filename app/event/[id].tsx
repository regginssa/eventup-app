import { fetchEvent } from "@/api/services/event";
import { Spinner, Tabs } from "@/components/common";
import {
  EventDetailContainer,
  EventDetailEmpty,
  EventDetailHeader,
  EventDetailItinerary,
  EventDetailOverview,
  EventDetailPackages,
} from "@/components/organisms";
import { RootState } from "@/store";
import {
  setBookingFlight,
  setBookingHotel,
} from "@/store/slices/booking.slice";
import { TCoordinate, TDropdownItem } from "@/types";
import { EventDates, IEvent } from "@/types/event";
import { formatEventLabel } from "@/utils/format";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const tabs: TDropdownItem[] = [
  { label: "Packages", value: "packages" },
  { label: "Overview", value: "overview" },
  { label: "Itinerary", value: "itinerary" },
];

const EventDetailScreen = () => {
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const [eventType, setEventType] = useState<"ai" | "user">("ai");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<TDropdownItem>(tabs[0]);
  const [currentLocationCoords, setCurrentLocationCoords] =
    useState<TCoordinate | null>(null);
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [currentCountryCode, setCurrentCountryCode] = useState<string | null>(
    null
  );

  const { id, type } = useLocalSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const getUserLocationAndSave = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Location permission not granted");
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  };

  const fetchEventData = async () => {
    if (!id || typeof id !== "string") return;
    try {
      const response = await fetchEvent(id);

      setEvent(response.data);
      setEventType(type as "ai" | "user");
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const fetchUserCurrentLocation = async () => {
    if (!user?.location.coordinate) return;
    const coords = await getUserLocationAndSave();

    setCurrentLocationCoords(coords);
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        setCurrentCity(address.city || address.region || null);
        setCurrentCountryCode(address.isoCountryCode || null);
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  const init = useCallback(async () => {
    setLoading(true);
    await fetchEventData();
    await fetchUserCurrentLocation();
    dispatch(setBookingFlight(null));
    dispatch(setBookingHotel(null));
    setLoading(false);
  }, [id]);

  useEffect(() => {
    init();
  }, []);

  return (
    <EventDetailContainer>
      <View className="flex-1 gap-6">
        {loading ? (
          <Spinner size="md" />
        ) : event ? (
          <>
            <EventDetailHeader
              image={event.images?.[0] as string}
              title={event.name as string}
              category={formatEventLabel(
                event.classifications?.category as string
              )}
              city={event.location?.city?.name}
              country={event.location?.country?.name as string}
              dates={event.dates as EventDates}
            />

            <View className="flex-1 bg-white rounded-2xl p-4 gap-6">
              <Tabs
                tabs={tabs}
                selectedTab={selectedTab}
                onSelct={setSelectedTab}
                tabClassName="flex-1"
              />

              {selectedTab.value === "packages" ? (
                <EventDetailPackages
                  event={event}
                  currentLocationCoords={currentLocationCoords}
                  currentCity={currentCity}
                  currentCountryCode={currentCountryCode}
                />
              ) : selectedTab.value === "overview" ? (
                <EventDetailOverview
                  hoster={
                    event.hoster
                      ? {
                          _id: event.hoster._id ?? "",
                          avatar: event.hoster.avatar ?? "",
                          title: event.hoster.title ?? "",
                          countryCode:
                            event.hoster.location?.country?.code ?? "",
                          countryName:
                            event.hoster.location?.country?.name ?? "",
                          is_verified: event.hoster.idVerified ?? false,
                        }
                      : undefined
                  }
                  description={event.description}
                />
              ) : (
                <EventDetailItinerary />
              )}
            </View>
          </>
        ) : (
          <EventDetailEmpty />
        )}
      </View>
    </EventDetailContainer>
  );
};

export default EventDetailScreen;
