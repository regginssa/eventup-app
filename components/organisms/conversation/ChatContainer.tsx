import { Avatar } from "@/components/common";
import { TOnlineStatus } from "@/types/user";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainContainer } from "../layout";

interface ChatContainerProps {
  children: React.ReactNode;
  conversationId: string | null;
  otherUserId: string | null;
  name: string;
  avatar?: string;
  status: TOnlineStatus;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  children,
  conversationId,
  otherUserId,
  name,
  avatar,
  status,
}) => {
  const router = useRouter();

  return (
    <MainContainer>
      <SafeAreaView className="flex-1 gap-5 px-5">
        <View className="w-full flex flex-row items-center justify-between sticky top-0">
          <View className="flex flex-row items-center gap-4">
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-10 h-10 rounded-full bg-white flex flex-col items-center justify-center"
              onPress={() => router.back()}
            >
              <Feather name="arrow-left" size={16} color="#4b5563" />
            </TouchableOpacity>

            <View className="flex flex-row items-center gap-2">
              <Avatar source={avatar} name={name} size={40} status={status} />

              <Text className="font-poppins-semibold text-xs text-gray-800">
                {name}
              </Text>
            </View>
          </View>

          <View className="flex flex-row items-center gap-2">
            <MaterialCommunityIcons
              name="dots-vertical"
              size={20}
              color="#1f2937"
            />
          </View>
        </View>

        <View className="flex-1 gap-5">{children}</View>
      </SafeAreaView>
    </MainContainer>
  );
};

export default ChatContainer;
