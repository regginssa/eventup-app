import { fetchAllBookings } from "@/api/services/booking";
import { Input } from "@/components/common";
import { BookingCardGroup } from "@/components/molecules";
import { MyBookingsContainer } from "@/components/organisms";
import { RootState } from "@/store";
import { IBooking } from "@/types/booking";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

const MyBookingsScreen = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useSelector((state: RootState) => state.auth);

  const getAllBookings = async () => {
    if (!user?._id) return;

    try {
      const response = await fetchAllBookings(user._id);

      if (response.data) {
        setBookings(response.data);
      }
    } catch (error) {
      console.error("fetch all bookings error: ", error);
      Alert.alert("Error", "Failed to fetch all bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    getAllBookings();
  }, [user?._id]);

  return (
    <MyBookingsContainer>
      <View className="w-full flex flex-row items-center gap-3 mb-5">
        <View className="flex-1">
          <Input
            type="string"
            placeholder="Search"
            className="rounded-full"
            icon={<Feather name="search" size={16} color="#4b5563" />}
            value={search}
            onChange={setSearch}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-[60px] h-[46px] bg-white rounded-full flex items-center justify-center"
          style={styles.tune}
        >
          <MaterialIcons name="tune" size={20} color="#4b5563" />
        </TouchableOpacity>
      </View>

      <BookingCardGroup bookings={bookings} loading={loading} />
    </MyBookingsContainer>
  );
};

const styles = StyleSheet.create({
  tune: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default MyBookingsScreen;
