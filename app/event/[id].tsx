import { fetchBookingByUserIdAndEventId } from "@/api/services/booking";
import { fetchEvent } from "@/api/services/event";
import { AttendeesCardGroup } from "@/components";
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
import { IBooking } from "@/types/booking";
import { EventDates, IEvent } from "@/types/event";
import { formatEventLabel } from "@/utils/format";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const userTabs: TDropdownItem[] = [
  { label: "Packages", value: "packages" },
  { label: "Overview", value: "overview" },
  { label: "Itinerary", value: "itinerary" },
];

const ownerTabs: TDropdownItem[] = [
  { label: "Attendees", value: "attendees" },
  { label: "Overview", value: "overview" },
];

const EventDetailScreen = () => {
  const [tabs, setTabs] = useState<TDropdownItem[]>([]);
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<TDropdownItem>(userTabs[0]);
  const [currentLocationCoords, setCurrentLocationCoords] =
    useState<TCoordinate | null>(null);
  ``;
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [currentCountryCode, setCurrentCountryCode] = useState<string | null>(
    null,
  );
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [services, setServices] = useState<string[]>([]);

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
      return response.data;
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

  const fetchBookingData = async () => {
    if (!user?._id || !id) return;

    try {
      const response = await fetchBookingByUserIdAndEventId(
        user._id,
        id as string,
      );

      if (response.data) {
        setBooking(response.data);

        const newServices: string[] = [];

        if (response.data.flight) newServices.push("Flight");
        if (response.data.hotel) newServices.push("Hotel");
        if (response.data.transfer?.ah) newServices.push("Transfer (A/H)");
        if (response.data.transfer?.he) newServices.push("Transfer (H/E)");

        setServices(newServices);
      }
    } catch (error) {}
  };

  const init = useCallback(async () => {
    setLoading(true);
    const fetchedEvent = await fetchEventData();

    if (
      fetchedEvent?.type === "user" &&
      fetchedEvent.hoster?._id === user?._id
    ) {
      setLoading(false);
      setTabs(ownerTabs);
      setSelectedTab(ownerTabs[0]);
      return;
    }
    await fetchBookingData();
    await fetchUserCurrentLocation();
    setTabs(userTabs);
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
                event.classifications?.category as string,
              )}
              city={event.location?.city?.name}
              country={event.location?.country?.name as string}
              dates={event.dates as EventDates}
              fee={event.type === "user" ? event.fee : undefined}
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
                  isBooked={!!booking}
                  services={services}
                  bookedPackageType={booking?.package || "standard"}
                  totalPrice={booking?.price.total || 0}
                  fee={event.type === "user" ? event.fee : undefined}
                  isTicketOwned={
                    event.type === "user" &&
                    event.fee &&
                    user?.tickets &&
                    user?.tickets.length > 0 &&
                    user?.tickets.some(
                      (t) =>
                        t.currency === event.fee?.currency &&
                        t.price === event.fee.amount,
                    )
                  }
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
                  eventType={event.type as any}
                />
              ) : selectedTab.value === "itinerary" ? (
                <EventDetailItinerary booking={booking} />
              ) : selectedTab.value === "attendees" ? (
                <AttendeesCardGroup items={event.attendees || []} />
              ) : null}
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
