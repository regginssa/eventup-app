import conversationServices from "@/api/services/conversation";
import notificationServices from "@/api/services/notification";
import { IConversation } from "@/types/conversation";
import { IEvent, TAttendees } from "@/types/event";
import { INotification } from "@/types/notification";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "../common";
import { useConversation } from "../providers/ConversationProvider";
import { useNotification } from "../providers/NotificationProvider";
import { useToast } from "../providers/ToastProvider";

interface AttendeesCardGroupProps {
  items: TAttendees[];
  event?: IEvent;
}

const AttendeesCardGroup: React.FC<AttendeesCardGroupProps> = ({
  items,
  event,
}) => {
  const [inviteLoading, setInviteLoading] = useState<Map<string, boolean>>(
    new Map(),
  );
  const [isValidInvite, setIsValidInvite] = useState<Map<string, boolean>>(
    new Map(),
  );
  const { conversations, addNewConversation, updateConversation } =
    useConversation();
  const { send: sendNotification } = useNotification();
  const toast = useToast();

  useEffect(() => {
    const conv = conversations.find(
      (c) => c.type === "group" && c.event?._id === event?._id,
    );
    if (!conv) return;
    const attendeeIds = new Set(items.map((i) => i.user._id));
    const nextMap = new Map<string, boolean>();
    for (const p of conv.participants) {
      nextMap.set(p._id as string, attendeeIds.has(p._id));
    }
    setIsValidInvite(nextMap);
  }, [conversations, event, items]);

  const handleInvite = async (userId: string) => {
    if (!event?._id) return;

    const conv = conversations.find(
      (c) => c.type === "group" && c.event?._id === event._id,
    );

    if (!conv) return;

    if (conv?.participants.some((p) => p._id === userId)) {
      return toast.error("The user has already joined the group chat");
    }

    try {
      setInviteLoading((prev) => {
        const next = new Map(prev);
        next.set(userId, true);
        return next;
      });

      // Add the user to the conversation participants
      const convBodyData: IConversation = {
        ...conv,
        participants: [...conv.participants, userId as any],
      };

      const convRes = await conversationServices.update(
        conv._id as string,
        convBodyData,
      );

      if (convRes.data) {
        updateConversation({ conversationId: conv._id, userId });
        addNewConversation(convRes.data);
      }

      // Send an invitation notification to the user
      const newNotification: INotification = {
        type: "receive_invite_group_chat",
        metadata: {
          conversationId: conv?._id,
          eventId: event._id,
        },
        title: `Invitation`,
        body: `You have been invited to "${event.name}" group chat`,
        user: userId as any,
        isRead: false,
        isArchived: false,
        link: "/conversation/chat/group",
      };

      const notifyRes = await notificationServices.create(newNotification);

      if (notifyRes.ok) {
        sendNotification({ notificationId: notifyRes.data._id, userId });
      }
    } catch (err) {
      toast.error("Invitation failed");
    } finally {
      setInviteLoading((prev) => {
        const next = new Map(prev);
        next.set(userId, false);
        return next;
      });
    }
  };

  if (items.length === 0) {
    return (
      <View className="flex-1">
        <MaterialCommunityIcons
          name="file-document-remove-outline"
          size={48}
          color="#1f2937"
        />
        <Text className="text-gray-800 font-poppins-semibold">
          No Attendees
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: TAttendees }) => {
    const { user, ticket, status } = item;

    const formattedRate = user.rate
      ? user.rate.toLocaleString(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 20,
        })
      : 0;

    return (
      <View
        key={item.user._id}
        className="w-full flex flex-row items-center gap-6 px-4 py-2 bg-slate-100 rounded-xl"
      >
        <View className="flex flex-col items-center justify-center gap-2">
          <Avatar size={40} source={user.avatar} name={user.name} />
          <View className="flex flex-row items-center gap-2">
            <Text className="font-poppins-semibold text-sm text-gray-800">
              {user.name}
            </Text>
            <View className="flex flex-row items-center gap-1">
              <MaterialCommunityIcons
                name="star"
                size={14}
                color={user.rate && user.rate > 0 ? "#eab308" : "#94a3b8"}
              />
              <Text className="font-dm-sans-medium text-gray-700 text-sm">
                {formattedRate}
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center gap-2">
            <Text className="font-dm-sans-medium text-sm text-gray-700">
              {user.location.city.name}, {user.location.country.code}
            </Text>
          </View>
        </View>

        <View className="flex-1 gap-3 flex flex-col items-center justify-center">
          {status !== "blocked" && ticket && (
            <View className="w-full flex flex-row items-start justify-center gap-2">
              <MaterialCommunityIcons
                name={
                  ticket?.status === "deposited"
                    ? "clock-outline"
                    : ticket.status === "released"
                      ? "checkbox-marked-circle-outline"
                      : "cash-refund"
                }
                size={18}
                color={
                  ticket.status === "deposited"
                    ? "#ca8a04"
                    : ticket.status === "released"
                      ? "#16a34a"
                      : "#2563eb"
                }
              />
              <Text
                className={`font-poppins-medium text-sm ${ticket.status === "deposited" ? "text-yellow-600" : ticket.status === "released" ? "text-green-600" : "text-blue-600"}`}
              >
                Ticket is {ticket?.status}
              </Text>
            </View>
          )}

          {/* <View className="flex flex-row items-start gap-2">
            <MaterialCommunityIcons
              name={
                status === "approved"
                  ? "checkbox-marked-circle-outline"
                  : "alert-circle-outline"
              }
              size={16}
              color={status === "approved" ? "#16a34a" : "#ef4444"}
            />
            <Text
              className={`font-poppins-medium text-sm ${status === "approved" ? "text-green-600" : "text-red-500"}`}
            >
              Application is {status}
            </Text>
          </View> */}

          <TouchableOpacity
            activeOpacity={0.8}
            className={`p-2 rounded-xl w-full flex flex-row items-center justify-center gap-2 ${isValidInvite.get(item.user._id as string) ? "bg-gray-400" : "bg-green-600"}`}
            disabled={
              inviteLoading.get(item.user._id as string) ||
              isValidInvite.get(item.user._id as string)
            }
            onPress={() => handleInvite(item.user._id as string)}
          >
            {inviteLoading.get(item.user._id as string) ? (
              <ActivityIndicator size={16} color="white" />
            ) : (
              <MaterialCommunityIcons
                name="account-plus-outline"
                size={16}
                color="white"
              />
            )}
            <Text className="font-poppins-medium text-sm text-white">
              {isValidInvite.get(item.user._id as string)
                ? "Invited"
                : "Invite"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1">
      {items.map((item, index) => renderItem({ item }))}
    </View>
  );
};

export default AttendeesCardGroup;
