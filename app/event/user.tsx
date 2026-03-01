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
import { TCoordinate, TDropdownItem } from "@/types";
import { IBooking } from "@/types/booking";
import { IAttendees, IEvent } from "@/types/event";
import { ICommunityTicket } from "@/types/ticket";
import { formatEventLabel } from "@/utils/format";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

const UserEventDetail = () => {
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
  const [services, setServices] = useState<string[]>([]);
  const [communityTicket, setCommunityTicket] =
    useState<ICommunityTicket | null>(null);
  const [attendees, setAttendees] = useState<IAttendees | null>(null);

  const { id, callback } = useLocalSearchParams();

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

          <View className="flex-1 bg-white rounded-2xl p-4 gap-6">
            <Tabs
              tabs={[
                { label: "Packages", value: "packages" },
                { label: "Overview", value: "overview" },
                { label: "Itinerary", value: "itinerary" },
              ]}
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
            isBooked={!!booking}
            services={services}
            bookedPackageType={booking?.package || "standard"}
            totalPrice={booking?.price.total || 0}
            fee={event.type === "user" ? event.fee : undefined}
            communityTicket={communityTicket}
            attendees={attendees || undefined}
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

export default UserEventDetail;
