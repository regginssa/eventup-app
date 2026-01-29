import { getCurrencySymbol } from "@/src/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const HotelOfferGroup = ({
  offers,
  selectedIndex,
  onSelect,
}: {
  offers: any[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) => {
  return (
    <View className="w-full gap-2">
      <Text className="font-dm-sans text-sm text-gray-700">Select Room</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {offers?.map((hotelOffer, index) => {
          const isSelected = index === selectedIndex;
          const offerPrice = hotelOffer?.price?.total || "0";
          const offerCurrency = hotelOffer?.price?.currency || "USD";
          const offerRoomCategory =
            hotelOffer?.room?.typeEstimated?.category ||
            hotelOffer?.room?.type ||
            "Room";
          const isRefundable =
            hotelOffer?.policies?.cancellation?.type !== "FULL_STAY";

          return (
            <TouchableOpacity
              key={hotelOffer?.id || index}
              activeOpacity={0.7}
              onPress={() => onSelect(index)}
              className={`px-3 py-2 rounded-lg border-2 ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              <View className="flex flex-col gap-1">
                <Text
                  className={`font-poppins-semibold text-sm ${
                    isSelected ? "text-blue-700" : "text-gray-700"
                  }`}
                >
                  {offerRoomCategory}
                </Text>
                <Text
                  className={`font-dm-sans-medium text-xs ${
                    isSelected ? "text-blue-600" : "text-gray-600"
                  }`}
                >
                  {getCurrencySymbol(
                    (offerCurrency.toLowerCase() as any) || "usd"
                  )}
                  {offerPrice}
                </Text>
                {isRefundable && (
                  <View className="flex flex-row items-center gap-1">
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={12}
                      color={isSelected ? "#3b82f6" : "#10b981"}
                    />
                    <Text
                      className={`font-dm-sans-medium text-xs ${
                        isSelected ? "text-blue-600" : "text-green-600"
                      }`}
                    >
                      Refundable
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default HotelOfferGroup;
