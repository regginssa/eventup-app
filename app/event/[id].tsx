import { fetchEvent } from "@/api/scripts/event";
import { Avatar, Button, Spinner, Tabs } from "@/components/common";
import {
  BookSearchInputGroup,
  PackageConfirmModal,
} from "@/components/molecules";
import { EventDetailContainer } from "@/components/organisms";
import {
  setBookingFlight,
  setBookingHotel,
} from "@/redux/slices/booking.slice";
import { RootState } from "@/redux/store";
import { TDropdownItem } from "@/types";
import { IEvent } from "@/types/data";
import { formatEventDate, formatEventLabel } from "@/utils/format";
import {
  Feather,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { FlagButton } from "react-native-country-picker-modal";
import { useDispatch, useSelector } from "react-redux";

const VerifiedBadge = require("@/assets/images/icons/verified_badge.png");

const tabs: TDropdownItem[] = [
  { label: "Packages", value: "packages" },
  { label: "Overview", value: "overview" },
  { label: "Itinerary", value: "itinerary" },
];

const EmptyEventData = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="flex-1 items-center justify-center gap-2">
        <MaterialCommunityIcons
          name="emoticon-sad-outline"
          size={48}
          color="#1f2937"
        />
        <Text className="text-gray-800 font-poppins-semibold">No Data</Text>
      </View>
    </View>
  );
};

