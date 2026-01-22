import { fetchEventsFeed } from "@/api/scripts/event";
import { Input, Tabs } from "@/components/common";
import { EventsPreviewGroup } from "@/components/molecules";
import { HomeContainer } from "@/components/organisms";
import { RootState } from "@/redux/store";
import { TDropdownItem, TPagination } from "@/types";
import { IEvent } from "@/types/event";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const tabs: TDropdownItem[] = [
  {
    label: "AI-Generated",
    value: "ai",
    icon: <AntDesign name="open-ai" size={16} color="#374151" />,
  },
  {
    label: "User-Created",
    value: "user",
    icon: <AntDesign name="user" size={16} color="#374151" />,
  },
];

const HomeScreen = () => {
  const [selectedTab, setSelectedTab] = useState<TDropdownItem>(tabs[0]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<TPagination>({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: true,
  });

  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleNext = async () => {
    if (!user?._id) return;

    const nextPage = pagination.page + 1;
    if (nextPage > Math.ceil(pagination.total / pagination.limit)) return;

    try {
      setLoading(true);

      const response = await fetchEventsFeed(
        user._id,
        nextPage,
        pagination.limit
      );

      if (response.ok) {
        setPagination(response.data.pagination);
        setEvents(response.data.events);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = async () => {
    if (!user?._id) return;

    const prevPage = pagination.page - 1;
    if (prevPage <= 0) return;

    try {
      setLoading(true);

      const response = await fetchEventsFeed(
        user._id,
        prevPage,
        pagination.limit
      );

      if (response.ok) {
        setPagination(response.data.pagination);
        setEvents(response.data.events);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFeed = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoading(true);

      setPagination({ ...pagination, page: 1, total: 0 });

      const response = await fetchEventsFeed(user._id, 1, 10);

      if (response.ok) {
        const { events, pagination } = response.data;

        setPagination({ ...pagination, page: 1 });

        setEvents(events);
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <HomeContainer>
      <View className="w-full gap-5">
        <View className="w-full flex flex-row items-center gap-3">
          <View className="flex-1">
            <Input
              type="string"
              placeholder="Search"
              className="rounded-full"
              icon={<Feather name="search" size={16} color="#4b5563" />}
              value={search}
              onChange={setSearch}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-[60px] h-[46px] bg-white rounded-full flex items-center justify-center"
            style={styles.tune}
          >
            <MaterialIcons name="tune" size={20} color="#4b5563" />
          </TouchableOpacity>
        </View>

        <View className="w-full flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialIcons name="event-available" size={24} color="#374151" />
            <Text className="font-poppins-semibold text-sm text-gray-700">
              {pagination.total.toLocaleString("en-US")} events are available
            </Text>
          </View>

          <View className="flex flex-row items-center gap-2">
            <Text className="font-poppins-semibold text-sm text-gray-700">
              Page: {pagination.page}/
              {Math.ceil(pagination.total / pagination.limit)}
            </Text>
          </View>
        </View>
      </View>

      <Tabs
        tabs={tabs}
        tabClassName="flex-1"
        selectedTab={selectedTab}
        onSelct={setSelectedTab}
      />

      <View className="flex-1 ">
        <EventsPreviewGroup
          events={events}
          loading={loading}
          onReachedBottomChange={setIsBottom}
        />
      </View>

      {/* Navigation buttons */}
      {events.length > 0 && (
        <View className="absolute w-full top-1/2 flex flex-row items-center justify-between">
          <TouchableOpacity
            activeOpacity={0.8}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-gray-400 ${
              pagination.page === 1 || loading || !pagination.hasMore
                ? "bg-gray-200"
                : "bg-white"
            }`}
            disabled={pagination.page === 1 || loading || !pagination.hasMore}
            style={styles.tune}
            onPress={handlePrev}
          >
            <AntDesign
              name="arrow-left"
              size={24}
              color={
                pagination.page === 1 || loading || !pagination.hasMore
                  ? "#9ca3af"
                  : "#1f2937"
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-gray-400 ${
              loading || !pagination.hasMore ? "bg-gray-200" : "bg-white"
            }`}
            disabled={loading || !pagination.hasMore}
            style={styles.tune}
            onPress={handleNext}
          >
            <AntDesign
              name="arrow-right"
              size={24}
              color={loading || !pagination.hasMore ? "#9ca3af" : "#1f2937"}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Map button */}
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-white absolute bottom-[80px] right-[50px] w-24 h-10 rounded-full flex flex-row items-center justify-center gap-2"
        style={styles.tune}
        onPress={() => router.replace("/map")}
      >
        <MaskedView
          style={{ width: 18, height: 18 }}
          maskElement={<Feather name="map" size={18} color="#374151" />}
        >
          <LinearGradient
            colors={["#C427E0", "#844AFF", "#12A9FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        </MaskedView>

        <MaskedView
          style={{ width: 32, height: 18 }}
          maskElement={<Text className="font-poppins">Map</Text>}
        >
          <LinearGradient
            colors={["#C427E0", "#844AFF", "#12A9FF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
          />
        </MaskedView>
      </TouchableOpacity>
    </HomeContainer>
  );
};

const styles = StyleSheet.create({
  tune: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default HomeScreen;
