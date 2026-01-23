import { Spinner, Tabs } from "@/components/common";
import { EventsPreviewGroup } from "@/components/molecules";
import { MyEventsScreenContainer } from "@/components/organisms";
import { RootState } from "@/redux/store";
import { TDropdownItem } from "@/types";
import { IEvent } from "@/types/event";
import { useState } from "react";
import { useSelector } from "react-redux";

const tabs: TDropdownItem[] = [
  { label: "Booked", value: "booked" },
  { label: "Created", value: "created" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

const MyEventsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<TDropdownItem>(tabs[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<IEvent[]>([]);

  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <MyEventsScreenContainer>
      {loading ? (
        <Spinner size="md" />
      ) : (
        <>
          <Tabs
            tabs={tabs}
            selectedTab={selectedTab}
            onSelct={setSelectedTab}
          />
          <EventsPreviewGroup events={events} />
        </>
      )}
    </MyEventsScreenContainer>
  );
};

export default MyEventsScreen;
