import { Avatar } from "@/components/common";
import { TOnlineStatus } from "@/types/user";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainContainer } from "../layout";

interface ChatContainerProps {
  children: React.ReactNode;
  conversationId: string | null;
  otherUserId?: string;
  name: string;
  avatar?: string;
  status?: TOnlineStatus;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  children,
  otherUserId,
  name,
  avatar,
  status,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  return (
    <MainContainer>
      <View className="flex-1">
        <SafeAreaView className="flex-1 gap-5 px-5">
          <View className="w-full flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
                onPress={() => router.back()}
              >
                <Feather name="arrow-left" size={16} color="#4b5563" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={
                  otherUserId
                    ? () =>
                        router.push({
                          pathname: "/profile",
                          params: { id: otherUserId },
                        })
                    : undefined
                }
                className="flex flex-row items-center gap-2"
              >
                <Avatar source={avatar} name={name} size={40} status={status} />

                <Text className="font-poppins-semibold text-sm text-gray-800">
                  {name}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center relative"
              onPress={() => setIsOpen(true)}
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={16}
                color="#4b5563"
              />
            </TouchableOpacity>
          </View>

          <View className="flex-1 gap-5">{children}</View>
        </SafeAreaView>

        {isOpen && (
          <>
            <Pressable
              onPress={() => setIsOpen(false)}
              className="absolute inset-0 bg-transparent z-40"
            />

            <View className="absolute top-[88px] right-6 w-[180px] bg-white p-4 rounded-lg z-50 shadow-lg flex flex-col gap-4">
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex flex-row items-center gap-2"
                onPress={() => {
                  setIsOpen(false);
                }}
              >
                <MaterialCommunityIcons
                  name="phone-outline"
                  size={18}
                  color="#1f2937"
                />
                <Text className="font-dm-sans-medium text-sm text-gray-800">
                  Call
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                className="flex flex-row items-center gap-2"
                onPress={() => {
                  setIsOpen(false);
                }}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={18}
                  color="#1f2937"
                />
                <Text className="font-dm-sans-medium text-sm text-gray-800">
                  Delete All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                className="flex flex-row items-center gap-2"
                onPress={() => {
                  setIsOpen(false);
                }}
              >
                <Ionicons name="ban" size={18} color="#1f2937" />
                <Text className="font-dm-sans-medium text-sm text-gray-800">
                  Block
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </MainContainer>
  );
};

export default ChatContainer;
