import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { FlagButton } from "react-native-country-picker-modal";
import { Avatar } from "../../common";

const VerifiedBadge = require("@/assets/images/icons/verified_badge.png");

interface ProfileHeaderProps {
  _id?: string;
  name: string;
  avatar?: string;
  idVerified: boolean;
  cityName: string;
  country: {
    name: string;
    code: string;
  };
  rate?: number;
  title: string;
  description: string;
  isMe?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  _id,
  name,
  avatar,
  description,
  idVerified,
  rate,
  title,
  cityName,
  country,
  isMe,
}) => {
  const router = useRouter();

  const formattedRate = rate
    ? rate.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 20,
      })
    : 0;

  return (
    <View className="w-full flex flex-col items-center justify-center gap-4">
      <Avatar name={name} source={avatar} size={120} />

      <View className="flex flex-col items-center justify-center gap-2">
        <View className="flex flex-row items-center gap-2">
          <Text className="font-poppins-semibold text-sm text-gray-800">
            {name}
          </Text>

          {idVerified ? (
            <Image
              source={VerifiedBadge}
              alt="Verified"
              style={{ width: 16, height: 16 }}
            />
          ) : (
            <Text className="py-0.5 px-2 rounded-lg bg-slate-200 text-gray-600 font-dm-sans-medium text-xs">
              Unverified
            </Text>
          )}
        </View>

        <View className="flex flex-row items-center gap-2">
          <Text className="font-dm-sans-medium text-xs text-gray-600">
            {cityName}, {country.name}
          </Text>
          <FlagButton
            placeholder=""
            countryCode={country.code as any}
            containerButtonStyle={{ marginTop: -5 }}
          />
        </View>
      </View>

      <View className="w-full flex flex-col items-start gap-2">
        <View className="w-full flex flex-row items-center justify-between">
          <Text className="font-poppins-semibold text-sm text-gray-700">
            {title}
          </Text>

          <View className="flex flex-row items-center gap-2">
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center"
            >
              <MaterialCommunityIcons
                name="share-variant-outline"
                size={18}
                color="#374151"
              />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-8 h-8 rounded-lg bg-white flex items-center justify-center"
              onPress={() =>
                router.push({
                  pathname: "/conversation",
                  params: { otherUserId: _id },
                })
              }
            >
              <MaterialCommunityIcons
                name="message-outline"
                size={18}
                color="#374151"
              />
            </TouchableOpacity>

            {isMe && (
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center"
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={18}
                  color="#374151"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View className="flex flex-row items-center gap-1">
          <MaterialCommunityIcons
            name="star"
            size={14}
            color={rate && rate > 0 ? "#eab308" : "#94a3b8"}
          />
          <Text className="font-dm-sans-medium text-gray-700 text-sm">
            {formattedRate}
          </Text>
        </View>

        <Text className="font-dm-sans text-xs text-gray-700 w-full p-2 rounded-lg bg-white">
          {description}
        </Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
