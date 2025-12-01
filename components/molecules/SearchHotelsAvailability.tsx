import { fetchStandardHotelsAvailability } from "@/api/scripts/booking";
import { setBookingHotel } from "@/redux/slices/booking.slice";
import { RootState } from "@/redux/store";
import { THotel, THotelAvailability } from "@/types";
import { IEvent } from "@/types/data";
import { normalizeDate } from "@/utils/format";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Button, DateTimePicker } from "../common";
import HotelAvailabilityGroup from "./HotelAvailabilityGroup";

interface SearchHotelsAvailabilityProps {
  event: IEvent;
  onConfirm: () => void;
}

const SearchHotelsAvailability: React.FC<SearchHotelsAvailabilityProps> = ({
  event,
  onConfirm,
}) => {
  const [hotel, setHotel] = useState<{ rooms: number; data: any[] }>({
    rooms: 1,
    data: [{ adults: 1, childs: 0, child_age: [] }],
  });
  const [hotelCheckin, setHotelCheckIn] = useState<Date>(new Date());
  const [hotelCheckout, setHotelCheckOut] = useState<Date>(new Date());

  const [hotelsAvailability, setHotelsAvailability] = useState<THotel | null>(
    null
  );
  const [hotelLoading, setHotelLoading] = useState<boolean>(false);
  const [isHotelSearched, setIsHotelSearched] = useState<boolean>(false);

  const { flight } = useSelector((state: RootState) => state.booking);
  const dispatch = useDispatch();

  const formatHotelRooms = (hotel: any) => {
    return hotel.data.map((room: any, index: number) => ({
      room_no: index + 1,
      adult: room.adults,
      child: room.childs,
      child_age: room.child_age.length > 0 ? room.child_age : [0],
    }));
  };

  const handleHotel = async () => {
    if (!event.opening_date) return;

    // ------------------------------
    // 1. Check flight arrival DATE vs hotel check-in DATE
    // ------------------------------
    if (flight?.recommend) {
      const flightArrival = new Date(
        flight?.recommend?.FareItinerary?.OriginDestinationOptions[0]?.OriginDestinationOption[
          flight?.recommend?.FareItinerary?.OriginDestinationOptions[0]
            ?.OriginDestinationOption.length - 1
        ]?.FlightSegment.ArrivalDateTime
      );

      const arrivalDateOnly = normalizeDate(flightArrival);
      const checkinDateOnly = normalizeDate(hotelCheckin);

      if (checkinDateOnly < arrivalDateOnly) {
        Alert.alert(
          "Hotel check-in must be on or after your flight arrival date."
        );
        return;
      }
    }

    // TODAY normalized
    const today = normalizeDate(new Date());

    // ------------------------------
    // 2. Hotel check-in must be today or after
    // ------------------------------
    if (normalizeDate(hotelCheckin) < today) {
      Alert.alert("Hotel check-in must be today or later.");
      return;
    }

    // ------------------------------
    // 3. Hotel check-out must be today or after
    // ------------------------------
    if (normalizeDate(hotelCheckout) < today) {
      Alert.alert("Hotel check-out must be today or later.");
      return;
    }

    // ------------------------------
    // 4. Check-out must be *after* check-in
    // ------------------------------
    if (normalizeDate(hotelCheckout) <= normalizeDate(hotelCheckin)) {
      Alert.alert("Hotel check-out must be after hotel check-in.");
      return;
    }

    // // ------------------------------
    // // 5. Validate event opening date
    // // ------------------------------
    // if (
    //   normalizeDate(new Date(event.opening_date)) < normalizeDate(hotelCheckin)
    // ) {
    //   Alert.alert(
    //     `Hotel check-in cannot be after event opening date (${formatEventDate(
    //       new Date(event.opening_date)
    //     )}).`
    //   );
    //   return;
    // }

    // ------------------------------
    // 6. Everything valid – perform request
    // ------------------------------
    try {
      setIsHotelSearched(false);
      setHotelLoading(true);

      const formattedHotelRooms = formatHotelRooms(hotel);

      const response = await fetchStandardHotelsAvailability(
        event._id as string,
        formattedHotelRooms,
        hotelCheckin,
        hotelCheckout
      );

      setHotelsAvailability(response.data);
      setIsHotelSearched(true);
      dispatch(
        setBookingHotel({
          ...response.data,
          checkin: new Date(hotelCheckin),
          checkout: new Date(hotelCheckout),
        })
      );
    } catch (error) {
      console.log("handle hotel availability error:", error);
    } finally {
      setHotelLoading(false);
    }
  };

  return (
    <>
      {/* Hotel */}
      <View className="w-full gap-3">
        <View className="flex flex-row items-center gap-2">
          <MaterialIcons name="hotel" size={20} color="#374151" />
          <Text className="font-dm-sans-bold text-gray-700">Hotel</Text>
        </View>

        <DateTimePicker
          label="Check in date"
          className="rounded-md"
          value={hotelCheckin}
          onPick={setHotelCheckIn}
        />

        <DateTimePicker
          label="Check out date"
          className="rounded-md"
          value={hotelCheckout}
          onPick={setHotelCheckOut}
        />

        <View className="w-full flex flex-row items-center justify-between">
          <Text className="font-dm-sans-medium text-sm text-gray-600">
            Rooms
          </Text>

          <View className="flex flex-row items-center gap-4">
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
              disabled={hotel.rooms <= 1}
              onPress={() => {
                const newData = hotel.data.slice(0, -1);
                setHotel({
                  ...hotel,
                  rooms: hotel.rooms - 1,
                  data: newData,
                });
              }}
            >
              <Entypo name="minus" size={14} color="#1f2937" />
            </TouchableOpacity>
            <Text className="font-poppins-semibold text-gray-800">
              {hotel.rooms}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
              disabled={hotel.rooms >= 5}
              onPress={() =>
                setHotel({
                  ...hotel,
                  rooms: hotel.rooms + 1,
                  data: [
                    ...hotel.data,
                    { adults: 0, childs: 0, child_age: [] },
                  ],
                })
              }
            >
              <Entypo name="plus" size={14} color="#1f2937" />
            </TouchableOpacity>
          </View>
        </View>

        {hotel.data.map((dt, index) => (
          <View key={index} className="w-full gap-4">
            <View className="w-full h-[1px] bg-gray-200"></View>

            <Text className="font-poppins-semibold text-sm text-gray-700">
              Room No {index + 1}
            </Text>

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
                  disabled={dt.adults <= 1}
                  onPress={() =>
                    setHotel({
                      ...hotel,
                      data: hotel.data.map((da, i) =>
                        i === index ? { ...da, adults: da.adults - 1 } : da
                      ),
                    })
                  }
                >
                  <Entypo name="minus" size={14} color="#1f2937" />
                </TouchableOpacity>
                <Text className="font-poppins-semibold text-gray-800">
                  {dt.adults}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                  disabled={dt.adults >= 8}
                  onPress={() =>
                    setHotel({
                      ...hotel,
                      data: hotel.data.map((da, i) =>
                        i === index ? { ...da, adults: da.adults + 1 } : da
                      ),
                    })
                  }
                >
                  <Entypo name="plus" size={14} color="#1f2937" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Children */}
            <View className="w-full flex flex-row items-center justify-between">
              <Text className="font-dm-sans-medium text-sm text-gray-600">
                Children{" "}
                <Text className="font-poppins-medium text-gray-500">
                  (2-11 years)
                </Text>
              </Text>

              <View className="flex flex-row items-center gap-4">
                {/* minus child */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                  disabled={dt.childs <= 0}
                  onPress={() =>
                    setHotel({
                      ...hotel,
                      data: hotel.data.map((da, i) =>
                        i === index
                          ? {
                              ...da,
                              childs: da.childs - 1,
                              child_age: da.child_age.slice(0, -1),
                            }
                          : da
                      ),
                    })
                  }
                >
                  <Entypo name="minus" size={14} color="#1f2937" />
                </TouchableOpacity>

                <Text className="font-poppins-semibold text-gray-800">
                  {dt.childs}
                </Text>

                {/* add child */}
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                  disabled={dt.childs >= 4}
                  onPress={() =>
                    setHotel({
                      ...hotel,
                      data: hotel.data.map((da, i) =>
                        i === index
                          ? {
                              ...da,
                              childs: da.childs + 1,
                              child_age: [...da.child_age, 2], // default age
                            }
                          : da
                      ),
                    })
                  }
                >
                  <Entypo name="plus" size={14} color="#1f2937" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Children Age */}
            {dt.child_age.map((age: any, childIndex: number) => (
              <View
                key={childIndex}
                className="w-full flex flex-row items-center justify-between pl-4"
              >
                <Text className="font-dm-sans-medium text-sm text-gray-600">
                  Child {childIndex + 1} Age
                </Text>

                <View className="flex flex-row items-center gap-4">
                  {/* minus age */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                    disabled={age <= 2}
                    onPress={() =>
                      setHotel({
                        ...hotel,
                        data: hotel.data.map((da, i) =>
                          i === index
                            ? {
                                ...da,
                                child_age: da.child_age.map(
                                  (ag: any, ai: any) =>
                                    ai === childIndex ? ag - 1 : ag
                                ),
                              }
                            : da
                        ),
                      })
                    }
                  >
                    <Entypo name="minus" size={14} color="#1f2937" />
                  </TouchableOpacity>

                  <Text className="font-poppins-semibold text-gray-800">
                    {age}
                  </Text>

                  {/* plus age */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="w-6 h-6 bg-[#e5e5e6] rounded-full flex items-center justify-center"
                    disabled={age >= 11}
                    onPress={() =>
                      setHotel({
                        ...hotel,
                        data: hotel.data.map((da, i) =>
                          i === index
                            ? {
                                ...da,
                                child_age: da.child_age.map(
                                  (ag: any, ai: any) =>
                                    ai === childIndex ? ag + 1 : ag
                                ),
                              }
                            : da
                        ),
                      })
                    }
                  >
                    <Entypo name="plus" size={14} color="#1f2937" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}

        <Button
          type="primary"
          label="Search Hotels"
          buttonClassName="h-12"
          loading={hotelLoading}
          onPress={handleHotel}
        />
      </View>

      {isHotelSearched && (
        <>
          <View className="w-full h-[1px] bg-gray-200"></View>

          <HotelAvailabilityGroup
            sessionId={hotelsAvailability?.session_id}
            recommend={hotelsAvailability?.recommend}
            availabilities={hotelsAvailability?.availabilities || []}
            isSearched={isHotelSearched}
            onSelect={(availability: THotelAvailability) => {
              if (hotelsAvailability) {
                setHotelsAvailability({
                  ...hotelsAvailability,
                  recommend: availability,
                });

                dispatch(
                  setBookingHotel({
                    ...hotelsAvailability,
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

export default SearchHotelsAvailability;
