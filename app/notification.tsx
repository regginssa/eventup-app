import { Spinner } from "@/components";
import { SimpleContainer } from "@/components/organisms/layout";
import { useNotification } from "@/components/providers/NotificationProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { INotification } from "@/types/notification";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const NotificationScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [deletings, setDeletings] = useState<Map<string, boolean>>(new Map());
  const { notifications, markRead, remove } = useNotification();
  const toast = useToast();
  const router = useRouter();

  const renderItem = ({ item }: { item: INotification }) => {
    const { isRead, title, body, link, metadata, type } = item;

    let params = {};

    switch (type) {
      case "receive_invite_group_chat":
        params = { conversationId: metadata.conversationId };
      default:
        params = {};
    }

    return (
      <View
        className={`w-full p-2 rounded-xl ${isRead ? "bg-white" : "bg-gray-200"}`}
      >
        <View className="flex flex-row items-start gap-2 mb-2">
          <Text className="flex-1 font-poppins-medium text-sm text-gray-800">
            {title}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={deletings?.get(item._id as string)}
            onPress={() => handleRemove(item._id as string)}
          >
            {deletings?.get(item._id as string) ? (
              <ActivityIndicator size={20} color="#dc2626" />
            ) : (
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={20}
                color="#dc2626"
              />
            )}
          </TouchableOpacity>
        </View>
        {body && (
          <Text className="font-dm-sans-medium text-sm text-gray-600">
            {body}
          </Text>
        )}
        {link && (
          <TouchableOpacity
            activeOpacity={0.8}
            className="flex flex-row items-end gap-1"
            onPress={() => router.push({ pathname: link as any, params })}
          >
            <Text className="font-dm-sans-medium text-sm text-blue-600">
              View
            </Text>
            <MaterialCommunityIcons
              name="arrow-right"
              color="#2563eb"
              size={14}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await markRead();
      setLoading(false);
    };

    init();
  }, [notifications]);

  const handleRemove = async (id: string) => {
    try {
      setDeletings((prev) => {
        const next = new Map(prev);
        next.set(id, true);
        return next;
      });
      await remove(id);
    } catch (err) {
      toast.error("Remove failed");
    } finally {
      setDeletings((prev) => {
        const next = new Map(prev);
        next.set(id, false);
        return next;
      });
    }
  };

  return (
    <SimpleContainer title="Notifications">
      <View className="flex-1 -mt-6">
        {loading ? (
          <Spinner size="md" />
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingTop: 20, gap: 24 }}
          />
        )}
      </View>
    </SimpleContainer>
  );
};

export default NotificationScreen;
