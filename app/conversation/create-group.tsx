import { uploadFile } from "@/api/services/upload";
import { Avatar, Button, CreateGroupChatContainer, Input } from "@/components";
import { TAvatar } from "@/components/common/Avatar";
import { useAuth } from "@/components/providers/AuthProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { IConversation } from "@/types/conversation";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

const Logo = require("@/assets/images/logo.png");

const CreateGroupChat = () => {
  const [avatar, setAvatar] = useState<TAvatar | null>(null);
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { createGroupConversation } = useConversation();
  const toast = useToast();

  const handleSubmit = async () => {
    if (!eventId || !user?._id) {
      toast.warn("Something went wrong");
      return router.back();
    }

    try {
      setLoading(true);

      const fileUri = avatar?.uri;
      const fileName = avatar?.name || `photo_${Date.now()}.jpg`;
      const mimeType = avatar?.mimeType || "image/jpeg";

      const formData = new FormData();
      formData.append("file", {
        uri: fileUri,
        name: fileName,
        type: mimeType,
      } as any);

      const uploaded = await uploadFile(formData);
      if (!uploaded.data) {
        toast.error("Uploading avatar failed");
        return setLoading(false);
      }

      const bodyData: IConversation = {
        avatar: uploaded.data,
        name,
        participants: [user._id as any],
        createdAt: new Date(),
        updatedAt: new Date(),
        hiddenFor: [],
        type: "group",
        creator: user._id as any,
        event: eventId as any,
      };

      const newConv = await createGroupConversation(bodyData);

      if (newConv) {
        router.push({
          pathname: "/conversation/chat/group",
          params: { conversationId: newConv._id },
        });
      }
    } catch (err) {
      console.log("[create conversation error]: ", err);
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CreateGroupChatContainer>
      <View className="flex-1 flex flex-col items-center justify-center gap-10">
        <View className="w-full gap-2 flex items-center justify-center">
          <Image
            source={Logo}
            alt="Logo"
            style={{ width: 80, height: 80 }}
            contentFit="cover"
          />
          <Text className="font-poppins-semibold text-2xl mb-2 text-gray-800">
            Start Your Group Chat
          </Text>
          <Text className="font-dm-sans text-gray-700 text-center">
            Give your group a name and image so your attendees know they’re in
            the right place. You can update these details anytime.
          </Text>
        </View>

        <View className="w-full rounded-xl flex flex-col items-center justify-center gap-4 bg-gray-200 border-2 border-white  px-6 py-10">
          <Avatar
            source={avatar?.uri}
            size={120}
            name=""
            onChange={setAvatar}
          />

          <Input
            type="string"
            label="Group Name"
            placeholder="Your group name"
            className="rounded-lg"
            bordered
            icon={
              <MaterialCommunityIcons
                name="account-group-outline"
                size={16}
                color="#4b5563"
              />
            }
            value={name}
            onChange={setName}
          />
        </View>

        <View className="w-full">
          <Button
            type="primary"
            label="Submit"
            buttonClassName="h-12"
            icon={
              <MaterialCommunityIcons
                name="arrow-right"
                size={16}
                color="white"
              />
            }
            iconPosition="right"
            disabled={!avatar || name.trim().length === 0}
            loading={loading}
            onPress={handleSubmit}
          />
        </View>
      </View>
    </CreateGroupChatContainer>
  );
};

export default CreateGroupChat;
