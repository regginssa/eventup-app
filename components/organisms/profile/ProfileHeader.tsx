import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { FlagButton } from "react-native-country-picker-modal";
import { Avatar } from "../../common";

const VerifiedBadge = require("@/assets/images/icons/verified_badge.png");

interface ProfileHeaderProps {
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
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  avatar,
  description,
  idVerified,
  rate,
  title,
  cityName,
  country,
}) => {
  const formattedRate = rate
    ? rate.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 20,
      })
    : 0;

  return (
    <View className="w-full flex flex-col items-center justify-center gap-4">
      <Avatar name={name} source={avatar} />

      <View className="flex flex-col items-center justify-center">
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
          <FlagButton placeholder="" countryCode={country.code as any} />
        </View>
      </View>

      <View className="w-full flex flex-col items-start">
        <Text className="font-poppins-semibold text-sm text-gray-700">
          {title}
        </Text>

        <View className="flex flex-row items-center gap-1">
          <MaterialCommunityIcons
            name="star"
            size={14}
            color={rate && rate > 0 ? "#eab308" : "#94a3b8"}
          />
          <Text className="font-dm-sans-medium text-gray-700">
            {formattedRate}
          </Text>
        </View>

        <Text className="font-dm-sans text-xs text-gray-600">
          {description}
        </Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
