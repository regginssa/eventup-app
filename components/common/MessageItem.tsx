import { IMessage } from "@/types/message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

interface MessageItemProps {
  message: IMessage;
  userId: string;
  onLongPressMessage: (messageId: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  userId,
  onLongPressMessage,
}) => {
  const isMine = message.sender._id === userId;

  const formatTime = (dateInput: string | number | Date): string => {
    const date = new Date(dateInput);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <>
      <Pressable
        onLongPress={() => onLongPressMessage(message._id as string)}
        delayLongPress={300}
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: isMine ? "flex-end" : "flex-start",
          marginVertical: 6,
        }}
      >
        <View
          className={`w-2/3 ${isMine ? "bg-green-200" : "bg-slate-200"} rounded-xl p-2`}
          style={{ maxHeight: 200 }}
        >
          <ScrollView>
            <Text className="font-poppins-medium text-sm text-gray-800">
              {message.text}
            </Text>
          </ScrollView>

          <View className="w-full flex flex-row items-center justify-end gap-2">
            <Text className="font-dm-sans-medium text-gray-600 text-xs">
              {formatTime(message.createdAt)}
            </Text>

            <MaterialCommunityIcons
              name={message.status === "sent" ? "check" : "check-all"}
              size={16}
              color={message.status === "sent" ? "#4b5563" : "#16a34a"}
            />
          </View>
        </View>
      </Pressable>
    </>
  );
};

export default MessageItem;
