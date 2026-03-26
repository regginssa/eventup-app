import { Button, CommunityTicketItem } from "@/components/common";
import {
  BookSearchInputGroup,
  PackageConfirmModal,
} from "@/components/molecules";
import { TCoordinate } from "@/types";
import { IBooking } from "@/types/booking";
import { IEvent } from "@/types/event";
import { ICommunityTicket } from "@/types/ticket";
import { getCurrencySymbol } from "@/utils/format";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface EventDetailPackagesProps {
  event: IEvent;
  currentLocationCoords: TCoordinate | null;
  currentLocation: {
    city: string | null;
    countryCode: string | null;
  };
  communityTicket?: ICommunityTicket;
  booking?: IBooking;
}

const EventDetailPackages: React.FC<EventDetailPackagesProps> = ({
  event,
  currentLocationCoords,
  currentLocation,
  communityTicket,
  booking,
}) => {
  const [eventPackage, setEventPackage] = useState<"standard" | "gold">(
    "standard",
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const standardItems = [
    "Flights (economy)",
    "Mid-range hotel",
    "Basic transport",
  ];
  const goldItems = ["Premium flight", "Luxury hotel", "Private chauffeur"];

  return (
    <>
      <View className="flex-1 gap-6">
        <View>
          <Text className="font-poppins-bold text-gray-800 text-lg">
            Travel Packages
          </Text>
          <Text className="font-dm-sans-medium text-gray-400 text-xs uppercase tracking-widest mt-1">
            Tailor your experience
          </Text>
        </View>

        <View className="flex-row gap-3">
          {/* PACKAGE SELECTOR CARDS */}
          {[
            {
              id: "standard",
              label: "Standard",
              items: standardItems,
              icon: "star-outline",
            },
            { id: "gold", label: "Gold", items: goldItems, icon: "star" },
          ].map((pkg) => {
            const isActive = eventPackage === pkg.id;
            return (
              <TouchableOpacity
                key={pkg.id}
                activeOpacity={0.9}
                onPress={() => setEventPackage(pkg.id as any)}
                className={`flex-1 rounded-[24px] p-5 border-2 h-[210px] justify-between shadow-sm 
                  ${isActive ? "bg-white border-[#844AFF]" : "bg-gray-50 border-transparent"}`}
              >
                <View>
                  <View className="flex-row justify-between items-center mb-3">
                    <Text
                      className={`font-poppins-bold text-lg ${isActive ? "text-slate-900" : "text-slate-400"}`}
                    >
                      {pkg.label}
                    </Text>
                    {isActive ? (
                      <LinearGradient
                        colors={["#C427E0", "#844AFF", "#12A9FF"]}
                        style={{
                          borderRadius: 12,
                          width: 24,
                          height: 24,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Ionicons name="checkmark" size={14} color="white" />
                      </LinearGradient>
                    ) : (
                      <View className="w-6 h-6 rounded-full bg-gray-200" />
                    )}
                  </View>

                  {pkg.items.map((item, idx) => (
                    <View
                      key={idx}
                      className="flex-row items-center gap-2 mb-1.5"
                    >
                      <MaterialCommunityIcons
                        name="check-decagram"
                        size={12}
                        color={isActive ? "#844AFF" : "#9ca3af"}
                      />
                      <Text
                        numberOfLines={1}
                        className={`font-dm-sans text-[11px] ${isActive ? "text-slate-600" : "text-slate-400"}`}
                      >
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>

                {pkg.id === "gold" && (
                  <View className="bg-amber-100 self-start px-2 py-0.5 rounded-md">
                    <Text className="text-amber-700 font-dm-sans-bold text-[9px]">
                      PREMIUM
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {event.type === "user" && !event.hoster ? (
          <LinearGradient
            colors={["#dc262615", "#b91c1c15"]}
            start={{ x: 0, y: 0 }}
            style={{
              marginTop: 24,
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: "#844AFF20",
            }}
          >
            <View className="flex-row items-center">
              <View className="bg-red-600 w-12 h-12 rounded-xl items-center justify-center mr-4 shadow-lg shadow-purple-300">
                <MaterialCommunityIcons
                  name="information-outline"
                  size={24}
                  color="white"
                />
              </View>
              <View className="flex-1">
                <Text className="font-poppins-semibold uppercase text-red-600 text-sm">
                  Unconfirmed Event
                </Text>
                <Text className="font-dm-sans-bold text-red-700 text-sm">
                  Event's hoster isn't existed.
                </Text>
              </View>
            </View>
          </LinearGradient>
        ) : (
          <View className="bg-white">
            <View className="flex-row items-center gap-2 mb-6">
              <LinearGradient
                colors={["#844AFF", "#12A9FF"]}
                style={{
                  borderRadius: 8,
                  width: 32,
                  height: 32,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="map-marker-path"
                  size={18}
                  color="white"
                />
              </LinearGradient>
              <View>
                <Text className="font-poppins-semibold text-slate-800">
                  Booking Details
                </Text>
                <Text className="font-dm-sans-medium text-slate-600 text-[10px]">
                  {eventPackage === "gold"
                    ? "Configuring Luxury Suite & First Class"
                    : "Configuring Standard Stay & Economy"}
                </Text>
              </View>
            </View>

            {/* E-TICKET */}
            {event.type === "user" && event.fee?.type === "paid" && (
              <View className="bg-slate-50/50 py-4 rounded-2xl border border-slate-100">
                <View className="flex-row items-center gap-2 mb-4">
                  <View className="w-6 h-6 rounded-full bg-[#844AFF10] items-center justify-center">
                    <MaterialCommunityIcons
                      name="ticket-outline"
                      size={14}
                      color="#844AFF"
                    />
                  </View>
                  <Text className="font-poppins-semibold text-sm text-slate-800">
                    E-Ticket Required
                  </Text>
                </View>

                {communityTicket ? (
                  <CommunityTicketItem item={communityTicket} />
                ) : (
                  <View className="w-full flex-row items-start gap-2">
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={14}
                      color="#64748b"
                    />

                    <View className="flex-1">
                      <Text className="font-dm-sans-medium text-sm text-slate-700 leading-5">
                        An official e-ticket is required for entry. You can
                        purchase it in the app for{" "}
                        <Text className="font-dm-sans-bold">
                          {getCurrencySymbol(event.fee?.currency as any)}
                          {event.fee?.amount}
                        </Text>
                        .
                      </Text>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        className="mt-2"
                        onPress={() =>
                          router.push({
                            pathname: "/tickets",
                            params: {
                              amount: event.fee?.amount,
                              currency: event.fee?.currency,
                            },
                          })
                        }
                      >
                        <Text className="font-poppins-semibold text-sm text-[#844AFF] underline">
                          Purchase E-Ticket
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}

            <BookSearchInputGroup
              event={event}
              packageType={eventPackage}
              currentLocationCoords={currentLocationCoords}
              currentCity={currentLocation.city}
              currentCountryCode={currentLocation.countryCode}
              booking={booking}
            />

            <View className="mt-6">
              <Button
                type="gradient-soft"
                label="Explore Details"
                buttonClassName="h-14 rounded-2xl"
                textClassName="font-poppins-bold"
                onPress={() => setIsOpen(true)}
              />
            </View>
          </View>
        )}
      </View>

      <PackageConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        packageType={eventPackage}
        event={event}
        communityTicket={communityTicket}
      />
    </>
  );
};

export default EventDetailPackages;
