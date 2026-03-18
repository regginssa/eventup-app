import { Spinner } from "@/components";
import { SimpleContainer } from "@/components/organisms/layout";
import { useNotification } from "@/components/providers/NotificationProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { INotification } from "@/types/notification";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { notifications, load, markRead, remove } = useNotification();
  const toast = useToast();
  const router = useRouter();

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

  const handleRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: INotification }) => {
    const { isRead, title, body, link, metadata, type } = item;

    let params = {};

    switch (type) {
      case "receive_invite_group_chat":
        params = { conversationId: metadata.conversationId };
        break;

      case "booking_payment_completed":
        params = { id: metadata.bookingId };
        break;
    }

    return (
      <View className="mb-4 shadow-xl shadow-purple-200">
        <LinearGradient
          colors={["#844AFF", "#C427E0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 24, padding: 1 }}
        >
          <View
            className={`rounded-[23px] p-5 overflow-hidden ${
              isRead ? "bg-white/95" : "bg-purple-50"
            }`}
          >
            {/* Background Icon */}
            <View className="absolute -right-10 -top-10 opacity-[0.05]">
              <MaterialCommunityIcons
                name="bell-outline"
                size={140}
                color="#000"
              />
            </View>

            {/* HEADER */}
            <View className="flex-row items-start gap-3 mb-3">
              {/* ICON */}
              <View className="w-9 h-9 rounded-full bg-purple-100 items-center justify-center">
                <MaterialCommunityIcons
                  name="bell-outline"
                  size={18}
                  color="#844AFF"
                />
              </View>

              {/* TITLE + BODY */}
              <View className="flex-1 pr-3">
                <Text className="font-poppins-bold text-sm text-slate-900 mb-1">
                  {title}
                </Text>

                {body && (
                  <Text className="font-dm-sans-medium text-[12px] text-slate-500">
                    {body}
                  </Text>
                )}
              </View>

              {/* DELETE */}
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={deletings?.get(item._id as string)}
                onPress={() => handleRemove(item._id as string)}
                className="w-8 h-8 items-center justify-center rounded-full bg-slate-50 border border-slate-100"
              >
                {deletings?.get(item._id as string) ? (
                  <ActivityIndicator size={12} color="#dc2626" />
                ) : (
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={16}
                    color="#dc2626"
                  />
                )}
              </TouchableOpacity>
            </View>

            {/* ACTION ROW */}
            <View className="flex-row items-center justify-between mt-2">
              {/* UNREAD INDICATOR */}
              {!isRead && (
                <View className="flex-row items-center gap-1">
                  <View className="w-2 h-2 rounded-full bg-purple-500" />

                  <Text className="font-dm-sans-bold text-[10px] text-purple-500 uppercase">
                    New Notification
                  </Text>
                </View>
              )}

              {/* VIEW LINK */}
              {link && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  className="flex-row items-center gap-1 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full"
                  onPress={() => router.push({ pathname: link as any, params })}
                >
                  <Text className="font-dm-sans-bold text-[11px] text-purple-600">
                    View
                  </Text>

                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={14}
                    color="#844AFF"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SimpleContainer title="Notifications">
      <View className="flex-1 bg-white rounded-3xl px-6">
        {loading ? (
          <Spinner size="md" />
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingTop: 20, gap: 24 }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </SimpleContainer>
  );
};

export default NotificationScreen;
