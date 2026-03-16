import { markMessagesSeenRest } from "@/api/services/message";
import { uploadFile } from "@/api/services/upload";
import {
  Avatar,
  ChatContainer,
  Input,
  MessageItem,
  NormalModal,
  Spinner,
  Streamer,
} from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { useMessage } from "@/components/providers/MessageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { IConversation } from "@/types/conversation";
import { IMessage } from "@/types/message";
import { IUser } from "@/types/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ChatGroup = () => {
  const [conversation, setConversation] = useState<IConversation | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const [isMessageActionsOpen, setIsMessageActionsOpen] =
    useState<boolean>(false);
  const [isViewGroupOpen, setIsViewGroupOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [editText, setEditText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [voiceLoading, setVoiceLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const SCREEN_HEIGHT = Dimensions.get("window").height;

  const { conversationId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { conversations } = useConversation();
  const {
    joinConversation,
    leaveConversation,
    loadMessages,
    updateCurrentConversationId,
    sendMessage,
    updateMessage,
    messages,
  } = useMessage();
  const toast = useToast();

  const getMimeType = (uri: string) => {
    const ext = uri.split(".").pop()?.toLowerCase();

    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "png") return "image/png";
    if (ext === "heic") return "image/heic";
    return "application/octet-stream";
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        toast.warn("Permission to access microphone was denied");
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!conversationId || !user?._id) return;
      updateCurrentConversationId(conversationId as string);

      const conv = conversations.find((c) => c._id === conversationId);
      if (!conv) return;

      setLoading(true);

      setConversation(conv);
      joinConversation(conversationId as string);
      await loadMessages(conversationId as string);
      await markMessagesSeenRest(conversationId as string, user._id);

      setLoading(false);
    };

    init();

    // cleanup: leave room when navigating away
    return () => {
      if (conversationId) {
        leaveConversation(conversationId as string);
      }
    };
  }, [conversationId]);

  const handleSend = () => {
    if (text.trim().length === 0) return;

    const payload = {
      conversationId,
      senderId: user?._id,
      text,
      files: [],
    };

    sendMessage(payload);
    setText("");
  };

  const handleEdit = () => {
    if (!selectedMessageId) return toast.warn("No selected message");
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

  const startRecording = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    setVoiceLoading(true);
    await audioRecorder.stop();
    await handleVoice();
    setVoiceLoading(false);
  };

  const handleVoice = async () => {
    if (!audioRecorder.uri) return;

    try {
      const uriParts = audioRecorder.uri.split("/");
      const fileName = uriParts[uriParts.length - 1];

      const formData = new FormData();
      formData.append("file", {
        uri: audioRecorder.uri,
        name: fileName,
        type: "audio/m4a",
      } as any);

      const response = await uploadFile(formData);

      if (response.data) {
        sendMessage({
          conversationId,
          senderId: user?._id,
          text: "",
          files: [
            {
              type: "audio",
              url: response.data,
              mimeType: "audio/m4a",
            },
          ],
        });
      } else {
        toast.error("Upload failed");
      }

      console.log("[uploaded url]: ", response.data);
    } catch (error) {
      console.log("[handle voice error]: ", error);
      toast.error("Something went wrong");
    } finally {
    }
  };

  const renderMembers = ({ item }: { item: IUser }) => {
    return (
      <View className="w-full flex flex-row items-center gap-2">
        <Avatar
          source={item.avatar}
          name={item.name}
          size={32}
          status={item.status}
        />
        <Text className="font-poppins-medium text-sm text-gray-800">
          {item.name}
        </Text>
      </View>
    );
  };

  return (
    <ChatContainer
      type="group"
      conversationId={conversationId as string}
      name={conversation?.name || "N/A"}
      avatar={conversation?.avatar}
      onViewGroup={() => {
        if (!conversation) return;
        setIsViewGroupOpen(true);
      }}
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

      <View className="w-full flex flex-row items-end gap-2 bg-white rounded-xl pl-2 pr-4 py-2">
        <View className="flex-1 flex flex-col gap-2">
          <View className="w-full">
            <Input
              type="string"
              placeholder="Write a message..."
              multiline
              maxHeight={130}
              value={isEditing ? editText : text}
              onChange={isEditing ? setEditText : setText}
            />
          </View>

          {recorderState.isRecording && (
            <View className="h-[100px] w-full px-4 pb-4">
              <Streamer isPlaying={recorderState.isRecording} />
            </View>
          )}
        </View>

        <View className="flex flex-row items-center gap-2 mb-2">
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

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={recorderState.isRecording ? stopRecording : startRecording}
          >
            {voiceLoading ? (
              <ActivityIndicator size={24} color="#4b5563" />
            ) : (
              <MaterialCommunityIcons
                name={
                  recorderState.isRecording
                    ? "stop-circle-outline"
                    : "microphone-outline"
                }
                size={24}
                color="#4b5563"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* View Group Modal */}
      <NormalModal
        isOpen={isViewGroupOpen}
        onClose={() => setIsViewGroupOpen(false)}
      >
        <View className="w-full flex flex-col items-center justify-center gap-4">
          <Avatar
            source={conversation?.avatar}
            name={conversation?.name}
            size={80}
          />
          <Text className="font-poppins-semibold text-gray-800">
            {conversation?.name || "N/A"}
          </Text>
        </View>

        <View className="w-full gap-2">
          <View className="w-full flex flex-row items-start gap-4 border-b border-gray-300 py-2">
            <View className="flex flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="account-outline"
                size={16}
                color="#374151"
              />
              <Text className="font-dm-sans-medium text-sm text-gray-700">
                Creator:
              </Text>
            </View>

            <Text className="font-poppins-semibold text-sm text-gray-800 flex-1">
              {conversation?.creator?.name}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "/profile",
                  params: { id: conversation?.creator?._id },
                })
              }
            >
              <MaterialCommunityIcons
                name="arrow-right"
                size={16}
                color="#1f2937"
              />
            </TouchableOpacity>
          </View>

          <View className="w-full flex flex-row items-start gap-4 border-b border-gray-300 py-2">
            <View className="flex flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="calendar-check-outline"
                size={16}
                color="#374151"
              />
              <Text className="font-dm-sans-medium text-sm text-gray-700">
                Event:
              </Text>
            </View>

            <Text className="font-poppins-semibold text-sm text-gray-800 flex-1">
              {conversation?.event?.name}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname:
                    `/event/details/${conversation?.event?.type}` as any,
                  params: { id: conversation?.event?._id },
                })
              }
            >
              <MaterialCommunityIcons
                name="arrow-right"
                size={16}
                color="#1f2937"
              />
            </TouchableOpacity>
          </View>

          <View className="w-full flex flex-row items-center gap-4 py-2">
            <View className="w-full flex flex-row items-center gap-2">
              <MaterialCommunityIcons
                name="account-group-outline"
                size={16}
                color="#374151"
              />
              <Text className="font-dm-sans-medium text-sm text-gray-700">
                Members:
              </Text>
            </View>

            <Text className="font-poppins-semibold text-sm text-gray-800">
              {conversation?.participants.length}
            </Text>
          </View>

          <View style={{ maxHeight: SCREEN_HEIGHT * 0.4 }}>
            <FlatList
              data={conversation?.participants}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderMembers}
              contentContainerStyle={{ gap: 16 }}
            />
          </View>
        </View>
      </NormalModal>
    </ChatContainer>
  );
};

export default ChatGroup;
