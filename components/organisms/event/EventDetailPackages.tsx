import { Button, UserTicketItem } from "@/components/common";
import {
  BookSearchInputGroup,
  PackageConfirmModal,
} from "@/components/molecules";
import { useBooking } from "@/components/providers/BookingProvider";
import { TCoordinate } from "@/types";
import { IAttendees, IEvent, TEventFee } from "@/types/event";
import { ICommunityTicket } from "@/types/ticket";
import { getCurrencySymbol } from "@/utils/format";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const ticketCardBg = require("@/assets/images/ticket_card_bg.png");

interface EventDetailPackagesProps {
  event: IEvent;
  currentLocationCoords: TCoordinate | null;
  currentLocation: {
    city: string | null;
    countryCode: string | null;
  };
  isBooked?: boolean;
  bookedPackageType: "standard" | "gold";
  totalPrice: number;
  fee?: TEventFee;
  communityTicket: ICommunityTicket | null;
  attendees?: IAttendees;
}

const EventDetailPackages: React.FC<EventDetailPackagesProps> = ({
  event,
  currentLocationCoords,
  currentLocation,
  isBooked,
  totalPrice,
  fee,
  communityTicket,
  attendees,
}) => {
  const [eventPackage, setEventPackage] = useState<"standard" | "gold">(
    "standard",
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { flight, hotel, transfer } = useBooking();
  const router = useRouter();

  const standardItems = [
    "Flights (economy)",
    "Mid-range hotel",
    "Basic airport-hotel-event transport",
  ];

  const goldItems = [
    "Premium flight",
    "Luxury hotel",
    "Private chauffeur/car on call",
  ];

  const handleOnConfirm = () => {
    setIsOpen(true);
  };

  if (isBooked) {
    return (
      <View className="w-full flex flex-col gap-2">
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="checkbox-marked-circle-outline"
            size={18}
            color="#16a34a"
          />
          <Text className="font-poppins-medium text-green-600 text-xl ">
            Booking confirmed:
          </Text>
        </View>

        <Text className="font-poppins-semibold text-sm text-gray-600">
          Standard Package
        </Text>

        {communityTicket && <UserTicketItem item={communityTicket} />}

        {attendees && (
          <>
            <View className="flex flex-row items-center gap-2">
              {attendees.ticket && (
                <View className="flex flex-row items-start gap-2">
                  <MaterialCommunityIcons
                    name={
                      attendees.ticket?.status === "deposited"
                        ? "clock-outline"
                        : attendees.ticket.status === "released"
                          ? "checkbox-marked-circle-outline"
                          : "cash-refund"
                    }
                    size={18}
                    color={
                      attendees.ticket.status === "deposited"
                        ? "#ca8a04"
                        : attendees.ticket.status === "released"
                          ? "#16a34a"
                          : "#2563eb"
                    }
                  />
                  <Text
                    className={`font-poppins-medium text-sm ${attendees.ticket.status === "deposited" ? "text-yellow-600" : attendees.ticket.status === "released" ? "text-green-600" : "text-blue-600"}`}
                  >
                    Ticket is {attendees.ticket?.status}
                  </Text>
                </View>
              )}
            </View>
            {/* <View className="flex flex-row items-start gap-2">
              <MaterialCommunityIcons
                name={
                  attendees.status === "approved"
                    ? "checkbox-marked-circle-outline"
                    : "alert-circle-outline"
                }
                size={16}
                color={attendees.status === "approved" ? "#16a34a" : "#ef4444"}
              />
              <Text
                className={`font-poppins-medium text-sm ${attendees.status === "approved" ? "text-green-600" : "text-red-500"}`}
              >
                Application is {attendees.status}
              </Text>
            </View> */}
          </>
        )}

        <View className="w-full h-[1px] bg-gray-200 mt-2 mb-2"></View>
        <View className="w-full flex flex-row items-center justify-between">
          <Text className="font-dm-sans-bold text-xl text-gray-800">
            Total:
          </Text>
          <View className="flex flex-row items-start gap-0">
            <Text className="font-poppins-bold text-green-500 text-sm">$</Text>
            <Text className="font-poppins-bold text-green-500 text-xl">
              {totalPrice}
            </Text>
          </View>
        </View>
      </View>
    );
  }

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
                    key={`standard-package-item-${index}`}
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

        {fee && fee.type === "paid" && !communityTicket && (
          <View className="w-full flex flex-row items-start gap-2 rounded-xl border border-blue-500 bg-blue-200 p-4">
            <MaterialCommunityIcons
              name="information-outline"
              size={24}
              color="#3b82f6"
            />
            <View className="flex-1">
              <Text className="font-dm-sans-medium text-sm text-blue-500">
                You must have{" "}
                <Text className="font-poppins-bold">
                  {getCurrencySymbol(fee.currency as any)}
                  {fee.amount} ticket
                </Text>{" "}
                to enter the event.
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex flex-row items-center gap-1"
                onPress={() =>
                  router.push({
                    pathname: "/tickets",
                    params: {
                      amount: event.fee?.amount,
                      currency: event.fee?.currency,
                      from: `/event/${event._id}`,
                    },
                  })
                }
              >
                <Text className="font-dm-sans-bold text-sm text-blue-600 underline">
                  View
                </Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={12}
                  color="#2563eb"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {communityTicket && <TicketItem ticket={communityTicket} />}

        {eventPackage === "standard" ? (
          <View className="bg-[#F7F3FF] rounded-xl p-4 gap-3">
            <Text className="font-poppins-semibold text-lg text-gray-800">
              Standard
            </Text>

            <BookSearchInputGroup
              event={event}
              packageType="standard"
              currentLocationCoords={currentLocationCoords}
              currentCity={currentLocation.city}
              currentCountryCode={currentLocation.countryCode}
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
              currentCity={currentLocation.city}
              currentCountryCode={currentLocation.countryCode}
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
        ticket={communityTicket || undefined}
        flight={flight?.offers[0]}
        hotel={hotel?.offers[0]}
        transfer={transfer}
        packageType={eventPackage}
        eventId={event._id as string}
      />
    </>
  );
};

const TicketItem = ({ ticket }: { ticket: ICommunityTicket }) => {
  return (
    <View className="relative w-full h-[160px] rounded-xl overflow-hidden">
      <Image
        source={ticketCardBg}
        alt="Ticket Card BG"
        style={{ width: "100%", height: "100%" }}
      />

      <View className="absolute inset-0 flex flex-row items-stretch justify-between">
        <View className="flex flex-col items-center justify-center w-1/2">
          <View className="w-[148px] h-[120px] rounded-lg overflow-hidden">
            <Image
              source={{ uri: ticket.image }}
              alt={ticket.name}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </View>
        </View>

        <View className="flex flex-col items-center justify-center w-1/2">
          <View className="flex flex-col items-center justify-between gap-6">
            <View className="flex flex-col items-center justify-center">
              <View className="flex flex-row items-start">
                <Text className="font-poppins-semibold text-lg text-gray-500">
                  {getCurrencySymbol(ticket.currency as any)}
                </Text>
                <Text className="font-poppins-semibold text-3xl text-gray-800">
                  {ticket.price}
                </Text>
              </View>

              <Text className="font-poppins text-gray-700">{ticket.name}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EventDetailPackages;
