import { IConversation } from "@/types/conversation";
import { Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../providers/AuthProvider";
import Avatar from "./Avatar";

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
  const { user } = useAuth();

  if (!user?._id) return;

  const otherUser =
    item.type === "dm" ? item.participants.find((i) => i._id === myId) : null;
  const myUnread = item.unread?.[user?._id] || 0;

  const formatTime = (dateInput: string | number | Date): string => {
    const date = new Date(dateInput);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      className="w-full flex flex-row items-center gap-3 border-b border-gray-200 py-2"
      onPress={() => onPress(item._id as string)}
    >
      <Avatar source={otherUser?.avatar} name={otherUser?.name} size={40} />

      <View className="flex-1 flex flex-row items-start justify-between">
        <View>
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
        <View className="flex flex-col items-end justify-between">
          <Text className="font-dm-sans-medium text-xs text-gray-700">
            {formatTime(item.lastMessage?.createdAt || new Date())}
          </Text>
          {myUnread > 0 && (
            <View className="w-8 h-8 flex items-center justify-center bg-red-500 rounded-full">
              <Text className="font-poppins-semibold text-xs text-white">
                {myUnread}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ConversationItem;
