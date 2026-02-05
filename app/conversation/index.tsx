import { fetchUserConversations } from "@/api/services/conversation";
import {
  ConversationContainer,
  ConversationItem,
  Input,
  Spinner,
} from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { IConversation } from "@/types/conversation";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

const Conversation = () => {
  const [search, setSearch] = useState<string>("");
  const [conversations, setConversations] = useState<IConversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<
    IConversation[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();
  const { otherUserId } = useLocalSearchParams();

  useEffect(() => {
    const init = async () => {
      if (!user?._id) return;
      setLoading(true);
      const response = await fetchUserConversations(user?._id);
      if (response.data) {
        setConversations(response.data);
      }
      setLoading(false);
    };

    init();
  }, []);

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

  useEffect(() => {
    if (!otherUserId) return;

    const existingDM = conversations.find(
      (c) =>
        c.type === "dm" && c.participants.some((p) => p._id === otherUserId),
    );
  }, [otherUserId, conversations]);

  return (
    <ConversationContainer>
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
                myId={user?._id || ""}
                onPress={(conversationId: string) => {
                  console.log("[selected conversation id]: ", conversationId);
                }}
              />
            )}
            contentContainerStyle={{ gap: 16 }}
          />
        </View>
      )}
    </ConversationContainer>
  );
};

export default Conversation;
