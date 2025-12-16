import { ITransferAvailability } from "@/types";
import { formatEventDate, getCurrencySymbol } from "@/utils/format";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

interface TransferItemProps {
  transfer: ITransferAvailability | undefined;
}

const TransferItem: React.FC<TransferItemProps> = ({ transfer }) => {
  if (!transfer) {
    return null;
  }

  const product = transfer?.travelling?.products?.[0];
  const journeyFrom = transfer?.searchResult?.originName || "";
  const journeyTo = transfer?.searchResult?.endName || "";
  const travelDate = transfer?.searchResult?.travelling || "";
  const adults = transfer?.searchResult?.adults || "0";
  const children = transfer?.searchResult?.children || "0";
  const infants = transfer?.searchResult?.infants || "0";

  const vehicleType = product?.general?.productType || "";
  const transferCompany = product?.general?.transferCompany || "";
  const transferTime = product?.general?.transferTime || "";
  const luggage = product?.general?.luggage || "";
  const smallBagAllowance = product?.general?.smallBagAllowance || "";
  const rating = product?.general?.rating || "";
  const numberOfReviews = product?.general?.numberOfReviews || "";
  const canxHours = product?.general?.canxHours || "";
  const canxPerc = product?.general?.canxPerc || "";

  const price = product?.pricing?.price || "";
  const currency = product?.pricing?.currency?.toUpperCase() || "";

  const extras =
    product?.pricing?.extras?.map((e) => ({
      type: e.extra.type,
      price: e.extra.price,
      currency: e.extra.currency,
    })) || [];

  const vehicleImage = product?.general?.vehicleImage || "";

  return (
    <View className="w-full px-2 overflow-hidden flex flex-col gap-2">
      {/* FROM */}
      <View className="w-full flex flex-row items-start gap-4 justify-between">
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons name="airport" size={16} color="#4b5563" />
          <Text className="font-dm-sans-medium text-sm text-gray-600">
            From:
          </Text>
        </View>
        <Text className="font-poppins-semibold text-gray-600 line-clamp-2 flex-1 text-right">
          {journeyFrom || "-"}
        </Text>
      </View>

      {/* TO */}
      <View className="w-full flex flex-row items-start gap-4 justify-between">
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons name="map-marker" size={16} color="#4b5563" />
          <Text className="font-dm-sans-medium text-sm text-gray-600">To:</Text>
        </View>
        <Text className="font-poppins-semibold text-gray-600 text-right flex-1 line-clamp-2">
          {journeyTo || "-"}
        </Text>
      </View>

      {/* TRAVEL DATE */}
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
          {travelDate ? formatEventDate(new Date(travelDate)) : "-"}
        </Text>
      </View>

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
          {adults !== "0" && `${adults} Adult${adults !== "1" ? "s" : ""}`}
          {children !== "0" &&
            `${adults !== "0" ? ", " : ""}${children} Child${
              children !== "1" ? "ren" : ""
            }`}
          {infants !== "0" &&
            `${
              adults !== "0" || children !== "0" ? ", " : ""
            }${infants} Infant${infants !== "1" ? "s" : ""}`}
          {adults === "0" && children === "0" && infants === "0" && "-"}
        </Text>
      </View>

      {/* VEHICLE TYPE */}
      <View className="w-full flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons name="car" size={16} color="#4b5563" />
          <Text className="font-dm-sans-medium text-sm text-gray-600">
            Vehicle Type:
          </Text>
        </View>
        <Text className="font-poppins-semibold text-gray-600">
          {vehicleType || "-"}
        </Text>
      </View>

      {/* TRANSFER COMPANY */}
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
          {transferCompany || "-"}
        </Text>
      </View>

      {/* TRANSFER TIME */}
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
          {transferTime ? `${transferTime} min` : "-"}
        </Text>
      </View>

      {/* LUGGAGE */}
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
          {luggage || "-"}
        </Text>
      </View>

      {/* RATING */}
      {rating && (
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
            {Array.from({ length: Number(rating) }).map((_, idx) => (
              <MaterialIcons key={idx} name="star" size={18} color="#facc15" />
            ))}
          </View>
        </View>
      )}

      <View className="w-full relative overflow-hidden rounded-lg h-[150px]">
        <Image
          source={{ uri: vehicleImage }}
          style={styles.image}
          contentFit="cover"
          alt="Vehicle Image"
        />
      </View>

      {/* PRICE */}
      <View className="w-full flex flex-row items-center justify-between">
        <Text className="font-dm-sans-bold text-gray-700 text-lg">
          Total Price:
        </Text>
        <Text className="font-poppins-bold text-gray-600 text-xl">
          <Text className="text-base">
            {getCurrencySymbol(currency.toLowerCase() as any)}
          </Text>
          {price}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
});

export default TransferItem;
