import { removeConversationForMe } from "@/api/services/conversation";
import {
  ConversationContainer,
  ConversationItem,
  Input,
  NormalModal,
  Spinner,
} from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { IConversation } from "@/types/conversation";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Conversation = () => {
  const [search, setSearch] = useState<string>("");
  const [filteredConversations, setFilteredConversations] = useState<
    IConversation[]
  >([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [isActionsOpen, setIsActionsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  const router = useRouter();
  const { user } = useAuth();
  const { conversations, loadConversations, removeConversationById } =
    useConversation();
  const toast = useToast();

  useEffect(() => {
    const init = async () => {
      if (!user) return;

      setLoading(true);

      await loadConversations();

      setLoading(false);
    };

    init();
  }, [user]);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredConversations(conversations);
      return;
    }

    const filtered = conversations.filter(
      (c) =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.lastMessage?.text?.toLowerCase().includes(search.toLowerCase()),
    );

    setFilteredConversations(filtered);
  }, [conversations, search]);

  const handleLongPress = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setIsActionsOpen(true);
  };

  const handleDelete = async (type: "me" | "everyone") => {
    if (!selectedConversationId) return toast.warn("No selected conversation");
    try {
      setDeleteLoading(true);

      await removeConversationForMe(selectedConversationId);
      removeConversationById(selectedConversationId);
    } catch (error) {
      console.log("[delete conversation error]: ", error);
      toast.error("Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <ConversationContainer>
      <View className="flex-1 bg-white rounded-xl overflow-hidden p-4 gap-5">
        <Input
          type="string"
          placeholder="Search..."
          bordered
          className="w-full rounded-lg"
          value={search}
          onChange={setSearch}
        />
        {loading ? (
          <Spinner size="md" />
        ) : (
          <View className="flex-1">
            <FlatList
              data={filteredConversations}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }: { item: IConversation }) => (
                <ConversationItem
                  item={item}
                  myId={user?._id as string}
                  onPress={(conversationId: string) =>
                    router.push({
                      pathname: `/conversation/chat/${item.type}`,
                      params: { conversationId },
                    })
                  }
                  onLongPress={handleLongPress}
                />
              )}
              contentContainerStyle={{ gap: 16 }}
            />
          </View>
        )}
      </View>

      <NormalModal
        title="Actions"
        isOpen={isActionsOpen}
        onClose={() => {
          setSelectedConversationId(null);
          setIsActionsOpen(false);
        }}
      >
        <View className="w-full gap-4">
          <Text className="font-dm-sans-medium">
            Are you sure you want to delete all message history?
          </Text>
          <View className="w-full flex flex-row items-center justify-end gap-4">
            <TouchableOpacity
              activeOpacity={0.8}
              className="flex flex-row items-center gap-2 p-2 rounded-lg bg-gray-200"
              disabled={deleteLoading}
              onPress={() => handleDelete("me")}
            >
              <Text className="font-poppins-medium text-gray-800 text-sm">
                Delete For Me
              </Text>
              {deleteLoading && <ActivityIndicator size={18} color="#1f2937" />}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              className="flex flex-row items-center gap-2 p-2 rounded-lg bg-gray-200"
              disabled={deleteLoading}
              onPress={() => handleDelete("everyone")}
            >
              <Text className="font-poppins-medium text-gray-800 text-sm">
                Delete For Everyone
              </Text>
              {deleteLoading && <ActivityIndicator size={18} color="#1f2937" />}
            </TouchableOpacity>
          </View>
        </View>
      </NormalModal>
    </ConversationContainer>
  );
};

export default Conversation;
