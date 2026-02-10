import { markMessagesSeenRest } from "@/api/services/message";
import { ChatContainer, MessageItem, Spinner } from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { useMessage } from "@/components/providers/MessageProvider";
import { IMessage } from "@/types/message";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-reanimated/lib/typescript/Animated";

const ChatGroup = () => {
  const [avatar, setAvatar] = useState<string | undefined>("");
  const [name, setName] = useState<string>("");
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const [isMessageActionsOpen, setIsMessageActionsOpen] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const { conversationId } = useLocalSearchParams();

  const { user } = useAuth();
  const { conversations } = useConversation();
  const {
    joinConversation,
    leaveConversation,
    loadMessages,
    updateCurrentConversationId,
    messages,
  } = useMessage();

  useEffect(() => {
    const init = async () => {
      if (!conversationId || !user?._id) return;
      updateCurrentConversationId(conversationId as string);

      const conv = conversations.find((c) => c._id === conversationId);
      if (!conv) return;

      setLoading(true);

      const otherUser = conv.participants.find((p) => p._id !== user._id);
      setName(otherUser?.name || "N/A");
      setAvatar(otherUser?.avatar as string | undefined);
      joinConversation(conversationId as string);
      await loadMessages(conversationId as string);
      await markMessagesSeenRest(conversationId as string);

      setLoading(false);
    };

    init();

    // cleanup: leave room when navigating away
    return () => {
      if (conversationId) {
        leaveConversation(conversationId as string);
      }
    };
  }, [conversationId, user?._id, conversations]);

  return (
    <ChatContainer
      conversationId={conversationId as string}
      name={name}
      avatar={avatar}
    >
      {loading ? (
        <Spinner size="md" />
      ) : (
        <View className="flex-1">
          <FlatList
            ref={flatListRef}
            data={[...messages].reverse()}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={({ item }: { item: IMessage }) => (
              <MessageItem
                type="group"
                message={item}
                isMine={item.sender._id === user?._id}
                onLongPressMessage={(messageId: string) => {
                  setSelectedMessageId(messageId);
                  setIsMessageActionsOpen(true);
                }}
              />
            )}
            inverted
            contentContainerStyle={{ gap: 16 }}
          />
        </View>
      )}
    </ChatContainer>
  );
};

export default ChatGroup;
