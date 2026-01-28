import { RootState } from "@/redux/store";
import { TAmadeusTransferOffer } from "@/types/amadeus";
import { formatDateTime, formatTime, getCurrencySymbol } from "@/utils/format";
import { mapAmadeusTransferOfferToTransferItemData } from "@/utils/map";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

// TTransferItemData - essential fields from Amadeus Transfer Offer
export type TTransferItemData = {
  // Transfer ID
  id: string;
  transferType: string;

  // Locations
  from: string;
  to: string;

  // Travel date
  travelDate: string;

  // Passengers
  adults: number;
  children: number;
  infants: number;

  // Vehicle info
  vehicleType: string;
  vehicleDescription: string;
  vehicleImage?: string;
  seats: number;
  luggage: string; // Formatted luggage info

  // Service provider
  transferCompany: string;
  companyLogo?: string;

  // Transfer details
  transferTime?: string; // in minutes (estimated or actual)

  // Price
  price: {
    total: string;
    currency: string;
    base?: string;
  };

  // Optional fields
  distance?: {
    value: number;
    unit: string;
  };
  cancellationPolicy?: string;
  rating?: number;
};

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

  const {
    from,
    to,
    travelDate,
    vehicleType,
    vehicleDescription,
    vehicleImage,
    luggage,
    transferCompany,
    transferTime,
    price,
    rating,
  } = mapAmadeusTransferOfferToTransferItemData(data);

  const { travelers } = useSelector((state: RootState) => state.booking);

  const handleSelect = () => {
    if (onSelect) {
      onSelect(data);
    }
  };

  return (
    <>
      {!hiddenHeader && (
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
        {/* FROM */}
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

        {/* TO */}
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

        {/* TRAVEL DATE */}
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

        {/* PASSENGERS */}
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

        {/* VEHICLE TYPE */}
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

        {/* VEHICLE DESCRIPTION */}
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

        {/* TRANSFER COMPANY */}
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

        {/* TRANSFER TIME */}
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

        {/* LUGGAGE */}
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

        {/* RATING */}
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

        {/* VEHICLE IMAGE */}
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

        {/* PRICE */}
        <View className="w-full flex flex-row items-center justify-between mt-3">
          <Text className="font-dm-sans-bold text-gray-700 text-lg">
            Total Price:
          </Text>
          <Text className="font-poppins-bold text-gray-600 text-xl">
            <Text className="text-base">
              {getCurrencySymbol(
                (price.currency.toLowerCase() as any) || "usd"
              )}
            </Text>
            {price.total}
          </Text>
        </View>
      </TouchableOpacity>
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
