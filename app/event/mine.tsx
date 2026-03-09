import BookingAPI from "@/api/services/booking";
import eventServices from "@/api/services/event";
import { Tabs } from "@/components/common";
import { EventsPreviewGroup } from "@/components/molecules";
import { MyEventsScreenContainer } from "@/components/organisms";
import { useAuth } from "@/components/providers/AuthProvider";
import { TDropdownItem } from "@/types";
import { IEvent, TEventStatus } from "@/types/event";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

const tabs: TDropdownItem[] = [
  {
    label: "Open",
    value: "open",
    icon: (
      <MaterialCommunityIcons
        name="calendar-plus-outline"
        size={16}
        color="#1f2937"
      />
    ),
  },
  {
    label: "Completed",
    value: "completed",
    icon: (
      <MaterialCommunityIcons
        name="calendar-check-outline"
        size={16}
        color="#1f2937"
      />
    ),
  },
  {
    label: "Booked",
    value: "booked",
    icon: (
      <MaterialCommunityIcons name="cart-check" size={16} color="#1f2937" />
    ),
  },
];

const MyEventsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<TDropdownItem>(tabs[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<IEvent[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!user?._id) return;
      setLoading(true);

      try {
        if (selectedTab.value === "booked") {
          const response = await BookingAPI.getAllByUserId(user._id);
          if (response.data) {
            const events = response.data.map((booking) => booking.event);
            setEvents(events);
          }
        } else {
          const response = await eventServices.getByUserId(
            user._id,
            selectedTab.value as TEventStatus,
          );
          if (response.ok) {
            setEvents(response.data);
          }
        }
      } catch (error) {}

      setLoading(false);
    };

    loadData();
  }, [selectedTab]);

  return (
    <MyEventsScreenContainer>
      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        tabClassName="flex-1"
        onSelct={setSelectedTab}
      />
      <EventsPreviewGroup events={events} loading={loading} />
    </MyEventsScreenContainer>
  );
};

export default MyEventsScreen;
