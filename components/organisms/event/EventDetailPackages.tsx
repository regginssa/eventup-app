import { Button } from "@/components/common";
import {
  BookSearchInputGroup,
  PackageConfirmModal,
} from "@/components/molecules";
import { TCoordinate } from "@/types";
import { IEvent } from "@/types/event";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface EventDetailPackagesProps {
  event: IEvent;
  currentLocationCoords: TCoordinate | null;
  currentLocation: {
    city: string | null;
    countryCode: string | null;
  };
}

const EventDetailPackages: React.FC<EventDetailPackagesProps> = ({
  event,
  currentLocationCoords,
  currentLocation,
}) => {
  const [eventPackage, setEventPackage] = useState<"standard" | "gold">(
    "standard",
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
                        className="w-6 h-6 items-center justify-center"
                        style={{ borderRadius: 12 }}
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

        {/* SEARCH INPUT GROUP CONTAINER */}
        <View className="bg-white rounded-[32px] shadow-xl shadow-slate-200 border border-slate-50">
          <View className="flex-row items-center gap-2 mb-6">
            <LinearGradient
              colors={["#844AFF", "#12A9FF"]}
              className="w-8 h-8 items-center justify-center"
              style={{ borderRadius: 8 }}
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

          <BookSearchInputGroup
            event={event}
            packageType={eventPackage}
            currentLocationCoords={currentLocationCoords}
            currentCity={currentLocation.city}
            currentCountryCode={currentLocation.countryCode}
          />

          <View className="mt-6">
            <Button
              type="primary"
              label="Explore Details"
              buttonClassName="h-14 rounded-2xl"
              textClassName="font-poppins-bold"
              onPress={() => setIsOpen(true)}
            />
          </View>
        </View>
      </View>

      <PackageConfirmModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        packageType={eventPackage}
        event={event}
      />
    </>
  );
};

export default EventDetailPackages;
