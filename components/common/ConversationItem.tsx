import { IConversation } from "@/types/conversation";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

interface ConversationItemProps {
  item: IConversation;
  myId: string;
  onPress: (conversationId: string) => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  item,
  myId,
  onPress,
}) => {
  const otherUser =
    item.type === "dm" ? item.participants.find((i) => i._id === myId) : null;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="w-full flex flex-row items-center gap-3 p-4 bg-white rounded-xl"
      onPress={() => onPress(item._id as string)}
    >
      <Image
        source={{ uri: item.avatar || otherUser?.avatar }}
        style={{ width: 50, height: 50, borderRadius: 25 }}
      />

      <View className="flex-1 flex flex-row items-center">
        <Text className="font-poppins-semibold text-sm text-gray-800">
          {item.type === "dm" ? otherUser?.name : item.name}
        </Text>

        <Text
          className="font-dm-sans-medium text-xs text-gray-700"
          numberOfLines={1}
        >
          {item.lastMessage?.text || "No messages yet"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ConversationItem;
