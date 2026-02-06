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
  const { conversations, joinConversation, leaveConversation } =
    useConversation();

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
    const conv = conversations.find((c) => c._id === conversationId);
    joinConversation(conversationId as string);

    if (!conv) return;
    const otherUser = conv.participants.find((c) => c._id !== user._id);

    setLoading(true);
    setName(otherUser?.name || "N/A");
    setAvatar((otherUser?.avatar as string) || undefined);
    setOtherUserId(otherUser?._id || null);
    setStatus(otherUser?.status || "offline");

    getConversationMessages();
    setLoading(false);

    return () => {
      leaveConversation(conversationId as string);
    };
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

      <View className="w-full flex flex-row items-end gap-2 bg-white rounded-xl px-2">
        <View className="flex-1">
          <Input
            type="string"
            placeholder="Write a message..."
            multiline
            maxHeight={130}
            value={text}
            onChange={setText}
          />
        </View>

        <View className="flex flex-row items-center gap-2 mb-3">
          <TouchableOpacity activeOpacity={0.8} onPress={handleSend}>
            <MaterialCommunityIcons
              name="send-outline"
              size={24}
              color="#4b5563"
            />
          </TouchableOpacity>

          <MaterialCommunityIcons
            name="microphone-outline"
            size={24}
            color="#4b5563"
          />
          <MaterialCommunityIcons
            name="emoticon-outline"
            size={24}
            color="#4b5563"
          />
          <MaterialCommunityIcons
            name="cloud-arrow-up-outline"
            size={24}
            color="#4b5563"
          />
        </View>
      </View>
    </ChatContainer>
  );
};

export default ChatDM;
