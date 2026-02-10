import { markMessagesSeenRest } from "@/api/services/message";
import { ChatContainer, Input, MessageItem, Spinner } from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { useMessage } from "@/components/providers/MessageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { IMessage } from "@/types/message";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TFile } from "./dm";

const ChatGroup = () => {
  const [avatar, setAvatar] = useState<string | undefined>("");
  const [name, setName] = useState<string>("");
  const [files, setFiles] = useState<TFile[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const [isMessageActionsOpen, setIsMessageActionsOpen] =
    useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const [editText, setEditText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

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

      setName(conv?.name || "N/A");
      setAvatar(conv?.avatar as string | undefined);
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

  const handleSend = () => {};

  const handleEdit = () => {};

  const startRecording = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
    console.log("[audio recording uri]: ", audioRecorder.uri);
  };

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

      <View className="w-full flex flex-row items-end gap-2 bg-white rounded-xl px-2">
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

          {files.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="w-full"
            >
              <View className="w-full flex flex-row items-center gap-2 py-2">
                {files.map((file) => (
                  <View
                    key={file.uri}
                    className="w-[80px] h-[80px] flex items-center justify-center gap-4 rounded-xl overflow-hidden relative"
                  >
                    {file.type === "image" ? (
                      <Image
                        key={file.uri}
                        source={{ uri: file.uri }}
                        alt={file.name}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    ) : (
                      <>
                        <MaterialCommunityIcons
                          name="file-document-outline"
                          size={32}
                          color="#4b5563"
                        />

                        <Text
                          className="font-dm-sans-medium text-sm text-gray-600"
                          numberOfLines={1}
                        >
                          {file.name}
                        </Text>
                      </>
                    )}

                    <TouchableOpacity
                      activeOpacity={0.8}
                      className="absolute w-8 h-8 flex items-center justify-center bg-gray-300 rounded-full top-0 right-0"
                      disabled={uploadLoading}
                      onPress={() => {
                        setFiles((prev) =>
                          prev.filter((p) => p.uri !== file.uri),
                        );
                      }}
                    >
                      <Feather name="x" size={14} color="#1f2937" />
                    </TouchableOpacity>

                    {uploadLoading && (
                      <View className="absolute inset-0 flex items-center justify-center z-40 bg-white/30 opacity-70">
                        <ActivityIndicator size={18} color="#1f2937" />
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
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

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={recorderState.isRecording ? stopRecording : startRecording}
          >
            <MaterialCommunityIcons
              name={
                recorderState.isRecording
                  ? "stop-circle-outline"
                  : "microphone-outline"
              }
              size={24}
              color="#4b5563"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsUploadOpen(true)}
          >
            <MaterialCommunityIcons
              name="cloud-arrow-up-outline"
              size={24}
              color="#4b5563"
            />
          </TouchableOpacity>
        </View>
      </View>
    </ChatContainer>
  );
};

export default ChatGroup;
