import { TAmadeusHotelOffer } from "@/types/amadeus";

interface HotelItemProps {
  data: TAmadeusHotelOffer;
  hiddenHeader?: boolean;
  hiddenImages?: boolean;
  onViewImages?: () => Promise<void>;
}

const HotelItem: React.FC<HotelItemProps> = ({
  data: offer,
  hiddenHeader,
  hiddenImages,
  onViewImages,
}) => {
  if (!offer) return null;

  // Map the offer data, with error handling
  // let data: THotelItemData;
  // try {
  //   data = mapAmadeusHotelOfferToHotelItemData(offer);
  // } catch (error) {
  //   console.error("Error mapping hotel offer:", error);
  //   return (
  //     <View className="w-full px-2 py-4">
  //       <Text className="font-poppins-semibold text-red-600">
  //         Error loading hotel data:{" "}
  //         {error instanceof Error ? error.message : "Unknown error"}
  //       </Text>
  //     </View>
  //   );
  // }

  return (
    <>
      {/* {!hiddenHeader && (
        <View className="flex flex-row items-center gap-2">
          <MaterialIcons name="hotel" size={20} color="#374151" />
          <Text className="font-dm-sans-bold text-gray-700">Hotel</Text>
        </View>
      )}
      <View className="w-full px-2 flex flex-col items-start gap-2">
        <View className="w-full flex flex-row items-start justify-between gap-6">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="home-outline"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans-medium text-gray-600 text-sm line-clamp-2">
              Hotel Name:
            </Text>
          </View>
          <Text className="font-dm-sans-medium text-gray-600">
            {data.hotelName}
          </Text>
        </View>

        <View className="w-full flex flex-row items-start justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="city-variant-outline"
              size={16}
              color="#4b5563"
            />
            <Text className="font-dm-sans-medium text-gray-600 text-sm">
              City:
            </Text>
          </View>
          <Text className="font-dm-sans-medium text-gray-600">
            {data.city || data.cityCode}
          </Text>
        </View>

        {data.checkInDate && (
          <View className="w-full flex flex-row items-start justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="calendar-clock-outline"
                size={16}
                color="#4b5563"
              />
              <Text className="font-dm-sans-medium text-gray-600 text-sm">
                Check-in:
              </Text>
            </View>
            <Text className="font-poppins-semibold text-gray-600">
              {formatDateTime(new Date(data.checkInDate).toISOString())}
            </Text>
          </View>
        )}

        {data.checkOutDate && (
          <View className="w-full flex flex-row items-start justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="calendar-check-outline"
                size={16}
                color="#4b5563"
              />
              <Text className="font-dm-sans-medium text-gray-600 text-sm">
                Check-out:
              </Text>
            </View>
            <Text className="font-poppins-semibold text-gray-600">
              {formatDateTime(new Date(data.checkOutDate).toISOString())}
            </Text>
          </View>
        )}

        {data.roomDescription && (
          <View className="w-full flex flex-row items-start justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="bed" size={16} color="#4b5563" />
              <Text className="font-dm-sans-medium text-gray-600 text-sm">
                Room:
              </Text>
            </View>
            <Text className="font-poppins-semibold text-gray-600 w-1/2 text-right">
              {data.roomCategory || data.roomType}
            </Text>
          </View>
        )}

        {(data.beds > 0 || data.bedType) && (
          <View className="w-full flex flex-row items-start justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="bed-king-outline"
                size={16}
                color="#4b5563"
              />
              <Text className="font-dm-sans-medium text-gray-600 text-sm">
                Bed:
              </Text>
            </View>
            <Text className="font-poppins-semibold text-gray-600">
              {data.beds} {data.bedType}
            </Text>
          </View>
        )}

        {data.adults > 0 && (
          <View className="w-full flex flex-row items-start justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="account-outline"
                size={16}
                color="#4b5563"
              />
              <Text className="font-dm-sans-medium text-gray-600 text-sm">
                Adults:
              </Text>
            </View>
            <Text className="font-poppins-semibold text-gray-600">
              {data.adults}
            </Text>
          </View>
        )}

        {data.distanceValue && data.distanceUnit && (
          <View className="w-full flex flex-row items-start justify-between mt-3">
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
              {data.distanceValue} {data.distanceUnit}
            </Text>
          </View>
        )}

        {data.address && (
          <View className="w-full flex flex-row items-start justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="location-pin" size={16} color="#4b5563" />
              <Text className="font-dm-sans-medium text-gray-600 text-sm">
                Address:
              </Text>
            </View>
            <Text className="font-poppins-semibold text-gray-600 w-1/2 text-right">
              {data.address.lines.join(", ")}
            </Text>
          </View>
        )}

        {data.cancellationPolicy && (
          <View className="w-full flex flex-row items-start justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="credit-card-refund-outline"
                size={16}
                color="#4b5563"
              />
              <Text className="font-dm-sans-medium text-gray-600 text-sm">
                Cancellation Policy:
              </Text>
            </View>

            <Text className="font-poppins-semibold text-gray-600 w-1/2 text-right">
              {data.cancellationPolicy}
            </Text>
          </View>
        )}

        {data.paymentType && (
          <View className="w-full flex flex-row items-start justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="payment" size={16} color="#4b5563" />
              <Text className="font-dm-sans-medium text-gray-600 text-sm">
                Payment:
              </Text>
            </View>
            <Text className="font-poppins-semibold text-gray-600 capitalize">
              {data.paymentType}
            </Text>
          </View>
        )}

        {data.facilities && data.facilities.length > 0 && (
          <View className="w-full flex flex-col gap-2">
            <View className="flex flex-row items-center gap-2">
              <MaterialIcons name="checkroom" size={16} color="#4b5563" />

              <Text className="font-dm-sans-medium text-gray-600 text-sm">
                Facilities:
              </Text>
            </View>
            <BadgeGroup badges={data.facilities} showCount={3} />
          </View>
        )}

        {!hiddenImages && (
          <View className="w-full flex flex-row items-start justify-between mt-3">
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

        <View className="w-full flex flex-row justify-between mt-3">
          <Text className="font-dm-sans-bold text-gray-800 text-lg">
            Total Price:
          </Text>
          <Text className="font-poppins-bold text-gray-700 text-xl">
            {getCurrencySymbol(
              (data.price.currency.toLowerCase() as any) || "usd"
            )}
            {data.price.total}
          </Text>
        </View>
      </View> */}
    </>
  );
};

export default HotelItem;
