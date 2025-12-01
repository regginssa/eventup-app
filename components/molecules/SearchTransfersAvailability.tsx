import { fetchStandardTransfersAvailability } from "@/api/scripts/booking";
import { RootState } from "@/redux/store";
import { IEvent } from "@/types/data";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Button, DateTimePicker } from "../common";

interface SearchTransfersAvailabilityProps {
  event: IEvent;
}

type TTransfer = {
  departureDate: Date;
  arrivalDate: Date;
  adults: number;
  childs: number;
  infants: number;
};

const SearchTransfersAvailability: React.FC<
  SearchTransfersAvailabilityProps
> = ({ event }) => {
  const [transfers, setTransfers] = useState<string[]>(["ah"]);
  const [ahTransfer, setAhTransfer] = useState<TTransfer>({
    departureDate: new Date(),
    arrivalDate: new Date(),
    adults: 1,
    childs: 0,
    infants: 0,
  });
  const [heTransfer, setHeTransfer] = useState<TTransfer>({
    departureDate: new Date(),
    arrivalDate: new Date(),
    adults: 1,
    childs: 0,
    infants: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const { flight, hotel } = useSelector((state: RootState) => state.booking);

  const handleTransfers = async () => {
    if (!hotel?.recommend || !event._id) {
      return Alert.alert("Please select a hotel first.");
    }

    if (!flight?.recommend) {
      return;
    }

    const flightArrival = new Date(
      flight?.recommend?.FareItinerary?.OriginDestinationOptions[0]?.OriginDestinationOption[
        flight?.recommend?.FareItinerary?.OriginDestinationOptions[0]
          ?.OriginDestinationOption.length - 1
      ]?.FlightSegment.ArrivalDateTime
    );

    // if (transfers.includes("ah")) {
    //   if (
    //     !flight?.recommend.FareItinerary.OriginDestinationOptions[0]
    //       .OriginDestinationOption[0].FlightSegment.ArrivalAirportLocationCode
    //   ) {
    //     return Alert.alert("Please select a flight first.");
    //   }

    //   if (
    //     !flight?.recommend.FareItinerary.OriginDestinationOptions[0]
    //       .OriginDestinationOption[0].FlightSegment.ArrivalDateTime
    //   ) {
    //     return Alert.alert("Please select a flight first.");
    //   }
    // }

    // if (transfers.includes("he")) {
    //   if (!hotel?.recommend) {
    //     return Alert.alert("Please select a hotel first.");
    //   }

    //   if (!event.opening_date) {
    //     return Alert.alert("Event date is not available.");
    //   }
    //   const departureDateTime = normalizeDate(heTransfer.departureDate);
    //   const arrivalDateTime = normalizeDate(heTransfer.arrivalDate);
    //   const hotelCheckInDateTime = normalizeDate(new Date(hotel.checkin));

    //   const eventOpenDateTimte = normalizeDate(new Date(event.opening_date));

    //   if (departureDateTime < hotelCheckInDateTime) {
    //     return Alert.alert("Departure date must be after hotel check-in date.");
    //   }

    //   if (arrivalDateTime < hotelCheckInDateTime) {
    //     return Alert.alert("Arrival date must be after hotel check-in date.");
    //   }

    //   if (departureDateTime > eventOpenDateTimte) {
    //     return Alert.alert("Departure date must be before event date.");
    //   }

    //   if (departureDateTime > arrivalDateTime) {
    //     return Alert.alert("Departure date must be before arrival date.");
    //   }
    // }

    try {
      setLoading(true);

      const reqData = {
        ahTransfer: transfers.includes("ah")
          ? {
              ...ahTransfer,
              airportCode:
                flight.recommend?.FareItinerary?.OriginDestinationOptions[0]
                  ?.OriginDestinationOption[
                  flight.recommend?.FareItinerary?.OriginDestinationOptions[0]
                    ?.OriginDestinationOption.length - 1
                ]?.FlightSegment.ArrivalAirportLocationCode,
              hotel: {
                hotelId: hotel.recommend.hotelId,
                tokenId: hotel.recommend.tokenId,
                sessionId: hotel.session_id,
                productId: hotel.recommend.productId,
              },
              departureDate: flightArrival,
              arrivalDate: hotel.checkin,
            }
          : null,
        heTransfer: transfers.includes("he")
          ? {
              ...heTransfer,
              hotel: {
                hotelId: hotel.recommend.hotelId,
                tokenId: hotel.recommend.tokenId,
                sessionId: hotel.session_id,
                productId: hotel.recommend.productId,
                arrivalDate: event.opening_date,
              },
            }
          : null,
      };

      const response = await fetchStandardTransfersAvailability(
        event._id,
        reqData
      );

      console.log("transfers availability response: ", response);
    } catch (error) {
      console.error("handle transfers error: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hotel?.checkin) {
      setHeTransfer({ ...heTransfer, departureDate: hotel.checkin });
    }
  }, [hotel]);

  return (
    <>
      <View className="w-full gap-3">
        <View className="flex flex-row items-center gap-2">
          <MaterialIcons name="local-taxi" size={20} color="#374151" />
          <Text className="font-dm-sans-bold text-gray-700">Transfers</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          className={`w-full p-2 gap-3 ${
            transfers.includes("ah") && "bg-[#f8f7fa]"
          } border border-[#dfd4f7] rounded-lg`}
          onPress={() => {
            if (transfers.includes("ah")) {
              setTransfers(transfers.filter((t) => t !== "ah"));
            } else {
              setTransfers([...transfers, "ah"]);
            }
          }}
        >
          <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-dm-sans-bold text-gray-600 text-sm">
              Airport To Hotel
            </Text>

            <View className="w-[18px] h-[18px] bg-gray-300 rounded-full relative z-0">
              <View className="absolute inset-[1px] rounded-full bg-white flex items-center justify-center z-20">
                {transfers.includes("ah") && (
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

              {transfers.includes("ah") && (
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
          </View>

          <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Adults{" "}
              <Text className="font-poppins-medium text-gray-500">
                (12 years+)
              </Text>
            </Text>

            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={ahTransfer.adults <= 1}
                onPress={() =>
                  setAhTransfer({
                    ...ahTransfer,
                    adults: ahTransfer.adults - 1,
                  })
                }
              >
                <Entypo name="minus" size={14} color="#1f2937" />
              </TouchableOpacity>
              <Text className="font-poppins-semibold text-gray-800">
                {ahTransfer.adults}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={ahTransfer.adults >= 9}
                onPress={() =>
                  setAhTransfer({
                    ...ahTransfer,
                    adults: ahTransfer.adults + 1,
                  })
                }
              >
                <Entypo name="plus" size={14} color="#1f2937" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Children{" "}
              <Text className="font-poppins-medium text-gray-500">
                (2-11 years)
              </Text>
            </Text>

            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={ahTransfer.childs <= 0}
                onPress={() =>
                  setAhTransfer({
                    ...ahTransfer,
                    childs: ahTransfer.childs - 1,
                  })
                }
              >
                <Entypo name="minus" size={14} color="#1f2937" />
              </TouchableOpacity>
              <Text className="font-poppins-semibold text-gray-800">
                {ahTransfer.childs}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={ahTransfer.childs >= 8}
                onPress={() =>
                  setAhTransfer({
                    ...ahTransfer,
                    childs: ahTransfer.childs + 1,
                  })
                }
              >
                <Entypo name="plus" size={14} color="#1f2937" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Infant{" "}
              <Text className="font-poppins-medium text-gray-500">
                (0-2 years)
              </Text>
            </Text>

            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={ahTransfer.infants <= 0}
                onPress={() =>
                  setAhTransfer({
                    ...ahTransfer,
                    infants: ahTransfer.infants - 1,
                  })
                }
              >
                <Entypo name="minus" size={14} color="#1f2937" />
              </TouchableOpacity>
              <Text className="font-poppins-semibold text-gray-800">
                {ahTransfer.infants}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={ahTransfer.infants >= 1}
                onPress={() =>
                  setAhTransfer({
                    ...ahTransfer,
                    infants: ahTransfer.infants + 1,
                  })
                }
              >
                <Entypo name="plus" size={14} color="#1f2937" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          className={`w-full p-2 gap-3 ${
            transfers.includes("he") && "bg-[#f8f7fa]"
          } border border-[#dfd4f7] rounded-lg`}
          onPress={() => {
            if (transfers.includes("he")) {
              setTransfers(transfers.filter((t) => t !== "he"));
            } else {
              setTransfers([...transfers, "he"]);
            }
          }}
        >
          <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-dm-sans-bold text-gray-600 text-sm">
              Hotel To Event
            </Text>

            <View className="w-[18px] h-[18px] bg-gray-300 rounded-full relative z-0">
              <View className="absolute inset-[1px] rounded-full bg-white flex items-center justify-center z-20">
                {transfers.includes("he") && (
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

              {transfers.includes("he") && (
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
          </View>

          <DateTimePicker
            label="Departure Date & Time"
            value={heTransfer.departureDate}
            onPick={(date: Date) =>
              setHeTransfer({ ...heTransfer, departureDate: date })
            }
          />

          <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Adults{" "}
              <Text className="font-poppins-medium text-gray-500">
                (12 years+)
              </Text>
            </Text>

            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={heTransfer.adults <= 1}
                onPress={() =>
                  setHeTransfer({
                    ...heTransfer,
                    adults: heTransfer.adults - 1,
                  })
                }
              >
                <Entypo name="minus" size={14} color="#1f2937" />
              </TouchableOpacity>
              <Text className="font-poppins-semibold text-gray-800">
                {heTransfer.adults}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={heTransfer.adults >= 9}
                onPress={() =>
                  setHeTransfer({
                    ...heTransfer,
                    adults: heTransfer.adults + 1,
                  })
                }
              >
                <Entypo name="plus" size={14} color="#1f2937" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Children{" "}
              <Text className="font-poppins-medium text-gray-500">
                (2-11 years)
              </Text>
            </Text>

            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={heTransfer.childs <= 0}
                onPress={() =>
                  setHeTransfer({
                    ...heTransfer,
                    childs: heTransfer.childs - 1,
                  })
                }
              >
                <Entypo name="minus" size={14} color="#1f2937" />
              </TouchableOpacity>
              <Text className="font-poppins-semibold text-gray-800">
                {heTransfer.childs}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={heTransfer.childs >= 8}
                onPress={() =>
                  setHeTransfer({
                    ...heTransfer,
                    childs: heTransfer.childs + 1,
                  })
                }
              >
                <Entypo name="plus" size={14} color="#1f2937" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="w-full flex flex-row items-center justify-between">
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Infant{" "}
              <Text className="font-poppins-medium text-gray-500">
                (0-2 years)
              </Text>
            </Text>

            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={heTransfer.infants <= 0}
                onPress={() =>
                  setHeTransfer({
                    ...heTransfer,
                    infants: heTransfer.infants - 1,
                  })
                }
              >
                <Entypo name="minus" size={14} color="#1f2937" />
              </TouchableOpacity>
              <Text className="font-poppins-semibold text-gray-800">
                {heTransfer.infants}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                disabled={heTransfer.infants >= 1}
                onPress={() =>
                  setHeTransfer({
                    ...heTransfer,
                    infants: heTransfer.infants + 1,
                  })
                }
              >
                <Entypo name="plus" size={14} color="#1f2937" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>

        <Button
          type="primary"
          label="Search Transfers"
          buttonClassName="h-12"
          disabled={transfers.length === 0}
          loading={loading}
          onPress={handleTransfers}
        />
      </View>
    </>
  );
};

export default SearchTransfersAvailability;
