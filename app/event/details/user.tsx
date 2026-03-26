import bookingServices from "@/api/services/booking";
import eventServices from "@/api/services/event";
import {
  AttendeesCardGroup,
  Button,
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
import { useCommunityTicket } from "@/components/providers/CommunityTicketProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { useNotification } from "@/components/providers/NotificationProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { TCoordinate, TDropdownItem } from "@/types";
import { IBooking } from "@/types/booking";
import { IConversation } from "@/types/conversation";
import { IAttendees, IEvent } from "@/types/event";
import { ICommunityTicket } from "@/types/ticket";
import { formatEventLabel } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

const UserEventDetail = () => {
  const [tabs, setTabs] = useState<TDropdownItem[]>([]);
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
  const [communityTicket, setCommunityTicket] =
    useState<ICommunityTicket | null>(null);
  const [myAttendees, setMyAttendees] = useState<IAttendees | null>(null);
  const [groupConversation, setGroupConversation] =
    useState<IConversation | null>(null);
  const [releaseLoading, setReleaseLoading] = useState<boolean>(false);
  const router = useRouter();
  const { id, callback } = useLocalSearchParams();
  const { user } = useAuth();
  const { communityTickets } = useCommunityTicket();
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
      }
    } catch (error) {}
  };

  useEffect(() => {
    const init = async () => {
      if (!id) return;
      setLoading(true);

      const eventData = await fetchEventData();

      if (eventData?.type === "user" && eventData.hoster?._id === user?._id) {
        setTabs(ownerTabs);
        setSelectedTab(ownerTabs[1]);
      } else {
        const att = eventData?.attendees.find((a) => a.user?._id === user?._id);
        setMyAttendees(att || null);
        setTabs(userTabs);

        if (!att) {
          await fetchUserCurrentLocation();
        } else {
          await fetchBookingData();
        }
      }

      setLoading(false);
    };

    init();
  }, [id]);

  useEffect(() => {
    if (!user || !event?.fee) return;

    if (event.fee.type === "free") {
      setCommunityTicket(null);
    } else {
      const ticket = user.tickets.find(
        (t) =>
          t.currency === event.fee?.currency &&
          t.price === Number(event.fee.amount),
      );
      setCommunityTicket(ticket || null);
    }
  }, [user, event]);

  useEffect(() => {
    if (!myAttendees) return;
    setTabs([
      { label: "Packages", value: "packages" },
      { label: "Overview", value: "overview" },
      { label: "Itinerary", value: "itinerary" },
    ]);
    setSelectedTab({ label: "Itinerary", value: "itinerary" });
    const ticket = communityTickets.find(
      (t) => t._id === myAttendees.ticket?.ticketId,
    );
    setCommunityTicket(ticket || null);
  }, [myAttendees]);

  useEffect(() => {
    if (conversations.length === 0) return;
    const conv = conversations.find((c) => c.event?._id === event?._id);
    setGroupConversation(conv || null);
  }, [conversations, event, user?._id]);

  // const handleUserTicketRelease = async () => {
  //   if (!event?._id || !myAttendees || !event.hoster?._id) return;

  //   try {
  //     setReleaseLoading(true);

  //     // Change the ticket status from event attendees
  //     const eventBodyData: IEvent = {
  //       ...event,
  //       attendees: event.attendees.map((att) =>
  //         att.user._id === user?._id
  //           ? { ...att, ticket: { ...att.ticket, status: "released" } }
  //           : att,
  //       ) as any,
  //     };

  //     const eventRes = await eventServices.update(event._id, eventBodyData);

  //     setEvent(eventRes.data || null);

  //     // Add ticket to the event hoster's tickets array
  //     const hosterBodyData: IUser = {
  //       ...event.hoster,
  //       tickets: [...event.hoster.tickets, myAttendees.ticket?.ticketId as any],
  //     };

  //     const hosterRes = await userServices.update(
  //       hosterBodyData._id as string,
  //       hosterBodyData,
  //     );

  //     // Send a notification to the event hoster
  //     if (hosterRes.ok) {
  //       // Create a new notification
  //       const newNotification: INotification = {
  //         type: "event_ticket_released",
  //         metadata: {
  //           eventId: event._id,
  //           ticketUserId: user?._id,
  //         },
  //         title: `A ticket has been released`,
  //         body: `${user?.name}'s ticket for the event "${event.name}" has been successfully released.`,
  //         isRead: false,
  //         isArchived: false,
  //         user: event.hoster._id as any,
  //         link: `/event/details/${event.type}/${event._id}`,
  //       };

  //       const notifyRes = await notificationServices.create(newNotification);
  //       if (notifyRes.data) {
  //         sendNotification({
  //           notificationId: notifyRes.data._id,
  //           userId: event.hoster._id,
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     toast.error("Release ticket error");
  //   } finally {
  //     setReleaseLoading(false);
  //   }
  // };

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
              tabs={tabs}
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
            communityTicket={communityTicket || undefined}
            booking={booking || undefined}
          />
        );
      case "overview":
        return (
          <EventDetailOverview
            hoster={
              event.hoster
                ? {
                    _id: event.hoster?._id || "",
                    avatar: event.hoster?.avatar || "",
                    title: event.hoster?.title || "",
                    countryCode: event.hoster?.location?.country?.code || "",
                    countryName: event.hoster?.location?.country?.name || "",
                    is_verified: event.hoster?.idVerified || false,
                  }
                : undefined
            }
            description={event.description}
            eventType={event.type as any}
          />
        );
      case "attendees":
        return <AttendeesCardGroup items={event.attendees} event={event} />;
      default:
        return (
          <EventDetailItinerary
            booking={booking}
            communityTicket={communityTicket || undefined}
          />
        );
    }
  };

  const renderFooter = () => {
    if (!event) return null;
    return (
      <>
        {event.type === "user" &&
          (event.hoster?._id === user?._id ||
            conversations.some((c) =>
              c.participants.some((p) => p._id === myAttendees?.user?._id),
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

              {!groupConversation && !myAttendees ? (
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
              ) : groupConversation ? (
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
              ) : null}
            </View>
          )}

        {!loading &&
          user?._id !== event?.hoster?._id &&
          myAttendees &&
          myAttendees.ticket?.status === "deposited" && (
            <>
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-full p-4 rounded-xl bg-green-600 flex flex-row items-center justify-center gap-2 mt-4"
                disabled={releaseLoading}
                // onPress={handleUserTicketRelease}
              >
                <Text className="font-poppins-medium text-sm text-white">
                  Release Ticket
                </Text>
                {releaseLoading && (
                  <ActivityIndicator size={16} color="white" />
                )}
              </TouchableOpacity>
            </>
          )}
      </>
    );
  };

  return (
    <EventDetailContainer callback={callback as any}>
      <View className="flex-1 gap-6">
        {renderContent()}
        {renderFooter()}
      </View>
    </EventDetailContainer>
  );
};

export default UserEventDetail;
