import {
  markMessagesSeenRest,
  removeMessageById,
} from "@/api/services/message";
import {
  ChatContainer,
  Input,
  MessageItem,
  Modal,
  Spinner,
} from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { useMessage } from "@/components/providers/MessageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { IMessage, TMessageFile } from "@/types/message";
import { TOnlineStatus } from "@/types/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ChatDM = () => {
  const [name, setName] = useState<string>("N/A");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<TOnlineStatus>("offline");
  const [text, setText] = useState<string>("");
  const [files, setFiles] = useState<TMessageFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMessageActionsOpen, setIsMessageActionsOpen] =
    useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  const { conversationId } = useLocalSearchParams();
  const { user } = useAuth();
  const { conversations } = useConversation();
  const {
    loadMessages,
    joinConversation,
    leaveConversation,
    updateCurrentConversationId,
    sendMessage,
    markMessageSeen,
    updateMessage,
    removeMessage,
    messages,
  } = useMessage();
  const toast = useToast();

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [messages]);

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
      setOtherUserId(otherUser?._id || null);
      setStatus(otherUser?.status || "offline");

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

  useEffect(() => {
    if (!messages.length || !otherUserId || !user?._id || !conversationId)
      return;

    const unseen = messages.filter(
      (m) => m.sender._id !== user._id && m.status !== "seen",
    );

    if (unseen.length === 0) return;
    markMessageSeen({
      conversationId,
      userId: user._id,
    });
  }, [messages, conversationId, user?._id, otherUserId]);

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

  const handleEdit = () => {
    if (!selectedMessageId) return Alert.alert("Warn", "No selected message");
    if (editText.trim().length === 0)
      return toast.warn("Please type a message to edit");

    const message = messages.find((m) => m._id === selectedMessageId);
    if (!message) return toast.warn("No selected message");

    const updates: IMessage = {
      ...message,
      isEdited: true,
      text: editText,
    };

    updateMessage({ updates, conversationId });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!selectedMessageId) return toast.warn("No selected message");

    try {
      setDeleteLoading(true);

      await removeMessageById(selectedMessageId);

      removeMessage({
        messageId: selectedMessageId,
        conversationId,
      });

      setIsMessageActionsOpen(false);
    } catch (error) {
      console.log("[delete message error]: ", error);
    } finally {
      setDeleteLoading(false);
    }
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
            data={[...messages].reverse()}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={({ item }: { item: IMessage }) => (
              <MessageItem
                message={item}
                userId={user?._id as string}
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

      <View className="w-full flex flex-row items-end gap-2 bg-white rounded-xl px-2">
        <View className="flex-1">
          <Input
            type="string"
            placeholder="Write a message..."
            multiline
            maxHeight={130}
            value={isEditing ? editText : text}
            onChange={isEditing ? setEditText : setText}
          />
        </View>

        <View className="flex flex-row items-center gap-2 mb-3">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={isEditing ? handleEdit : handleSend}
          >
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

      {/* Message Actions */}
      <Modal
        title="Actions"
        scrolled
        isOpen={isMessageActionsOpen}
        onClose={() => {
          setSelectedMessageId("");
          setIsMessageActionsOpen(false);
        }}
      >
        <View className="w-full gap-2">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-full flex flex-row items-center gap-2 p-4 bg-gray-200 rounded-lg"
            disabled={editLoading}
            onPress={() => {
              const message = messages.find((m) => m._id === selectedMessageId);
              if (message?.sender._id !== user?._id)
                return toast.warn("The message is not yours");
              setEditText(message?.text || "");
              setIsEditing(true);
              setIsMessageActionsOpen(false);
            }}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={18}
              color="#1f2937"
            />
            <Text className="font-poppins-medium text-gray-800">Edit</Text>
            {editLoading && <ActivityIndicator size={18} color="#1f2937" />}
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="w-full flex flex-row items-center gap-2 p-4 bg-red-200 rounded-lg"
            disabled={deleteLoading}
            onPress={handleDelete}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={18}
              color="#dc2626"
            />
            <Text className="font-poppins-medium text-red-600">Delete</Text>
            {deleteLoading && <ActivityIndicator size={18} color="#dc2626" />}
          </TouchableOpacity>
        </View>
      </Modal>
    </ChatContainer>
  );
};

export default ChatDM;
