import { THotelAvailability } from "@/types";
import { getCurrencySymbol } from "@/utils/format";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BadgeGroup } from "../molecules";

interface HotelItemProps {
  hotel: THotelAvailability;
  hiddenHeader?: boolean;
  hiddenImages?: boolean;
  onViewImages?: () => Promise<void>;
}

const HotelItem: React.FC<HotelItemProps> = ({
  hotel,
  hiddenHeader,
  hiddenImages,
  onViewImages,
}) => {
  return (
    <>
      {!hiddenHeader && (
        <View className="flex flex-row items-center gap-2">
          <MaterialIcons name="hotel" size={20} color="#374151" />
          <Text className="font-dm-sans-bold text-gray-700">Hotel</Text>
        </View>
      )}
      <View className="w-full px-2 flex flex-col items-start gap-2">
        {/* IMAGE + NAME */}
        <View className="flex-row gap-3 mt-2">
          <View className="w-20 h-20 relative rounded-lg overflow-hidden">
            {hotel.thumbNailUrl ? (
              <Image
                source={{ uri: hotel.thumbNailUrl }}
                alt={hotel.hotelName}
                style={styles.image}
                contentFit="cover"
              />
            ) : (
              <View className="w-20 h-20 flex flex-col items-center justify-center gap-1">
                <MaterialIcons
                  name="image-not-supported"
                  size={18}
                  color="#374151"
                />
                <Text className="font-poppins-semibold text-gray-700 text-sm text-center">
                  No Hotel Image
                </Text>
              </View>
            )}
          </View>
          <View className="flex-1">
            <Text className="font-poppins-bold text-gray-800 text-base">
              {hotel.hotelName}
            </Text>

            <Text className="font-dm-sans-medium text-gray-500">
              {hotel.city}
            </Text>

            {/* STARS */}
            <View className="flex-row items-center gap-1 mt-1">
              {Array.from({ length: hotel.hotelRating }).map((_, idx) => (
                <MaterialIcons
                  key={idx}
                  name="star"
                  size={14}
                  color="#facc15"
                />
              ))}
            </View>
          </View>
        </View>

        {/* DISTANCE */}
        <View className="flex-row items-start justify-between mt-3">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans-medium text-gray-600 text-sm">
              Distance From City Center:
            </Text>
          </View>
          <Text className="font-poppins-semibold text-gray-600">
            {hotel.distanceValue} {hotel.distanceUnit}
          </Text>
        </View>

        {/* ADDRESS */}
        <View className="flex-row items-start justify-between mt-2">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="location-pin" size={16} color="#4b5563" />
            <Text className="font-dm-sans-medium text-gray-600 text-sm">
              Address:
            </Text>
          </View>
          <Text className="font-poppins-semibold text-gray-600 w-1/2 text-right">
            {hotel.address}
          </Text>
        </View>

        {/* REFUNDABILITY */}
        <View className="flex-row items-start justify-between mt-2">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="credit-card-refund-outline"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans-medium text-gray-600 text-sm">
              Refundability:
            </Text>
          </View>

          <Text className="font-poppins-semibold text-gray-600">
            {hotel.fareType}
          </Text>
        </View>

        {/* FACILITIES */}
        <View className="w-full flex flex-col gap-2 mt-2">
          <View className="flex flex-row items-center gap-2">
            <MaterialIcons name="checkroom" size={16} color="#4b5563" />

            <Text className="font-dm-sans-medium text-gray-600 text-sm">
              Facilities:
            </Text>
          </View>
          <BadgeGroup badges={hotel.facilities} showCount={3} />
        </View>

        {/* HOTEL IMAGES */}
        {!hiddenImages && (
          <View className="flex-row items-start justify-between mt-3">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="image-search"
                size={16}
                color="#4b5563"
              />
              <Text className="font-dm-sans-medium text-gray-600 text-sm">
                Pictures:
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              className="flex flex-row items-center just gap-1"
              onPress={onViewImages}
            >
              <Text className="font-poppins-semibold text-gray-600">View</Text>
              <MaterialIcons name="chevron-right" size={16} color="#4b5563" />
            </TouchableOpacity>
          </View>
        )}

        {/* PRICE */}
        <View className="flex-row justify-between mt-3">
          <Text className="font-dm-sans-bold text-gray-800 text-lg">
            Total Price:
          </Text>
          <Text className="font-poppins-bold text-gray-700 text-xl">
            {getCurrencySymbol(hotel.currency.toLowerCase() as any)}
            {hotel.total}
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default HotelItem;
