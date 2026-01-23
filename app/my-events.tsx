import { Spinner, Tabs } from "@/components/common";
import { EventsPreviewGroup } from "@/components/molecules";
import { MyEventsScreenContainer } from "@/components/organisms";
import { RootState } from "@/redux/store";
import { TDropdownItem } from "@/types";
import { IEvent } from "@/types/event";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useSelector } from "react-redux";

const tabs: TDropdownItem[] = [
  {
    label: "Created",
    value: "created",
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
    label: "Booked",
    value: "booked",
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

  return (
    <MyEventsScreenContainer>
      <Tabs
        tabs={tabs}
        tabClassName="flex-1"
        selectedTab={selectedTab}
        onSelct={setSelectedTab}
      />
      {loading ? <Spinner size="md" /> : <EventsPreviewGroup events={events} />}
    </MyEventsScreenContainer>
  );
};

export default MyEventsScreen;
