import { fetchStandardFlightsAvailability } from "@/api/scripts/booking";
import { setBookingFlight } from "@/redux/slices/booking.slice";
import {
  IFlightDetail,
  TFlight,
  TFlightAvailability,
  TPassengerInfo,
} from "@/types";
import { IEvent } from "@/types/data";
import { normalizeDate } from "@/utils/format";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { Button, DateTimePicker } from "../common";
import FlightAvailabilityGroup from "./FlightAvailabilityGroup";

interface SearchFlightsAvailabilityProps {
  event: IEvent;
  onConfirm: () => void;
}

const SearchsFlightAvailability: React.FC<SearchFlightsAvailabilityProps> = ({
  event,
  onConfirm,
}) => {
  const [flight, setFlight] = useState({
    departureDate: new Date(),
    adults: 1,
    childs: 0,
    infants: 0,
  });

  const [flightsAvailability, setFlightsAvailability] =
    useState<TFlight | null>(null);
  const [flightLoading, setFlightLoading] = useState<boolean>(false);
  const [isFlightSearched, setIsFlightSearched] = useState<boolean>(false);

  const dispatch = useDispatch();

  const createEmptyPassenger = (): TPassengerInfo => ({
    title: "Mr",
    firstName: "",
    lastName: "",
    dob: "",
    nationality: "",
    passportNo: "",
    passportIssueCountry: "",
    passportExpiryDate: "",
  });

  const handleFlight = async () => {
    if (!event?.opening_date) return;

    const eventDateTime = normalizeDate(new Date(event.opening_date));
    const departureDate = normalizeDate(flight.departureDate);

    if (eventDateTime < departureDate) {
      return Alert.alert(
        "Invalid Departure Date",
        "The departure date cannot be after the event date."
      );
    }

    try {
      setIsFlightSearched(false);
      setFlightLoading(true);

      const response = await fetchStandardFlightsAvailability(
        event._id as string,
        flight
      );

      const { recommend } = response.data;

      const initialFlightDetails: IFlightDetail = {
        paxInfo: {
          customerEmail: "",
          customerPhone: "",
          bookingNote: "",
        },
        paxDetails: {
          adults: Array.from({ length: flight.adults }, createEmptyPassenger),
          child: Array.from({ length: flight.childs }, createEmptyPassenger),
          infant: Array.from({ length: flight.infants }, createEmptyPassenger),
        },
      };

      setFlightsAvailability({
        ...response.data,
        recommend: {
          ...recommend,
          details: initialFlightDetails,
        },
      });

      setIsFlightSearched(true);

      dispatch(
        setBookingFlight({
          ...response.data,
          recommend: {
            ...recommend,
            details: initialFlightDetails,
          },
        })
      );
    } catch (error) {
      console.error(error);
    } finally {
      setFlightLoading(false);
    }
  };

  return (
    <>
      {/* Flight */}
      <View className="w-full gap-3">
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons name="airplane" size={20} color="#374151" />
          <Text className="font-dm-sans-bold text-gray-700">Flights</Text>
        </View>

        <DateTimePicker
          label="Departure date"
          className="rounded-md"
          value={flight.departureDate}
          onPick={(date: Date) => setFlight({ ...flight, departureDate: date })}
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
              disabled={flight.adults <= 1}
              onPress={() =>
                setFlight({ ...flight, adults: flight.adults - 1 })
              }
            >
              <Entypo name="minus" size={14} color="#1f2937" />
            </TouchableOpacity>
            <Text className="font-poppins-semibold text-gray-800">
              {flight.adults}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
              disabled={flight.adults >= 9}
              onPress={() =>
                setFlight({ ...flight, adults: flight.adults + 1 })
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
              disabled={flight.childs <= 0}
              onPress={() =>
                setFlight({ ...flight, childs: flight.childs - 1 })
              }
            >
              <Entypo name="minus" size={14} color="#1f2937" />
            </TouchableOpacity>
            <Text className="font-poppins-semibold text-gray-800">
              {flight.childs}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
              disabled={flight.childs >= 8}
              onPress={() =>
                setFlight({ ...flight, childs: flight.childs + 1 })
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
              disabled={flight.infants <= 0}
              onPress={() =>
                setFlight({ ...flight, infants: flight.infants - 1 })
              }
            >
              <Entypo name="minus" size={14} color="#1f2937" />
            </TouchableOpacity>
            <Text className="font-poppins-semibold text-gray-800">
              {flight.infants}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
              disabled={flight.infants >= 1}
              onPress={() =>
                setFlight({ ...flight, infants: flight.infants + 1 })
              }
            >
              <Entypo name="plus" size={14} color="#1f2937" />
            </TouchableOpacity>
          </View>
        </View>

        <Button
          type="primary"
          label="Search Flights"
          buttonClassName="h-12"
          loading={flightLoading}
          onPress={handleFlight}
        />
      </View>

      {isFlightSearched && (
        <>
          <View className="w-full h-[1px] bg-gray-200"></View>

          <FlightAvailabilityGroup
            recommend={flightsAvailability?.recommend}
            availabilities={flightsAvailability?.availabilities || []}
            isSearched={isFlightSearched}
            onSelect={(availability: TFlightAvailability) => {
              if (flightsAvailability) {
                setFlightsAvailability({
                  ...flightsAvailability,
                  recommend: availability,
                });
                dispatch(
                  setBookingFlight({
                    ...flightsAvailability,
                    recommend: availability,
                  })
                );
              }
            }}
            onConfirm={onConfirm}
          />
        </>
      )}
    </>
  );
};

export default SearchsFlightAvailability;
