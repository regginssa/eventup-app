import { useAuth } from "@/components/providers/AuthProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  _id: otherUserId,
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
  const [messageLoading, setMessageLoading] = useState<boolean>(false);

  const router = useRouter();
  const { conversations, createConversation } = useConversation();
  const { user } = useAuth();

  const formattedRate = rate
    ? rate.toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 20,
      })
    : 0;

  const handleMessage = async () => {
    if (!otherUserId || !user?._id) return;
    if (user._id === otherUserId) {
      return Alert.alert("Error", "Something went wrong");
    }

    try {
      setMessageLoading(true);

      const conversation = conversations.find(
        (c) =>
          c.type === "dm" && c.participants.some((p) => p._id === otherUserId),
      );

      if (!conversation) {
        const newConv = await createConversation("dm", {
          user1Id: user._id,
          user2Id: otherUserId,
        });

        router.push({
          pathname: "/conversation/chat/dm",
          params: { conversationId: newConv._id },
        });
      } else {
        router.push({
          pathname: "/conversation/chat/dm",
          params: { conversationId: conversation._id },
        });
      }
    } catch (error) {
      console.log("[handle message error]: ", error);
    } finally {
      setMessageLoading(false);
    }
  };

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
            {!isMe && (
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center"
                onPress={handleMessage}
              >
                {messageLoading ? (
                  <ActivityIndicator size={18} color="#374151" />
                ) : (
                  <MaterialCommunityIcons
                    name="message-outline"
                    size={18}
                    color="#374151"
                  />
                )}
              </TouchableOpacity>
            )}

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

        <Text className="font-dm-sans text-xs text-gray-700 w-full p-2 rounded-lg bg-white">
          {description}
        </Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
