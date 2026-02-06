import {
  ConversationContainer,
  ConversationItem,
  Input,
  Spinner,
} from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { useConversation } from "@/components/providers/ConversationProvider";
import { IConversation } from "@/types/conversation";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

const Conversation = () => {
  const [search, setSearch] = useState<string>("");
  const [filteredConversations, setFilteredConversations] = useState<
    IConversation[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();
  const { conversations } = useConversation();

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
