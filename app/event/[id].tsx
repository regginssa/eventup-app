import { fetchBookingByUserIdAndEventId } from "@/api/services/booking";
import eventServices from "@/api/services/event";
import notificationServices from "@/api/services/notification";
import userServices from "@/api/services/user";
import { AttendeesCardGroup } from "@/components";
import { Button, Spinner, Tabs } from "@/components/common";
import {
  EventDetailContainer,
  EventDetailEmpty,
  EventDetailHeader,
  EventDetailItinerary,
  EventDetailOverview,
  EventDetailPackages,
} from "@/components/organisms";
import { useAuth } from "@/components/providers/AuthProvider";
import { useBooking } from "@/components/providers/BookingProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { useNotification } from "@/components/providers/NotificationProvider";
import { useTicket } from "@/components/providers/TicketProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { TCoordinate, TDropdownItem } from "@/types";
import { IBooking } from "@/types/booking";
import { IConversation } from "@/types/conversation";
import { EventDates, IEvent, TAttendees } from "@/types/event";
import { INotification } from "@/types/notification";
import { ITicket } from "@/types/ticket";
import { IUser } from "@/types/user";
import { formatEventLabel } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

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
  const [currentCity, setCurrentCity] = useState<string | null>(null);
  const [currentCountryCode, setCurrentCountryCode] = useState<string | null>(
    null,
  );
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [services, setServices] = useState<string[]>([]);
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const [attendees, setAttendees] = useState<TAttendees | null>(null);
  const [releaseLoading, setReleaseLoading] = useState<boolean>(false);
  const [groupConversation, setGroupConversation] =
    useState<IConversation | null>(null);
  const { id, callback } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { tickets } = useTicket();
  const { setBookingFlight, setBookingHotel } = useBooking();
  const { send: sendNotification } = useNotification();
  const { conversations } = useConversation();
  const toast = useToast();

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
      setBookingFlight(null);
      setBookingHotel(null);
      return;
    }

    const att = fetchedEvent?.attendees.find((a) => a.user._id === user?._id);
    setAttendees(att || null);

    if (att) {
      await fetchBookingData();
      setTabs(userTabs);
      setBookingFlight(null);
      setBookingHotel(null);
      setLoading(false);
      return;
    }

    await fetchBookingData();
    await fetchUserCurrentLocation();
    setTabs(userTabs);
    setBookingFlight(null);
    setBookingHotel(null);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!user || !event?.fee) return;

    if (event.fee.type === "free") {
      setTicket(null);
    } else {
      const ticket = user.tickets.find(
        (t) =>
          t.currency === event.fee?.currency &&
          t.price === Number(event.fee.amount),
      );
      setTicket(ticket || null);
    }
  }, [user, event]);

  useEffect(() => {
    if (!event || !user?._id) return;
    const att = event.attendees.find((att) => att.user._id === user._id);
    setAttendees(att || null);
  }, [event, user?._id]);

  useEffect(() => {
    if (!attendees) return;
    const myTicket = tickets.find((t) => t._id === attendees.ticket?.ticketId);
    setTicket(myTicket || null);
  }, [attendees]);

  useEffect(() => {
    if (conversations.length === 0) return;
    const conv = conversations.find((c) => c.event?._id === event?._id);
    setGroupConversation(conv || null);
  }, [conversations, event, user?._id]);

  const handleUserTicketRelease = async () => {
    if (!event?._id || !attendees || !event.hoster?._id) return;

    try {
      setReleaseLoading(true);

      // Change the ticket status from event attendees
      const eventBodyData: IEvent = {
        ...event,
        attendees: event.attendees.map((att) =>
          att.user._id === user?._id
            ? { ...att, ticket: { ...att.ticket, status: "released" } }
            : att,
        ) as any,
      };

      const eventRes = await eventServices.update(event._id, eventBodyData);

      setEvent(eventRes.data || null);

      // Add ticket to the event hoster's tickets array
      const hosterBodyData: IUser = {
        ...event.hoster,
        tickets: [...event.hoster.tickets, attendees.ticket?.ticketId as any],
      };

      const hosterRes = await userServices.update(
        hosterBodyData._id as string,
        hosterBodyData,
      );

      // Send a notification to the event hoster
      if (hosterRes.ok) {
        // Create a new notification
        const newNotification: INotification = {
          type: "event_ticket_released",
          metadata: {
            eventId: event._id,
            ticketUserId: user?._id,
          },
          title: `A ticket has been released`,
          body: `${user?.name}'s ticket for the event "${event.name}" has been successfully released.`,
          isRead: false,
          isArchived: false,
          user: event.hoster._id as any,
          link: `/event/${event._id}`,
        };

        const notifyRes = await notificationServices.create(newNotification);
        if (notifyRes.data) {
          sendNotification({
            notificationId: notifyRes.data._id,
            userId: event.hoster._id,
          });
        }
      }
    } catch (error) {
      toast.error("Release ticket error");
    } finally {
      setReleaseLoading(false);
    }
  };

  return (
    <EventDetailContainer callback={callback as any}>
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
                  ticket={ticket}
                  attendees={attendees || undefined}
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
                <AttendeesCardGroup
                  items={event.attendees || []}
                  event={event}
                />
              ) : null}
            </View>

            {event.type === "user" &&
              (event.hoster?._id === user?._id ||
                conversations.some((c) =>
                  c.participants.some((p) => p._id === attendees?.user._id),
                )) && (
                <View className="w-full gap-4">
                  {event.hoster?._id === user?._id && (
                    <View className="w-full flex flex-row items-start gap-2 rounded-xl border border-blue-500 bg-blue-200 p-4">
                      <MaterialCommunityIcons
                        name="information-outline"
                        size={24}
                        color="#3b82f6"
                      />
                      <Text className="flex-1 font-dm-sans-medium text-sm text-blue-600">
                        A group chat allows you to easily manage and communicate
                        with your attendees.
                      </Text>
                    </View>
                  )}

                  {!groupConversation ? (
                    <Button
                      type="primary"
                      label="Create"
                      buttonClassName="h-12"
                      onPress={() =>
                        router.push({
                          pathname: "/conversation/create-group",
                          params: { eventId: event._id },
                        })
                      }
                    />
                  ) : (
                    <Button
                      type="primary"
                      label="Go to group chat"
                      buttonClassName="h-12"
                      onPress={() =>
                        router.push({
                          pathname: "/conversation/chat/group",
                          params: {
                            conversationId: groupConversation._id,
                          },
                        })
                      }
                    />
                  )}
                </View>
              )}
          </>
        ) : (
          <EventDetailEmpty />
        )}
      </View>

      {!loading &&
        user?._id !== event?.hoster?._id &&
        attendees &&
        attendees.ticket?.status === "deposited" && (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-full p-4 rounded-xl bg-green-600 flex flex-row items-center justify-center gap-2 mt-4"
              disabled={releaseLoading}
              onPress={handleUserTicketRelease}
            >
              <Text className="font-poppins-medium text-sm text-white">
                Release Ticket
              </Text>
              {releaseLoading && <ActivityIndicator size={16} color="white" />}
            </TouchableOpacity>
            {/* <TouchableOpacity
              activeOpacity={0.8}
              className="w-full p-4 rounded-xl bg-red-600 flex flex-row items-center justify-center gap-2 mt-4"
              disabled={cancelEntryLoading}
            >
              <Text className="font-poppins-medium text-sm text-white">
                Cancel Entry
              </Text>
              {cancelEntryLoading && (
                <ActivityIndicator size={16} color="white" />
              )}
            </TouchableOpacity> */}
          </>
        )}
    </EventDetailContainer>
  );
};

export default EventDetailScreen;
