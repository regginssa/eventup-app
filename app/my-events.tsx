import { fetchBooking } from "@/api/scripts/booking";
import { fetchEvent } from "@/api/scripts/event";
import { Tabs } from "@/components/common";
import { EventsPreviewGroup } from "@/components/molecules";
import { MyEventsScreenContainer } from "@/components/organisms";
import { RootState } from "@/redux/store";
import { TDropdownItem } from "@/types";
import { IEvent } from "@/types/data";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const tabs: TDropdownItem[] = [
  { label: "Booked", value: "booked" },
  { label: "Created", value: "created" },
  { label: "Completed", value: "completed" },
];

const MyEventsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<TDropdownItem>(tabs[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<IEvent[]>([]);

  const { user } = useSelector((state: RootState) => state.auth);

  const fetchBookedEvents = useCallback(async (userId: string) => {
    try {
      const bookingRes = await fetchBooking(userId);

      if (bookingRes.ok) {
        const { eventId } = bookingRes.data;

        const eventRes = await fetchEvent(eventId);
        if (eventRes.ok) {
          setEvents((prev) => [...prev, eventRes.data]);
        }
      }
    } catch (error) {
      console.error("fetch booked events error: ", error);
    }
  }, []);

  useEffect(() => {});

  return (
    <MyEventsScreenContainer>
      <Tabs
        tabs={tabs}
        selectedTab={selectedTab}
        onSelct={setSelectedTab}
        tabClassName="flex-1"
      />

      <EventsPreviewGroup events={[]} />
    </MyEventsScreenContainer>
  );
};

export default MyEventsScreen;
