import { fetchAllBookings } from "@/api/scripts/booking";
import { Spinner, Tabs } from "@/components/common";
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
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" },
];

const MyEventsScreen = () => {
  const [selectedTab, setSelectedTab] = useState<TDropdownItem>(tabs[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [events, setEvents] = useState<IEvent[]>([]);

  const { user } = useSelector((state: RootState) => state.auth);

  const fetchBookedEvents = useCallback(async (userId: string) => {
    try {
      const bookingRes = await fetchAllBookings(userId);

      if (bookingRes.ok) {
        const events = bookingRes.data
          .map((booking) => booking.event)
          .filter((event) => event != null);
        setEvents(events);
      }
    } catch (error) {
      console.error("fetch booked events error: ", error);
    }
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    fetchBookedEvents(user._id);
    setLoading(false);
  }, [user?._id]);

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