const Header = ({
  image,
  title,
  category,
  city,
  country,
  opening_date,
}: {
  image: string;
  title: string;
  category: string;
  city?: string;
  country: string;
  opening_date: Date;
}) => {
  return (
    <View className="w-full gap-5 overflow-hidden">
      <Image
        source={image}
        alt={title}
        contentFit="cover"
        style={{ width: "100%", height: 212, borderRadius: 10 }}
      />
      <View className="gap-2">
        <Text className="font-poppins-semibold text-lg text-gray-800">
          {title}
        </Text>

        <View>
          <View className="flex flex-row items-center gap-2">
            <View className="w-4 h-4 rounded-full overflow-hidden">
              <LinearGradient
                colors={["#C427E0", "#844AFF", "#12A9FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View className="w-2 h-2 bg-white rounded-full"></View>
              </LinearGradient>
            </View>

            <Text className="font-dm-sans text-sm text-gray-700">
              {category}
            </Text>
          </View>
        </View>
      </View>

      {/* Dividier */}
      <View className="w-full h-[1px] bg-gray-200"></View>

      <View className="gap-2">
        <View className="flex flex-row items-center gap-2">
          <Fontisto name="map-marker-alt" size={20} color="#374151" />
          <Text className="font-dm-sans-medium text-sm text-gray-700">
            {city ? `${city}, ${country}` : country}
          </Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={16} color="#374151" />
          <Text className="font-dm-sans-medium text-sm text-gray-700">
            {formatEventDate(opening_date as Date)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const StandardPackage = ({ event }: { event: IEvent }) => {
  return (
    <View className="bg-[#F7F3FF] rounded-xl p-4 gap-3">
      <Text className="font-poppins-semibold text-lg text-gray-800">
        Standard
      </Text>

      <BookSearchInputGroup event={event} packageType="standard" />
    </View>
  );
};

const GoldPackage = ({ event }: { event: IEvent }) => {
  return (
    <View className="bg-[#F7F3FF] rounded-xl p-4 gap-3">
      <Text className="font-poppins-semibold text-lg text-gray-800">Gold</Text>

      <BookSearchInputGroup event={event} packageType="gold" />
    </View>
  );
};

const EventPackages = ({ event }: { event: IEvent }) => {
  const [eventPackage, setEventPackage] = useState<"standard" | "gold">(
    "standard",
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();
  const { flight, hotel, transfer } = useSelector(
    (state: RootState) => state.booking,
  );

  const standardItems = [
    "Event ticket",
    "Flights (economy)",
    "Mid-range hotel",
    "Basic airport-hotel-event transport",
  ];

  const goldItems = [
    "VIP ticket",
    "Premium flight",
    "Luxury hotel",
    "Private chauffeur/car on call",
  ];

  const handleOnConfirm = () => {
    setIsOpen(true);
  };

  return (
    <>
      <View className="flex-1 gap-4">
        <Text className="font-dm-sans-medium text-gray-400">
          Select your package
        </Text>

        <View className="w-full flex flex-row gap-4">
          {/* Standard */}
          <View className="bg-[#F7F3FF] rounded-xl w-[48%] h-[200px] p-4">
            <View className="flex-1 gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-full flex flex-row items-center gap-2"
                onPress={() => setEventPackage("standard")}
              >
                <View className="w-[18px] h-[18px] bg-gray-300 rounded-full relative z-0">
                  <View className="absolute inset-[1px] rounded-full bg-white flex items-center justify-center z-20">
                    {eventPackage === "standard" && (
                      <MaskedView
                        style={{ width: 16, height: 16 }}
                        maskElement={
                          <Ionicons
                            name="checkmark-circle-sharp"
                            size={16}
                            color="black"
                          />
                        }
                      >
                        <LinearGradient
                          colors={["#C427E0", "#844AFF", "#12A9FF"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{ flex: 1 }}
                        />
                      </MaskedView>
                    )}
                  </View>

                  {eventPackage === "standard" && (
                    <LinearGradient
                      colors={["#C427E0", "#844AFF", "#12A9FF"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 9,
                        zIndex: 10,
                      }}
                    />
                  )}
                </View>
                <Text className="font-poppins-semibold text-lg text-gray-800">
                  Standard
                </Text>
              </TouchableOpacity>

              <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 4 }}>
                {standardItems.map((item, index) => (
                  <View
                    key={index}
                    className="w-full flex flex-row items-start gap-1"
                  >
                    <MaterialCommunityIcons
                      name="checkbox-marked-circle-outline"
                      size={12}
                      color="#9ca3af"
                    />

                    <Text className="font-dm-sans text-sm text-gray-400 -mt-1">
                      {item}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Gold */}
          <View className="bg-[#F7F3FF] rounded-xl w-[48%] h-[200px] p-4">
            <View className="flex-1 gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-full flex flex-row items-center gap-2"
                onPress={() => setEventPackage("gold")}
              >
                <View className="w-[18px] h-[18px] bg-gray-300 rounded-full relative z-0">
                  <View className="absolute inset-[1px] rounded-full bg-white flex items-center justify-center z-20">
                    {eventPackage === "gold" && (
                      <MaskedView
                        style={{ width: 16, height: 16 }}
                        maskElement={
                          <Ionicons
                            name="checkmark-circle-sharp"
                            size={16}
                            color="black"
                          />
                        }
                      >
                        <LinearGradient
                          colors={["#C427E0", "#844AFF", "#12A9FF"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{ flex: 1 }}
                        />
                      </MaskedView>
                    )}
                  </View>

                  {eventPackage === "gold" && (
                    <LinearGradient
                      colors={["#C427E0", "#844AFF", "#12A9FF"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: 9,
                        zIndex: 10,
                      }}
                    />
                  )}
                </View>
                <Text className="font-poppins-semibold text-lg text-gray-800">
                  Gold
                </Text>
              </TouchableOpacity>

              <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 4 }}>
                {goldItems.map((item, index) => (
                  <View
                    key={index}
                    className="w-full flex flex-row items-start gap-1"
                  >
                    <MaterialCommunityIcons
                      name="checkbox-marked-circle-outline"
                      size={12}
                      color="#9ca3af"
                    />

                    <Text className="font-dm-sans text-sm text-gray-400 -mt-1">
                      {item}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-dm-sans text-sm text-gray-600">
              Packages:{" "}
            </Text>
            <View className="flex flex-row gap-0 items-start">
              <Text className="font-poppins-semibold text-2xl text-gray-700">
                {counts}
              </Text>
            </View>
          </View> */}
          </View>
        </View>

        {eventPackage === "standard" ? (
          <StandardPackage event={event} />
        ) : (
          <GoldPackage event={event} />
        )}

        <Button
          type="primary"
          label="See package details"
          buttonClassName="h-12"
          textClassName="text-lg"
          // disabled=
          loading={loading}
          onPress={handleOnConfirm}
        />
      </View>

      <PackageConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        flight={flight?.offers[0]}
        hotel={hotel?.offers[0]}
        transfer={transfer}
        packageType={eventPackage}
        eventId={event._id as string}
      />
    </>
  );
};

const EventOverview = ({
  hoster,
  detail,
  notes,
}: {
  hoster: {
    _id: string;
    avatar: string;
    title: string;
    country: string;
    country_code: string;
    is_verified: boolean;
  };
  detail?: string;
  notes?: string;
}) => {
  return (
    <View className="flex-1 gap-4">
      <View className="w-full flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          <Avatar source={hoster.avatar} name={hoster.title} size={40} />
          <View className="">
            <View className="flex flex-row items-center gap-2">
              <Text className="font-poppins-medium text-gray-700">
                {hoster.title}
              </Text>

              {hoster.is_verified && (
                <Image
                  source={VerifiedBadge}
                  alt="verified"
                  style={{ width: 16, height: 16 }}
                />
              )}
            </View>

            <View className="flex flex-row items-center gap-2">
              <FlagButton
                placeholder=""
                countryCode={hoster.country_code as any}
                containerButtonStyle={{ marginTop: -4 }}
              />
              <Text className="font-dm-sans text-gray-600 -ml-4 -mt-1">
                {hoster.country}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.8}>
          <Feather name="arrow-right" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      <View className="w-full gap-4">
        <Text className="font-poppins-semibold text-gray-700">
          About this event
        </Text>

        {detail && (
          <Text className="font-dm-sans text-sm text-gray-600">{detail}</Text>
        )}
        {notes && (
          <Text className="font-dm-sans text-sm text-gray-600">{notes}</Text>
        )}

        {!detail && !notes && (
          <View className="w-full flex flex-col items-center justify-center gap-1">
            <MaterialCommunityIcons
              name="pencil-remove-outline"
              size={18}
              color="#37415"
            />
            <Text className="font-poppins-medium text-sm text-gray-700">
              No description
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const EventItinerary = () => {
  return (
    <View className="flex-1 gap-4 overflow-hidden">
      {/* Flight */}
      <View className="w-full rounded-lg gap-2">
        <Text className="text-gray-700 font-poppins-semibold mb-2">
          Flight Details
        </Text>

        <View className="flex flex-row items-start gap-2">
          <MaterialIcons name="airlines" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Airline: Emirates EK 182
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialCommunityIcons
            name="calendar-clock-outline"
            size={16}
            color="#4b5563"
          />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Departure: JFK New York - Aug 14, 2025 - 10:45 PM
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialCommunityIcons
            name="airplane-takeoff"
            size={16}
            color="#4b5563"
          />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Arrival: Brussels International - Aug 15, 2025 – 11:20 AM
          </Text>
        </View>
      </View>

      <View className="w-full h-[1px] bg-gray-200"></View>

      {/* Hotel */}
      <View className="w-full rounded-lg gap-2">
        <Text className="text-gray-700 font-poppins-semibold mb-2">
          Hotel Booking
        </Text>

        <View className="flex flex-row items-start gap-2">
          <MaterialIcons name="hotel" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Hotel: Hilton Brussels Grand Place
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialCommunityIcons
            name="clock-check-outline"
            size={16}
            color="#4b5563"
          />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Check-in: Aug 15, 2025 - 2:00 PM
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialCommunityIcons
            name="clock-check-outline"
            size={16}
            color="#4b5563"
          />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Check-out: Aug 18, 2025 – 11:00 AM
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialIcons name="bed" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Room: Deluxe King Suite (Gold) / Standard Double (Standard)
          </Text>
        </View>
      </View>

      <View className="w-full h-[1px] bg-gray-200"></View>

      {/* Chauffeur Pickup Info (Gold Package Only) */}
      <View className="w-full rounded-lg gap-2">
        <Text className="text-gray-700 font-poppins-semibold mb-2">
          Chauffeur Pickup Info (Gold Package Only)
        </Text>

        <View className="flex flex-row items-start gap-2">
          <MaterialCommunityIcons name="account" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Driver: Alexandre B.
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialIcons name="directions-car" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Car: Black Mercedes S-Class
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialIcons name="luggage" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Pickup: Brussels Airport - Arrivals Terminal
          </Text>
        </View>

        <View className="flex flex-row items-start gap-2">
          <MaterialIcons name="phone-in-talk" size={16} color="#4b5563" />
          <Text className="font-dm-sans text-gray-600 line-clamp-2 w-3/4">
            Contact: +32 478 123 456
          </Text>
        </View>
      </View>
    </View>
  );
};

const EventDetailScreen = () => {
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<TDropdownItem>(tabs[0]);

  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();

  const init = useCallback(async () => {
    if (!id || typeof id !== "string") return;

    try {
      setLoading(true);

      const response = await fetchEvent(id);

      setEvent(response.data);

      dispatch(setBookingFlight(null));
      dispatch(setBookingHotel(null));
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    init();
  }, []);

  return (
    <EventDetailContainer>
      <View className="flex-1 bg-white rounded-2xl p-4 gap-5">
        {loading ? (
          <Spinner size="md" />
        ) : !event ? (
          <EmptyEventData />
        ) : (
          <>
            <Header
              image={event.image as string}
              title={event.title as string}
              category={formatEventLabel(event.category as string)}
              city={event?.venue?.city as string}
              country={event.country as string}
              opening_date={event.opening_date as Date}
            />

            <Tabs
              tabs={tabs}
              selectedTab={selectedTab}
              onSelct={setSelectedTab}
              tabClassName="flex-1"
            />

            {selectedTab.value === "packages" ? (
              <EventPackages event={event} />
            ) : selectedTab.value === "overview" ? (
              <EventOverview
                hoster={{
                  _id: "",
                  avatar: "",
                  country: "Portugal",
                  country_code: "PT",
                  is_verified: true,
                  title: "Event Hunter",
                }}
                detail={event.detail}
                notes={event.notes}
              />
            ) : (
              <EventItinerary />
            )}
          </>
        )}
      </View>
    </EventDetailContainer>
  );
};

export default EventDetailScreen;
