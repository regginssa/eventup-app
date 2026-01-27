import { IBooking } from "@/types/booking";
import { View } from "react-native";
import { Spinner } from "../common";

interface BookingCardGroupProps {
  bookings: IBooking[];
  loading?: boolean;
}

const BookingCardGroup: React.FC<BookingCardGroupProps> = ({
  bookings,
  loading,
}) => {
  if (loading) {
    return (
      <View className="flex-1 bg-white rounded-2xl p-4 flex flex-col items-center justify-center">
        <Spinner size="md" />
      </View>
    );
  }

  return <View className="flex-1 bg-white rounded-2xl p-4"></View>;
};

export default BookingCardGroup;
