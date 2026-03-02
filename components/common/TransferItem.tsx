import { TAmadeusTransferOffer } from "@/types/amadeus";
import { StyleSheet } from "react-native";

interface TransferItemProps {
  data?: TAmadeusTransferOffer;
  hiddenHeader?: boolean;
  isHotelToEvent?: boolean;
  onSelect?: (data: TAmadeusTransferOffer) => void;
}

const TransferItem: React.FC<TransferItemProps> = ({
  data,
  hiddenHeader,
  isHotelToEvent,
  onSelect,
}) => {
  if (!data) return null;

  return (
    <>
      {/* {!hiddenHeader && (
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons name="car" size={20} color="#374151" />
          <Text className="font-dm-sans-bold text-gray-700">Transfer</Text>
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        className="w-full px-2 overflow-hidden flex flex-col gap-2"
        onPress={handleSelect}
      >
        <View className="w-full flex flex-row items-start gap-4 justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons name="airport" size={16} color="#4b5563" />
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              From:
            </Text>
          </View>
          <Text className="font-poppins-semibold text-gray-600 line-clamp-2 flex-1 text-right">
            {from || "-"} {isHotelToEvent && " (hotel)"}
          </Text>
        </View>

        <View className="w-full flex flex-row items-start gap-4 justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              To:
            </Text>
          </View>
          <Text className="font-poppins-semibold text-gray-600 text-right flex-1 line-clamp-2">
            {to || "-"}
          </Text>
        </View>

        {travelDate && (
          <View className="w-full flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="calendar-clock-outline"
                size={16}
                color="#4b5563"
              />
              <Text className="font-dm-sans-medium text-sm text-gray-600">
                Travel Date:
              </Text>
            </View>
            <Text className="font-poppins-semibold text-gray-600">
              {formatDateTime(new Date(travelDate).toISOString())}{" "}
              {formatTime(new Date(travelDate))}
            </Text>
          </View>
        )}

        <View className="w-full flex flex-row items-center justify-between">
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="account-group-outline"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans-medium text-sm text-gray-600">
              Passengers:
            </Text>
          </View>
          <Text className="font-poppins-semibold text-gray-600">
            {travelers}
          </Text>
        </View>

        {vehicleType && (
          <View className="w-full flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <MaterialCommunityIcons name="car" size={16} color="#4b5563" />
              <Text className="font-dm-sans-medium text-sm text-gray-600">
                Vehicle Type:
              </Text>
            </View>
            <Text className="font-poppins-semibold text-gray-600">
              {vehicleType}
            </Text>
          </View>
        )}

        {vehicleDescription && (
          <View className="w-full flex flex-row items-start justify-between">
            <View className="flex flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="information-outline"
                size={16}
                color="#4b5563"
              />
              <Text className="font-dm-sans-medium text-sm text-gray-600">
                Description:
              </Text>
            </View>
            <Text className="font-poppins-semibold text-gray-600 w-1/2 text-right">
              {vehicleDescription}
            </Text>
          </View>
        )}

        {transferCompany && (
          <View className="w-full flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="office-building-outline"
                size={16}
                color="#4b5563"
              />
              <Text className="font-dm-sans-medium text-sm text-gray-600">
                Company:
              </Text>
            </View>
            <Text className="font-poppins-semibold text-gray-600">
              {transferCompany}
            </Text>
          </View>
        )}

        {transferTime && (
          <View className="w-full flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color="#4b5563"
              />
              <Text className="font-dm-sans-medium text-sm text-gray-600">
                Transfer Time:
              </Text>
            </View>
            <Text className="font-poppins-semibold text-gray-600">
              {transferTime} min
            </Text>
          </View>
        )}

        {luggage && (
          <View className="w-full flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="bag-checked"
                size={16}
                color="#4b5563"
              />
              <Text className="font-dm-sans-medium text-sm text-gray-600">
                Luggage:
              </Text>
            </View>
            <Text className="font-poppins-semibold text-gray-600">
              {luggage}
            </Text>
          </View>
        )}

        {rating && rating > 0 && (
          <View className="w-full flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="star-outline"
                size={16}
                color="#4b5563"
              />
              <Text className="font-dm-sans-medium text-sm text-gray-600">
                Rating:
              </Text>
            </View>
            <View className="flex flex-row items-center gap-1">
              {Array.from({ length: rating }).map((_, idx) => (
                <MaterialIcons
                  key={idx}
                  name="star"
                  size={18}
                  color="#facc15"
                />
              ))}
            </View>
          </View>
        )}

        {vehicleImage && (
          <View className="w-full relative overflow-hidden rounded-lg h-[150px]">
            <Image
              source={{ uri: vehicleImage }}
              style={styles.image}
              contentFit="cover"
              alt="Vehicle Image"
            />
          </View>
        )}

        <View className="w-full flex flex-row items-center justify-between mt-3">
          <Text className="font-dm-sans-bold text-gray-700 text-lg">
            Total Price:
          </Text>
          <Text className="font-poppins-bold text-gray-600 text-xl">
            <Text className="text-base">
              {getCurrencySymbol(
                (price.currency.toLowerCase() as any) || "usd",
              )}
            </Text>
            {price.total}
          </Text>
        </View>
      </TouchableOpacity> */}
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  listContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
});

export default TransferItem;
