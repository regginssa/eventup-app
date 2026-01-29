import { TTransfer } from "@/src/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { TransferItem } from "../common";

interface TransferAvailabilityGroupProps {
  transfer: TTransfer | null;
  isSearched?: boolean;
  available?: boolean;
}

const TransferAvailabilityGroup: React.FC<TransferAvailabilityGroupProps> = ({
  transfer,
  isSearched,
  available,
}) => {
  if (isSearched && !transfer) {
    return (
      <View className="w-full flex flex-col items-center justify-center gap-2">
        <MaterialCommunityIcons name="car-off" size={24} color="#4b5563" />
        <Text className="font-poppins-semibold text-gray-600">
          No available transfers
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full gap-4">
      <View className="flex flex-row items-center gap-2">
        <MaterialCommunityIcons name="car-outline" size={20} color="#374151" />
        <Text className="font-dm-sans-bold text-gray-700">
          {available ? "Available" : ""} Transfers
        </Text>
      </View>

      <TransferItem data={transfer?.ah[0]} hiddenHeader />

      <View className="w-full h-[1px] bg-gray-300"></View>

      <TransferItem data={transfer?.he[0]} hiddenHeader isHotelToEvent />
    </View>
  );
};

export default TransferAvailabilityGroup;
