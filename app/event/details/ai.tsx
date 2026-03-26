import bookingServices from "@/api/services/booking";
import eventServices from "@/api/services/event";
import {
  EventDetailContainer,
  EventDetailEmpty,
  EventDetailHeader,
  EventDetailItinerary,
  EventDetailOverview,
  EventDetailPackages,
  Spinner,
  Tabs,
} from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { TCoordinate, TDropdownItem } from "@/types";
import { IBooking } from "@/types/booking";
import { IEvent } from "@/types/event";
import { formatEventLabel } from "@/utils/format";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";

const initialTabs = [
  { label: "Packages", value: "packages" },
  { label: "Overview", value: "overview" },
  { label: "Itinerary", value: "itinerary" },
];

const AIEventDetail = () => {
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<TDropdownItem>({
    label: "Packages",
    value: "packages",
  });
  const [currentLocationCoords, setCurrentLocationCoords] =
    useState<TCoordinate | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    city: string | null;
    countryCode: string | null;
  }>({ city: null, countryCode: null });
  const [booking, setBooking] = useState<IBooking | null>(null);

  const { id, callback } = useLocalSearchParams();
  const { user } = useAuth();

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
      const response = await eventServices.get(id);

      setEvent(response.data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const fetchUserCurrentLocation = async () => {
    const coords = await getUserLocationAndSave();

    setCurrentLocationCoords(coords);
    try {
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const address = reverseGeocode[0];
        setCurrentLocation({
          city: address.city || address.region || null,
          countryCode: address.isoCountryCode || null,
        });
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  const fetchBookingData = async () => {
    if (!user?._id || !id) return;

    try {
      const response = await bookingServices.getByUserIdAndEventId(
        user._id,
        id as string,
      );

      if (response.data) {
        setBooking(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!id) return;
      setLoading(true);
      await fetchEventData();
      const bookingData = await fetchBookingData();

      if (!bookingData) {
        await fetchUserCurrentLocation();
      }

      setLoading(false);
    };

    init();
  }, [id]);

  const renderContent = () => {
    if (loading) {
      return <Spinner size="md" text="Loading Event Details..." />;
    } else if (!event) {
      return <EventDetailEmpty />;
    } else if (event) {
      return (
        <>
          <EventDetailHeader
            image={event.images?.[0] as string}
            title={event.name as string}
            category={formatEventLabel(
              event.classifications?.category as string,
            )}
            city={event.location?.city?.name}
            country={event.location?.country?.name as string}
            dates={event.dates as any}
            fee={event.type === "user" ? event.fee : undefined}
          />

          <View className="flex-1 bg-white rounded-3xl p-4 gap-6 border border-slate-100 shadow-sm">
            <Tabs
              tabs={initialTabs}
              selectedTab={selectedTab}
              onSelct={setSelectedTab}
              tabClassName="flex-1"
            />
            {renderTabContent()}
          </View>
        </>
      );
    }
  };

  const renderTabContent = () => {
    if (!event) return;

    switch (selectedTab.value) {
      case "packages":
        return (
          <EventDetailPackages
            event={event}
            currentLocationCoords={currentLocationCoords}
            currentLocation={currentLocation}
          />
        );
      case "overview":
        return (
          <EventDetailOverview
            hoster={
              event.hoster
                ? {
                    _id: event.hoster._id ?? "",
                    avatar: event.hoster.avatar ?? "",
                    title: event.hoster.title ?? "",
                    countryCode: event.hoster.location?.country?.code ?? "",
                    countryName: event.hoster.location?.country?.name ?? "",
                    is_verified: event.hoster.idVerified ?? false,
                  }
                : undefined
            }
            description={event.description}
            eventType={event.type as any}
          />
        );
      default:
        return <EventDetailItinerary booking={booking} />;
    }
  };

  return (
    <EventDetailContainer callback={callback as any}>
      <View className="flex-1 gap-6">{renderContent()}</View>
    </EventDetailContainer>
  );
};

export default AIEventDetail;
