import { IMessage } from "@/types/message";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";

interface MessageItemProps {
  message: IMessage;
  userId: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, userId }) => {
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
    <View
      className={`w-full flex flex-row ${isMine ? "justify-end" : "justify-start"}`}
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

          <Ionicons
            name={
              message.status === "sent"
                ? "checkmark-outline"
                : "checkmark-done-outline"
            }
            size={16}
            color="#16a34a"
          />
        </View>
      </View>
    </View>
  );
};

export default MessageItem;
