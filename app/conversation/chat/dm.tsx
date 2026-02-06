import { ChatContainer, Input, MessageItem, Spinner } from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { useMessage } from "@/components/providers/MessageProvider";
import { IMessage, TMessageFile } from "@/types/message";
import { TOnlineStatus } from "@/types/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

const ChatDM = () => {
  const [name, setName] = useState<string>("N/A");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<TOnlineStatus>("offline");
  const [text, setText] = useState<string>("");
  const [files, setFiles] = useState<TMessageFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  const { conversationId } = useLocalSearchParams();
  const { user } = useAuth();
  const { conversations } = useConversation();
  const {
    loadMessages,
    joinConversation,
    leaveConversation,
    sendMessage,
    messages,
  } = useMessage();

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [messages]);

  useEffect(() => {
    const init = async () => {
      if (!conversationId || !user?._id) return;

      const conv = conversations.find((c) => c._id === conversationId);
      if (!conv) return;

      setLoading(true);

      const otherUser = conv.participants.find((p) => p._id !== user._id);
      setName(otherUser?.name || "N/A");
      setAvatar(otherUser?.avatar as string | undefined);
      setOtherUserId(otherUser?._id || null);
      setStatus(otherUser?.status || "offline");

      await loadMessages(conversationId as string);
      joinConversation(conversationId as string);

      setLoading(false);
    };

    init();

    // cleanup: leave room when navigating away
    return () => {
      if (conversationId) {
        // clearMessages();
        leaveConversation(conversationId as string);
      }
    };
  }, [conversationId, user?._id, conversations]);

  const handleSend = () => {
    if (text.trim().length === 0) return;

    const payload = {
      conversationId,
      senderId: user?._id,
      text,
      files,
    };

    sendMessage(payload);

    setText("");
    setFiles([]);
  };

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
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => item._id || index.toString()}
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
