import { IMessage, TMessageFile } from "@/types/message";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Directory, File, Paths } from "expo-file-system";
import { Image } from "expo-image";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useToast } from "../providers/ToastProvider";
import Avatar from "./Avatar";
import Modal from "./Modal";

interface MessageItemProps {
  type: "dm" | "group";
  message: IMessage;
  isMine: boolean;
  onLongPressMessage: (messageId: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({
  type,
  message,
  isMine,
  onLongPressMessage,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<TMessageFile | null>(null);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  const toast = useToast();

  const sender = message.sender;

  const formatTime = (dateInput: string | number | Date): string => {
    const date = new Date(dateInput);

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const downloadFile = async (url: string) => {
    try {
      setDownloadLoading(true);

      const destination = new Directory(Paths.cache, "eventup", "files");

      // Download into the file
      destination.create();
      const output = await File.downloadFileAsync(url, destination);
      toast.success(`File is downloaded`);
    } catch (error) {
      console.log("File download error:", error);
      toast.error("Download failed");
    } finally {
      setDownloadLoading(false);
    }
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
          gap: 10,
        }}
      >
        {type === "group" && !isMine && (
          <Avatar source={sender.avatar} name={sender.name} size={40} />
        )}
        <View
          className={`w-2/3 ${isMine ? "bg-green-200" : "bg-slate-200"} rounded-xl p-2`}
        >
          {message.files.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="w-full"
            >
              <View className="w-full flex flex-row items-center gap-2">
                {message.files.map((file, index) => (
                  <TouchableOpacity
                    key={file.url}
                    activeOpacity={0.8}
                    className="w-[80px] h-[80px] relative overflow-hidden flex items-center justify-center rounded-xl"
                    onPress={async () => {
                      if (file.type === "image") {
                        setSelectedImage(file);
                        setIsOpen(true);
                      } else if (file.type === "file") {
                        await downloadFile(file.url);
                      }
                    }}
                  >
                    {file.type === "image" ? (
                      <Image
                        source={{ uri: file.url }}
                        alt="Image"
                        style={{ width: "100%", height: "100%" }}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        name="file-document-outline"
                        size={40}
                        color="#1f2937"
                      />
                    )}

                    {downloadLoading && (
                      <View className="absolute inset-0 flex items-center justify-center bg-white/30 opacity-70">
                        <ActivityIndicator size={24} color="#1f2937" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
          <Text className="font-poppins-medium text-sm text-gray-800">
            {message.text}
          </Text>

          <View className="w-full flex flex-row items-center justify-end gap-2">
            {message.isEdited && (
              <Text className="font-dm-sans-medium text-gray-600 text-xs">
                Edited
              </Text>
            )}
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

      <Modal
        title="Image Viewer"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <View className="flex-1">
          <Image
            source={{ uri: selectedImage?.url }}
            alt="Image"
            style={{ flex: 1, width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </View>
      </Modal>
    </>
  );
};

export default MessageItem;
