import { IBooking, TBookingFlight } from "@/src/types/booking";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { FlatList, Text, View } from "react-native";
import { Spinner } from "../common";

interface BookingCardGroupProps {
  bookings: IBooking[];
  loading?: boolean;
}

const FlightItem = ({ data }: { data: TBookingFlight }) => (
  <View className="w-full flex flex-col gap-2">
    <View className="flex flex-row items-center gap-2">
      <MaterialCommunityIcons name="airplane" size={18} color="#1f2937" />
      <Text className="font-poppins-semibold text-gray-800"></Text>
    </View>

    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-2">
        <MaterialIcons name="airlines" size={16} color="#4b5563" />
        <Text className="font-dm-sans-medium text-sm text-gray-600">
          Airline
        </Text>
      </View>

      <Text className="">{data.validatingAirline}</Text>
    </View>
  </View>
);

const BookingCardGroup: React.FC<BookingCardGroupProps> = ({
  bookings,
  loading,
}) => {
  const renderItem = ({ item }: { item: IBooking }) => {
    const { flight, hotel, transfer, timezone } = item;

    const flightItemData = [
      {
        label: "Airline",
        icon: <MaterialIcons name="airlines" size={16} color="#4b5563" />,
        value: flight.validatingAirline,
      },
      {
        label: "PNR / Record Locator",
        icon: <MaterialIcons name="event-seat" size={16} color="#4b5563" />,
        value: flight.associatedRecord.reference,
      },
      {
        label: "Price",
        icon: <MaterialIcons name="money" size={16} color="#4b5563" />,
        value: `$${flight.price.total}`,
      },
      {
        label: "Status",
        icon: (
          <MaterialIcons
            name="check-circle-outline"
            size={16}
            color="#4b5563"
          />
        ),
        value: flight.status,
      },
    ];

    const hotelItemData = [
      {
        label: "Hotel",
        icon: <MaterialIcons name="hotel" size={16} color="#4b5563" />,
        value: hotel.hotel.name,
      },
      {
        label: "Rooms",
        icon: <MaterialIcons name="room" size={16} color="#4b5563" />,
        value: `$${hotel.rooms.length}`,
      },
      {
        label: "Confirmation Number",
        icon: <MaterialIcons name="event-seat" size={16} color="#4b5563" />,
        value: hotel.rooms.map((room) => room.confirmationNumber).join(", "),
      },
      {
        label: "Status",
        icon: (
          <MaterialIcons
            name="check-circle-outline"
            size={16}
            color="#4b5563"
          />
        ),
        value: flight.status,
      },
    ];

    return (
      <View className="w-full flex flex-col gap-3">
        {/* Flight Data */}
        <FlightItem data={flight} />
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white rounded-2xl p-4 flex flex-col items-center justify-center">
        <Spinner size="md" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white rounded-2xl p-4">
      <FlatList
        data={bookings}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 16 }}
      />
    </View>
  );
};

export default BookingCardGroup;
