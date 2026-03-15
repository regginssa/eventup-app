import { TEventDates, TEventFee } from "@/types/event";
import { formatEventDateTime, getCurrencySymbol } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

interface EventDetailHeaderProps {
  image: string;
  title: string;
  category: string;
  city?: string;
  country: string;
  dates: TEventDates;
  fee?: TEventFee;
}

const EventDetailHeader: React.FC<EventDetailHeaderProps> = ({
  image,
  title,
  category,
  city,
  country,
  dates,
  fee,
}) => {
  return (
    <View className="w-full gap-5 overflow-hidden bg-white rounded-3xl p-4 border border-slate-100 shadow-sm">
      <View className="relative w-full h-[212px] overflow-hidden bg-[#F3F4F6] rounded-2xl">
        {!image ? (
          <View className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <MaterialCommunityIcons
              name="image-off-outline"
              size={48}
              color="#374151"
            />
            <Text className="text-gray-700 font-poppins-semibold">
              No Image
            </Text>
          </View>
        ) : (
          <Image
            source={{ uri: image }}
            alt={title}
            contentFit="cover"
            style={styles.image}
          />
        )}
      </View>

      <View className="gap-2">
        <Text className="font-poppins-semibold text-lg text-gray-800">
          {title}
        </Text>

        <View>
          <View className="flex flex-row items-center gap-2">
            <View className="w-4 h-4 rounded-full overflow-hidden">
              <LinearGradient
                colors={["#C427E0", "#844AFF", "#12A9FF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View className="w-2 h-2 bg-white rounded-full"></View>
              </LinearGradient>
            </View>

            <Text className="font-dm-sans text-sm text-gray-700">
              {category}
            </Text>
          </View>
        </View>
      </View>

      {/* Dividier */}
      <View className="w-full h-[1px] bg-gray-200"></View>

      <View className="gap-2">
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="map-marker-outline"
            size={16}
            color="#374151"
          />
          <Text className="font-dm-sans-medium text-sm text-gray-700">
            {city ? `${city}, ${country}` : country}
          </Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="calendar-outline"
            size={16}
            color="#374151"
          />
          <Text className="font-dm-sans-medium text-sm text-gray-700">
            {formatEventDateTime(dates?.start?.date, dates?.start?.time)}
          </Text>
        </View>

        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons
            name="clock-outline"
            size={16}
            color="#374151"
          />
          <Text className="font-dm-sans-medium text-sm text-gray-700">
            {dates.timezone ?? "--"}
          </Text>
        </View>

        {fee && (
          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="cart-outline"
              size={16}
              color="#374151"
            />
            <Text className="font-dm-sans-medium text-sm text-gray-700">
              {fee.type === "paid"
                ? `${getCurrencySymbol(fee.currency as any)} ${fee.amount}`
                : "Free"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});

export default EventDetailHeader;
