import {
  markMessagesSeenRest,
  removeMessageById,
} from "@/api/services/message";
import { uploadFile } from "@/api/services/upload";
import {
  ChatContainer,
  Input,
  MessageItem,
  Modal,
  NormalModal,
  Spinner,
  Streamer,
} from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { useMessage } from "@/components/providers/MessageProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { MAX_FILE_SIZE } from "@/config/env";
import { IMessage, TMessageFile } from "@/types/message";
import { TOnlineStatus } from "@/types/user";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export type TFile = {
  type: "image" | "file";
  name: string;
  mimeType: string;
  uri: string;
};

const ChatDM = () => {
  const [name, setName] = useState<string>("N/A");
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [otherUserId, setOtherUserId] = useState<string | undefined>(undefined);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [status, setStatus] = useState<TOnlineStatus>("offline");
  const [text, setText] = useState<string>("");
  const [files, setFiles] = useState<TFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMessageActionsOpen, setIsMessageActionsOpen] =
    useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");
  const [selectedMessageId, setSelectedMessageId] = useState<string>("");
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [imgUploadLoading, setImgUploadLoading] = useState<boolean>(false);
  const [docUploadLoading, setDocUploadLoading] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [voiceLoading, setVoiceLoading] = useState<boolean>(false);

  const flatListRef = useRef<FlatList>(null);
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

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
    removeMessages,
    blockDM,
    unblockDM,
    messages,
  } = useMessage();
  const toast = useToast();

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });
    })();
  }, []);

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
      setOtherUserId(otherUser?._id || undefined);
      setStatus(otherUser?.status || "offline");
      setBlockedUsers(otherUser?.blockedUsers || []);

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

  const getMimeType = (uri: string) => {
    const ext = uri.split(".").pop()?.toLowerCase();

    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "png") return "image/png";
    if (ext === "heic") return "image/heic";
    return "application/octet-stream";
  };

  const handleSend = async () => {
    if (text.trim().length === 0 && files.length === 0) return;

    let uploadedFiles: TMessageFile[] = [];

    if (files.length > 0) {
      try {
        setUploadLoading(true);

        for (const file of files) {
          const uri = file.uri;
          const name = file.name || `file_${Date.now()}`;
          const mimeType =
            file.mimeType ||
            (file.type === "image"
              ? getMimeType(file.uri)
              : "application/octet-stream");

          const formData = new FormData();
          formData.append("file", { uri, name, type: mimeType } as any);

          const response = await uploadFile(formData);

          if (response?.data) {
            uploadedFiles.push({
              type: file.type,
              url: response.data,
            });
          }
        }
      } catch (error) {
      } finally {
        setUploadLoading(false);
      }
    }

    const payload = {
      conversationId,
      senderId: user?._id,
      text,
      files: uploadedFiles,
    };

    sendMessage(payload);

    setText("");
    setFiles([]);
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

  const handleImagePicker = async () => {
    setImgUploadLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      console.log("uploaded image data:", result.assets[0]);
    }

    if (result?.assets) {
      const assets = result.assets;
      let imgs: TFile[] = [];

      for (const asset of assets) {
        if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
          toast.warn("Image size must be less than 5MB");
          setImgUploadLoading(false);
          return;
        }

        const img = {
          type: "image",
          name: asset.fileName,
          mimeType: asset.mimeType,
          uri: asset.uri,
        };

        imgs.push(img as any);
      }

      setFiles([...files, ...imgs]);
      toast.success(`Picked ${imgs.length} images`);
    }
    setImgUploadLoading(false);
  };

  const handleDocumentPicker = async () => {
    setDocUploadLoading(true);
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (!result.assets || result.assets.length === 0)
      return setDocUploadLoading(false);
    const assets = result.assets;
    let docs: TFile[] = [];

    for (const asset of assets) {
      const doc: TFile = {
        type: "file",
        name: asset.name,
        mimeType: asset.mimeType as string,
        uri: asset.uri,
      };
      docs.push(doc);
    }
    setFiles([...files, ...docs]);
    setDocUploadLoading(false);
    toast.success(`Picked ${docs.length} files`);
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

  const handleDeleteAll = async () => {
    const ids = messages.map((m) => m._id);
    await removeMessages(ids as string[]);
  };

  const handleBlock = async () => {
    if (!user?._id || !otherUserId) return;
    await blockDM(otherUserId);
  };

  const handleUnblock = async () => {
    if (!user?._id || !otherUserId) return;
    await unblockDM(otherUserId);
  };

  const isSendDisabled =
    user?.blockedUsers.some((bu) => bu === otherUserId) ||
    blockedUsers.some((bu) => bu === user?._id);
  const meBlocked = user?.blockedUsers.some((bu) => bu === otherUserId);

  return (
    <ChatContainer
      type="dm"
      conversationId={conversationId as string}
      name={name}
      avatar={avatar}
      otherUserId={otherUserId}
      status={status}
      isBlocked={isSendDisabled}
      onDeleteAll={handleDeleteAll}
      onBlock={handleBlock}
    >
      {loading ? (
        <Spinner size="md" text="Loading messages..." />
      ) : (
        <View className="flex-1 relative bg-white rounded-3xl p-6">
          <FlatList
            ref={flatListRef}
            data={[...messages].reverse()}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={({ item }: { item: IMessage }) => (
              <MessageItem
                type="dm"
                message={item}
                isMine={item.sender._id === user?._id}
                onLongPressMessage={(messageId: string) => {
                  if (isSendDisabled) return;
                  setSelectedMessageId(messageId);
                  setIsMessageActionsOpen(true);
                }}
              />
            )}
            inverted
            contentContainerStyle={{ gap: 16 }}
          />

          {isSendDisabled && (
            <View className="absolute inset-0 z-40 bg-white/80 rounded-3xl items-center justify-center px-8">
              <View className="items-center gap-4">
                <View className="bg-red-100 p-4 rounded-full">
                  <AntDesign name="block" size={28} color="#dc2626" />
                </View>

                <Text className="text-lg font-poppins-bold text-gray-900 text-center">
                  {meBlocked
                    ? "You blocked this user"
                    : "You can’t send messages to this user"}
                </Text>

                <Text className="text-gray-500 text-center leading-5">
                  {meBlocked
                    ? "You can't send messages while this user is blocked. Unblock them to continue the conversation."
                    : "This conversation is unavailable right now."}
                </Text>

                {meBlocked && (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className="mt-2 bg-red-500 px-6 py-2 rounded-full"
                    onPress={handleUnblock}
                  >
                    <Text className="text-white font-poppins-semibold">
                      Unblock user
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      )}

      <View className="w-full flex flex-row items-end gap-2 bg-white rounded-xl pl-2 pr-4 py-2">
        <View className="flex-1 flex flex-col gap-2">
          <View className="w-full">
            <Input
              type="string"
              placeholder="Write a message..."
              multiline
              disabled={isSendDisabled}
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

        <View className="flex flex-row items-center gap-2 mb-2">
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isSendDisabled}
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
            disabled={voiceLoading || isSendDisabled}
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

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isSendDisabled}
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

      {/* Message Actions */}
      <NormalModal
        title="Message Actions"
        isOpen={isMessageActionsOpen}
        onClose={() => {
          setSelectedMessageId("");
          setIsMessageActionsOpen(false);
        }}
      >
        <View className="w-full gap-3">
          {/* EDIT MESSAGE */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={editLoading}
            className="flex-row items-center justify-between p-4 rounded-xl bg-gray-100 border border-gray-200"
            onPress={() => {
              const message = messages.find((m) => m._id === selectedMessageId);

              if (!message) return;

              if (message.sender._id !== user?._id) {
                toast.warn("You can only edit your own message");
                return;
              }

              setEditText(message.text || "");
              setIsEditing(true);
              setIsMessageActionsOpen(false);
            }}
          >
            <View className="flex-row items-center gap-3">
              {/* ICON */}
              <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={18}
                  color="#374151"
                />
              </View>

              {/* TEXT */}
              <View>
                <Text className="font-poppins-semibold text-gray-900 text-[15px]">
                  Edit Message
                </Text>
                <Text className="text-gray-500 text-xs">
                  Modify the content of your message
                </Text>
              </View>
            </View>

            {editLoading && <ActivityIndicator size={18} color="#374151" />}
          </TouchableOpacity>
          {/* DELETE MESSAGE */}
          <TouchableOpacity
            activeOpacity={0.85}
            disabled={deleteLoading}
            onPress={handleDelete}
            className="flex-row items-center justify-between p-4 rounded-xl bg-red-50 border border-red-200"
          >
            <View className="flex-row items-center gap-3">
              {/* ICON */}
              <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={18}
                  color="#dc2626"
                />
              </View>

              {/* TEXT */}
              <View>
                <Text className="font-poppins-semibold text-red-600 text-[15px]">
                  Delete Message
                </Text>
                <Text className="text-red-400 text-xs">
                  This action cannot be undone
                </Text>
              </View>
            </View>

            {deleteLoading && <ActivityIndicator size={18} color="#dc2626" />}
          </TouchableOpacity>
        </View>
      </NormalModal>

      <Modal
        title="Upload"
        scrolled
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      >
        <View className="w-full flex flex-row items-center gap-4">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-1/2 flex-1 flex flex-col items-center justify-center gap-2 border border-gray-400 rounded-xl py-4"
            disabled={imgUploadLoading}
            onPress={handleImagePicker}
          >
            {imgUploadLoading ? (
              <ActivityIndicator size={18} color="#1f2937" />
            ) : (
              <MaterialCommunityIcons
                name="image-outline"
                size={18}
                color="#1f2937"
              />
            )}
            <Text className="font-dm-sans-medium text-sm text-gray-800">
              Image
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            className="w-1/2 flex-1 flex flex-col items-center justify-center gap-2 border border-gray-400 rounded-xl py-4"
            disabled={docUploadLoading}
            onPress={handleDocumentPicker}
          >
            {docUploadLoading ? (
              <ActivityIndicator size={18} color="#1f2937" />
            ) : (
              <MaterialCommunityIcons
                name="file-document-outline"
                size={18}
                color="#1f2937"
              />
            )}
            <Text className="font-dm-sans-medium text-sm text-gray-800">
              File
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ChatContainer>
  );
};

export default ChatDM;
