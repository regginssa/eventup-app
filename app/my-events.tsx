import { fetchEventsByUser } from "@/api/scripts/event";
import { Tabs } from "@/components/common";
import { EventsPreviewGroup } from "@/components/molecules";
import { MyEventsScreenContainer } from "@/components/organisms";
import { RootState } from "@/redux/store";
import { TDropdownItem } from "@/types";
import { IEvent, TEventStatus } from "@/types/event";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useSelector } from "react-redux";

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
    label: "Pending",
    value: "pending",
    icon: (
      <MaterialCommunityIcons
        name="calendar-clock-outline"
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
];

const MyEventsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<TDropdownItem>(tabs[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<IEvent[]>([]);

  const { user } = useSelector((state: RootState) => state.auth);

  const fetchEvents = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);

      const response = await fetchEventsByUser(
        user._id,
        selectedTab.value as TEventStatus
      );

      if (response.ok) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error("fetch created events error: ", error);
      Alert.alert("Error", "Failed to fetch created events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [selectedTab]);

  return (
    <MyEventsScreenContainer>
      <Tabs
        tabs={tabs}
        tabClassName="flex-1"
        selectedTab={selectedTab}
        onSelct={setSelectedTab}
      />
      <EventsPreviewGroup events={events} loading={loading} />
    </MyEventsScreenContainer>
  );
};

export default MyEventsScreen;
