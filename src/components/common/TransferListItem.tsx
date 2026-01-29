import { TTransferProduct } from "@/src/types";
import { getCurrencySymbol } from "@/src/utils/format";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

interface TransferListItemProps {
  item: TTransferProduct;
}

const TransferListItem: React.FC<TransferListItemProps> = ({ item }) => {
  const { general, pricing } = item;

  const vehicleType = general?.productType || "-";
  const transferCompany = general?.transferCompany || "-";
  const transferTime = general?.transferTime || "";
  const luggage = general?.luggage || "-";
  const maxPax = general?.maxPax || "-";
  const rating = general?.rating || "";
  const canxHours = general?.canxHours || "";
  const canxPerc = general?.canxPerc || "";
  const vehicleImage = general?.vehicleImage || "";

  const price = pricing?.price || "";
  const currency = pricing?.currency?.toUpperCase() || "";

  const isCardPaymentAvailable = general?.isCardPaymentAvailable;

  return (
    <View className="bg-white rounded-xl p-3">
      {/* HEADER */}
      <View className="flex flex-row justify-between items-center mb-2">
        <Text className="font-poppins-semibold text-gray-800 text-base">
          {vehicleType}
        </Text>
        <Text className="font-poppins-bold text-gray-700 text-lg">
          <Text className="text-sm">
            {getCurrencySymbol(currency.toLowerCase() as any)}
          </Text>
          {price}
        </Text>
      </View>

      {/* COMPANY */}
      <Text className="font-dm-sans-medium text-gray-500 mb-2">
        {transferCompany}
      </Text>

      {/* IMAGE */}
      {!!vehicleImage && (
        <View className="w-full h-[140px] rounded-lg overflow-hidden mb-3">
          <Image
            source={{ uri: vehicleImage }}
            style={styles.image}
            contentFit="cover"
          />
        </View>
      )}

      {/* DETAILS */}
      <View className="flex flex-row justify-between mb-2">
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color="#4b5563"
          />
          <Text className="text-gray-600 text-sm">
            {transferTime ? `${transferTime} min` : "-"}
          </Text>
        </View>

        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="account-group"
            size={16}
            color="#4b5563"
          />
          <Text className="text-gray-600 text-sm">Up to {maxPax}</Text>
        </View>

        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="bag-checked"
            size={16}
            color="#4b5563"
          />
          <Text className="text-gray-600 text-sm">{luggage}</Text>
        </View>
      </View>

      {/* RATING */}
      {!!rating && (
        <View className="flex flex-row items-center gap-1 mb-2">
          {Array.from({ length: Math.round(Number(rating)) }).map((_, i) => (
            <MaterialIcons key={i} name="star" size={16} color="#facc15" />
          ))}
          <Text className="text-sm text-gray-500 ml-1">({rating})</Text>
        </View>
      )}

      {/* CANCELLATION */}
      {!!canxHours && (
        <Text className="text-xs text-gray-500 mb-2">
          Free cancellation up to {canxHours} hrs • {canxPerc}% refund
        </Text>
      )}

      {/* PAYMENT */}
      {/* <Text className="text-xs text-gray-500 mb-3">
        Payment: {isCardPaymentAvailable ? "Card Supported" : "Pay at Pickup"}
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

export default TransferListItem;
