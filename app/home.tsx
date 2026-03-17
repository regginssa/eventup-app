import eventServices from "@/api/services/event";
import { Button, Input, NormalModal, Tabs } from "@/components/common";
import { EventFilterModal, EventsPreviewGroup } from "@/components/molecules";
import { LayoutContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { TDropdownItem, TPagination } from "@/types";
import { IEvent } from "@/types/event";
import { Country, RegionType } from "@/types/location.types";
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const tabs: TDropdownItem[] = [
  {
    label: "Discovery",
    value: "ai",
    icon: <AntDesign name="api" size={14} color="#844AFF" />,
  },
  {
    label: "Community",
    value: "user",
    icon: <Feather name="users" size={14} color="#C427E0" />,
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
  const [goToPage, setGoToPage] = useState<number>(1);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [country, setCountry] = useState<Country | null>(null);
  const [region, setRegion] = useState<RegionType | null>(null);
  const [category, setCategory] = useState<TDropdownItem | null>(null);
  const [isPageOpen, setIsPageOpen] = useState<boolean>(false);

  const router = useRouter();
  const { user } = useAuth();

  const fetchFeed = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await eventServices.getFeed(
        user?._id || null,
        selectedTab.value as any,
        startDate as any,
        country?.cca2 as any,
        region?.code as any,
        category?.value as any,
        page,
        pagination.limit,
      );

      if (response.ok) {
        setEvents(response.data.events);
        setPagination(response.data.pagination);
        setGoToPage(response.data.pagination.page);
      }
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(1);
  }, [selectedTab]);

  const handleNext = () => {
    if (pagination.page < Math.ceil(pagination.total / pagination.limit)) {
      fetchFeed(pagination.page + 1);
    }
  };

  const handlePrev = () => {
    if (pagination.page > 1) {
      fetchFeed(pagination.page - 1);
    }
  };

  const handleGoToPage = (page: number) => {
    const totalPages = Math.ceil(pagination.total / pagination.limit);
    if (page >= 1 && page <= totalPages) {
      fetchFeed(page);
      setIsPageOpen(false);
    }
  };

  const handleFilterApply = async () => {
    setIsFilterOpen(false);
    await fetchFeed(1);
  };

  const handleRefresh = async () => {
    await fetchFeed(pagination.page);
  };

  const handleFilterReset = async () => {
    setStartDate(null);
    setCountry(null);
    setRegion(null);
    setCategory(null);
    setIsFilterOpen(false);
    await fetchFeed(1);
  };

  return (
    <LayoutContainer title="Events">
      {/* HEADER SECTION */}
      <View className="w-full gap-5 mb-4">
        <View className="w-full flex flex-row items-center gap-3">
          <View className="flex-1">
            <Input
              type="string"
              placeholder="Search events"
              className="rounded-full h-12"
              icon={<Feather name="search" size={16} color="#4b5563" />}
              value={search}
              onChange={setSearch}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            className={`w-12 h-12 rounded-full flex items-center justify-center bg-white`}
            style={styles.shadow}
            onPress={() => setIsPageOpen(true)}
          >
            <MaterialIcons name="pages" size={20} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            className={`w-12 h-12 rounded-full flex items-center justify-center bg-white`}
            style={styles.shadow}
            onPress={() => setIsFilterOpen(true)}
          >
            <MaterialIcons name="tune" size={20} color="#4b5563" />
            {[startDate, country, region, category].filter((f) => f !== null)
              .length > 0 && (
              <View className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center border-2 border-white">
                <Text className="font-poppins-semibold text-white text-[10px]">
                  {
                    [startDate, country, region, category].filter(
                      (f) => f !== null,
                    ).length
                  }
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            className={`w-12 h-12 rounded-full flex items-center justify-center bg-white`}
            style={styles.shadow}
            onPress={() => router.push("/map")}
          >
            <MaterialIcons name="map" size={20} color="#4b5563" />
          </TouchableOpacity>
        </View>

        <View className="w-full flex flex-row items-center justify-between px-1">
          <View className="flex flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-emerald-500" />
            <Text
              className={`font-poppins-semibold text-[11px] uppercase tracking-widest text-gray-500`}
            >
              {pagination.total.toLocaleString()} events available
            </Text>
          </View>
          <Text className={`font-poppins-semibold text-[11px] text-gray-500`}>
            Page {pagination.page}/
            {Math.ceil(pagination.total / pagination.limit) || 1}
          </Text>
        </View>
      </View>

      {/* TABS */}
      <View className="flex-1 rounded-3xl p-6 bg-white">
        <Tabs
          tabs={tabs}
          tabClassName="flex-1 h-11 rounded-xl"
          selectedTab={selectedTab}
          onSelct={setSelectedTab}
        />

        {/* LIST FEED */}
        <View className="flex-1 mt-4">
          <EventsPreviewGroup
            events={events}
            loading={loading}
            onReachedBottomChange={setIsBottom}
            onRefresh={handleRefresh}
          />
        </View>
      </View>

      {/* PAGINATION: PREV & NEXT BUTTONS (Absolute Centered) */}
      {events.length > 0 && (
        <View
          pointerEvents="box-none"
          className="absolute w-full top-1/2 left-0 right-0 flex flex-row items-center justify-between px-2"
        >
          <TouchableOpacity
            activeOpacity={0.8}
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              pagination.page === 1 || loading
                ? "bg-gray-100 opacity-50"
                : "bg-white"
            }`}
            disabled={pagination.page === 1 || loading}
            style={styles.shadow}
            onPress={handlePrev}
          >
            <AntDesign
              name="arrow-left"
              size={22}
              color={pagination.page === 1 ? "#9ca3af" : "#844AFF"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className={`w-14 h-14 rounded-full flex items-center justify-center ${
              !pagination.hasMore || loading
                ? "bg-gray-100 opacity-50"
                : "bg-white"
            }`}
            disabled={!pagination.hasMore || loading}
            style={styles.shadow}
            onPress={handleNext}
          >
            <AntDesign
              name="arrow-right"
              size={22}
              color={!pagination.hasMore ? "#9ca3af" : "#C427E0"}
            />
          </TouchableOpacity>
        </View>
      )}

      <EventFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        startDate={startDate}
        country={country}
        region={region}
        category={category}
        onStartDatePick={setStartDate}
        onCountryPick={setCountry}
        onRegionPick={setRegion}
        onCategoryChange={setCategory}
        onApply={handleFilterApply}
        onReset={handleFilterReset}
      />

      <NormalModal
        title=""
        isOpen={isPageOpen}
        onClose={() => setIsPageOpen(false)}
      >
        <View className="gap-4">
          <Text className={`font-poppins-semibold text-[11px] text-gray-500`}>
            Page {pagination.page}/
            {Math.ceil(pagination.total / pagination.limit) || 1}
          </Text>
          <Input
            type="number"
            placeholder="Page"
            bordered
            icon={<MaterialIcons name="pages" size={16} color="#4b5563" />}
            value={goToPage}
            onChange={setGoToPage}
          />
          <Button
            type="primary"
            label="Go"
            icon={
              <MaterialCommunityIcons
                name="arrow-right"
                color="white"
                size={16}
              />
            }
            iconPosition="right"
            onPress={() => handleGoToPage(goToPage)}
          />
        </View>
      </NormalModal>
    </LayoutContainer>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
});

export default HomeScreen;
