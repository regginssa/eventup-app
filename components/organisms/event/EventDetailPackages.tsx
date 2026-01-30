import { Button } from "@/components/common";
import {
  BookSearchInputGroup,
  PackageConfirmModal,
} from "@/components/molecules";
import { RootState } from "@/store";
import { TCoordinate } from "@/types";
import { IEvent } from "@/types/event";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

interface EventDetailPackagesProps {
  event: IEvent;
  currentLocationCoords: TCoordinate | null;
  currentCity: string | null;
  currentCountryCode: string | null;
}

const EventDetailPackages: React.FC<EventDetailPackagesProps> = ({
  event,
  currentLocationCoords,
  currentCity,
  currentCountryCode,
}) => {
  const [eventPackage, setEventPackage] = useState<"standard" | "gold">(
    "standard"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();
  const { flight, hotel, transfer } = useSelector(
    (state: RootState) => state.booking
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
          <View className="bg-[#F7F3FF] rounded-xl p-4 gap-3">
            <Text className="font-poppins-semibold text-lg text-gray-800">
              Standard
            </Text>

            <BookSearchInputGroup
              event={event}
              packageType="standard"
              currentLocationCoords={currentLocationCoords}
              currentCity={currentCity}
              currentCountryCode={currentCountryCode}
            />
          </View>
        ) : (
          <View className="bg-[#F7F3FF] rounded-xl p-4 gap-3">
            <Text className="font-poppins-semibold text-lg text-gray-800">
              Gold
            </Text>

            <BookSearchInputGroup
              event={event}
              packageType="gold"
              currentLocationCoords={currentLocationCoords}
              currentCity={currentCity}
              currentCountryCode={currentCountryCode}
            />
          </View>
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

export default EventDetailPackages;
