import { Avatar } from "@/components/common";
import { RootState } from "@/store";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { FlagButton } from "react-native-country-picker-modal";
import { useSelector } from "react-redux";

const VerifiedBadge = require("@/assets/images/icons/verified_badge.png");

interface EventDetailOverviewProps {
  eventType: "ai" | "user";
  hoster?: {
    _id: string;
    avatar: string;
    title: string;
    countryName: string;
    countryCode: string;
    is_verified: boolean;
  };
  description?: string;
  notes?: string;
}

const EventDetailOverview: React.FC<EventDetailOverviewProps> = ({
  eventType,
  hoster,
  description,
  notes,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  return (
    <View className="flex-1 gap-4">
      <View className="w-full flex flex-row items-center justify-between">
        {hoster ? (
          <View className="flex flex-row items-center gap-2">
            <Avatar source={hoster.avatar} name={hoster.title} size={40} />
            <View className="">
              <View className="flex flex-row items-center gap-2">
                <Text className="font-poppins-medium text-gray-700">
                  {hoster.title}
                </Text>

                {hoster.is_verified && (
                  <Image
                    source={VerifiedBadge}
                    alt="verified"
                    style={{ width: 16, height: 16 }}
                  />
                )}
              </View>

              <View className="flex flex-row items-center gap-2">
                <FlagButton
                  placeholder=""
                  countryCode={hoster.countryCode as any}
                  containerButtonStyle={{ marginTop: -4 }}
                />
                <Text className="font-dm-sans text-gray-600 -ml-4 -mt-1">
                  {hoster.countryName}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View className="">
            <Text className="font-dm-sans-medium text-gray-800 text-sm">
              {eventType === "ai"
                ? "Event is fetched from AI"
                : "Event hoster not found"}
            </Text>
          </View>
        )}

        {hoster && hoster._id !== user?._id && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push({ pathname: "/profile", params: { id: hoster._id } })
            }
          >
            <Feather name="arrow-right" size={20} color="#374151" />
          </TouchableOpacity>
        )}
      </View>

      <View className="w-full gap-2">
        <Text className="font-poppins-semibold text-gray-700">
          About this event
        </Text>

        {description && (
          <Text className="font-dm-sans text-sm text-gray-600">
            {description}
          </Text>
        )}
        {notes && (
          <Text className="font-dm-sans text-sm text-gray-600">{notes}</Text>
        )}

        {!description && !notes && (
          <View className="w-full flex flex-col items-center justify-center gap-1">
            <MaterialCommunityIcons
              name="pencil-remove-outline"
              size={18}
              color="#37415"
            />
            <Text className="font-poppins-medium text-sm text-gray-700">
              No description
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default EventDetailOverview;
