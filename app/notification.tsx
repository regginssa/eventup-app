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
      <View className="shadow-xl shadow-purple-200">
        <LinearGradient
          colors={["#844AFF", "#C427E0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ borderRadius: 24, padding: 1 }}
        >
          <View
            className={`rounded-[23px] overflow-hidden flex-row ${
              isRead ? "bg-white/95" : "bg-purple-50"
            }`}
          >
            {/* UNREAD ACCENT BAR */}
            {!isRead && (
              <LinearGradient
                colors={["#C427E0", "#844AFF", "#12A9FF"]}
                style={{ width: 4 }}
              />
            )}

            <View className="flex-1 p-5">
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
                <View
                  className={`w-9 h-9 rounded-full items-center justify-center ${
                    isRead ? "bg-slate-100" : "bg-purple-100"
                  }`}
                >
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={18}
                    color={isRead ? "#64748b" : "#844AFF"}
                  />
                </View>

                {/* TITLE + BODY */}
                <View className="flex-1 pr-3">
                  <View className="flex-row items-center gap-2">
                    <Text
                      className={`text-sm ${
                        isRead
                          ? "font-poppins-medium text-slate-800"
                          : "font-poppins-bold text-slate-900"
                      }`}
                    >
                      {title}
                    </Text>

                    {!isRead && (
                      <View className="px-2 py-[2px] bg-purple-100 rounded-md">
                        <Text className="text-[9px] font-dm-sans-bold text-purple-600 uppercase">
                          New
                        </Text>
                      </View>
                    )}
                  </View>

                  {body && (
                    <Text className="font-dm-sans-medium text-[12px] text-slate-500 mt-1">
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
              <View className="flex-row items-center justify-end mt-2">
                {link && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    className="flex-row items-center gap-1 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full"
                    onPress={() =>
                      router.push({ pathname: link as any, params })
                    }
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
          </View>
        </LinearGradient>
      </View>
    );
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
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        )}
      </View>
    </SimpleContainer>
  );
};

export default NotificationScreen;
