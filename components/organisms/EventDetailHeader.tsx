import { EventDates } from "@/types/event";
import { formatEventDateTime } from "@/utils/format";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

interface EventDetailHeaderProps {
  image: string;
  title: string;
  category: string;
  city?: string;
  country: string;
  dates: EventDates;
}

const EventDetailHeader: React.FC<EventDetailHeaderProps> = ({
  image,
  title,
  category,
  city,
  country,
  dates,
}) => {
  return (
    <View className="w-full gap-5 overflow-hidden">
      <Image
        source={image}
        alt={title}
        contentFit="cover"
        style={{ width: "100%", height: 212, borderRadius: 10 }}
      />
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
          <Fontisto name="map-marker-alt" size={20} color="#374151" />
          <Text className="font-dm-sans-medium text-sm text-gray-700">
            {city ? `${city}, ${country}` : country}
          </Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={16} color="#374151" />
          <Text className="font-dm-sans-medium text-sm text-gray-700">
            {formatEventDateTime(
              dates.start.date as string,
              dates.start.time as string
            )}{" "}
            ({dates.timezone ?? "--"})
          </Text>
        </View>
      </View>
    </View>
  );
};

export default EventDetailHeader;
