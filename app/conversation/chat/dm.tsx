import { fetchConversationMessages } from "@/api/services/message";
import { ChatContainer, Input, MessageItem, Spinner } from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { IMessage } from "@/types/message";
import { TOnlineStatus } from "@/types/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";

const ChatDM = () => {
  const [name, setName] = useState<string>("N/A");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<TOnlineStatus>("offline");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const { conversationId } = useLocalSearchParams();
  const { user } = useAuth();
  const { conversations } = useConversation();

  useEffect(() => {
    const getConversationMessages = async () => {
      try {
        const response = await fetchConversationMessages(
          conversationId as string,
        );

        if (response.data) {
          setMessages(response.data);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch messages");
      }
    };

    if (!conversationId || !user?._id) return;
    setLoading(true);
    const conv = conversations.find((c) => c._id === conversationId);

    if (!conv) return;
    const otherUser = conv.participants.find((c) => c._id !== user._id);

    setName(otherUser?.name || "N/A");
    setAvatar((otherUser?.avatar as string) || undefined);
    setOtherUserId(otherUser?._id || null);
    setStatus(otherUser?.status || "offline");

    getConversationMessages();
    setLoading(false);
  }, [conversationId, user]);

  const handleSend = async () => {};

  return (
    <ChatContainer
      conversationId={conversationId as string}
      name={name}
      avatar={avatar}
      otherUserId={otherUserId}
      status={status}
    >
      {loading ? (
        <Spinner size="md" />
      ) : (
        <View className="flex-1">
          <FlatList
            data={messages}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }: { item: IMessage }) => (
              <MessageItem message={item} userId={user?._id as string} />
            )}
            contentContainerStyle={{ gap: 16 }}
          />
        </View>
      )}

      <View className="w-full flex flex-row items-center gap-4">
        <Input
          type="string"
          placeholder="Write a message..."
          className="flex-1 rounded-md"
          bordered
          value={text}
          onChange={setText}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center"
          onPress={handleSend}
        >
          <MaterialCommunityIcons name="send-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </ChatContainer>
  );
};

export default ChatDM;
