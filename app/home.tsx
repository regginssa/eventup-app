import { fetchEventsFeed } from "@/api/scripts/event";
import { Input } from "@/components/common";
import { EventsPreviewGroup } from "@/components/molecules";
import { HomeContainer } from "@/components/organisms";
import { setAllEvents, setPagination } from "@/redux/slices/event.slice";
import { RootState } from "@/redux/store";
import { TDropdownItem } from "@/types";
import { IEvent } from "@/types/data";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const HomeScreen = () => {
  const [orderedEvents, setOrderedEvents] = useState<IEvent[]>([]);
  const [search, setSearch] = useState<string>("");
  const [isBottom, setIsBottom] = useState<boolean>(false);
  const [categories, setCategories] = useState<TDropdownItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const { events, pagination } = useSelector((state: RootState) => state.event);
  const dispatch = useDispatch();

  const handleNext = async () => {
    if (!user?._id || !pagination.hasMore) return;

    const nextPage = pagination.page + 1;

    try {
      setLoading(true);

      const response = await fetchEventsFeed(
        user._id,
        nextPage,
        pagination.limit
      );

      if (response.ok) {
        dispatch(setPagination(response.data.pagination));
        setOrderedEvents(response.data.events);
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
        dispatch(setPagination(response.data.pagination));
        setOrderedEvents(response.data.events);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFeed = useCallback(async () => {
    if (!user?._id) return;
    try {
      setLoading(true);

      dispatch(setPagination({ ...pagination, page: 1, total: 0 }));

      const response = await fetchEventsFeed(user._id, 1, 10);

      if (response.ok) {
        const { events, pagination } = response.data;

        dispatch(setAllEvents(events));
        dispatch(
          setPagination({
            ...pagination,
            page: 1,
          })
        );

        setOrderedEvents(events);
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

        {/* <View className="w-full gap-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <FilterItemDropdown
              label="Category"
              items={EVENT_CATEGORIES}
              selectedItems={categories}
              onSelect={(val: TDropdownItem) => {
                if (categories.some((ca) => ca.value === val.value)) {
                  setCategories(
                    categories.filter((ca) => ca.value !== val.value)
                  );
                } else {
                  setCategories([...categories, val]);
                }
              }}
            />
            <FilterItemDropdown
              label="Upcoming"
              items={EVENT_CATEGORIES}
              selectedItems={categories}
              onSelect={(val: TDropdownItem) => {
                if (categories.some((ca) => ca.value === val.value)) {
                  setCategories(
                    categories.filter((ca) => ca.value !== val.value)
                  );
                } else {
                  setCategories([...categories, val]);
                }
              }}
            />
            <FilterItemDropdown
              label="Date"
              items={EVENT_CATEGORIES}
              selectedItems={categories}
              onSelect={(val: TDropdownItem) => {
                if (categories.some((ca) => ca.value === val.value)) {
                  setCategories(
                    categories.filter((ca) => ca.value !== val.value)
                  );
                } else {
                  setCategories([...categories, val]);
                }
              }}
            />
          </ScrollView>

          {categories.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              {categories.map((ca, index) => (
                <View
                  key={ca.value}
                  className="bg-white flex flex-row items-center justify-center gap-2 rounded-lg p-2"
                >
                  <Text className="text-gray-700 font-dm-sans text-sm">
                    {formatEventLabel(ca.label)}
                  </Text>
                  <Pressable
                    hitSlop={6}
                    className="w-6 h-6 rounded-full bg-[#E5E7EB] flex items-center justify-center"
                    onPress={() =>
                      setCategories(
                        categories.filter((c) => c.value !== ca.value)
                      )
                    }
                  >
                    <AntDesign name="close" size={10} color="#4b5563" />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}
        </View> */}

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

      <View className="flex-1 ">
        <EventsPreviewGroup
          events={orderedEvents}
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
              pagination.page === 1 || loading ? "bg-gray-200" : "bg-white"
            }`}
            disabled={pagination.page === 1 || loading}
            style={styles.tune}
            onPress={handlePrev}
          >
            <AntDesign
              name="arrow-left"
              size={24}
              color={pagination.page === 1 || loading ? "#9ca3af" : "#1f2937"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-gray-400 ${
              !pagination.hasMore || loading ? "bg-gray-200" : "bg-white"
            }`}
            disabled={!pagination.hasMore || loading}
            style={styles.tune}
            onPress={handleNext}
          >
            <AntDesign
              name="arrow-right"
              size={24}
              color={!pagination.hasMore || loading ? "#9ca3af" : "#1f2937"}
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
