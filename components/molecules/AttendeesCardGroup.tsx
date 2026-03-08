import conversationServices from "@/api/services/conversation";
import notificationServices from "@/api/services/notification";
import { IConversation } from "@/types/conversation";
import { IAttendees, IEvent } from "@/types/event";
import { INotification } from "@/types/notification";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Avatar } from "../common";
import { useConversation } from "../providers/ConversationProvider";
import { useNotification } from "../providers/NotificationProvider";
import { useToast } from "../providers/ToastProvider";

interface AttendeesCardGroupProps {
  items: IAttendees[];
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

    if (!conv) return toast.info("Please create a group chat first");

    if (conv.participants.some((p) => p._id === userId)) {
      return toast.error("The user has already joined the group chat");
    }

    try {
      setInviteLoading((prev) => {
        const next = new Map(prev);
        next.set(userId, true);
        return next;
      });

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

      const newNotification: INotification = {
        type: "receive_invite_group_chat",
        metadata: {
          conversationId: conv._id,
          eventId: event._id,
        },
        title: "Invitation",
        body: `You have been invited to "${event.name}" group chat`,
        user: userId as any,
        isRead: false,
        isArchived: false,
        link: "/conversation/chat/group",
      };

      const notifyRes = await notificationServices.create(newNotification);

      if (notifyRes.ok) {
        sendNotification({
          notificationId: notifyRes.data._id,
          userId,
        });
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
      <View className="flex-1 items-center justify-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
        <View className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-sm mb-4">
          <MaterialCommunityIcons
            name="file-document-remove-outline"
            size={32}
            color="#94a3b8"
          />
        </View>

        <Text className="text-slate-800 font-poppins-semibold text-lg">
          Empty Attendees
        </Text>

        <Text className="text-slate-400 font-dm-sans-medium text-center px-8 text-sm mt-1">
          Your attendees will be here.
        </Text>
      </View>
    );
  }

  const renderItem = (item: IAttendees) => {
    const { user, ticket, status } = item;

    const formattedRate = user.rate
      ? user.rate.toLocaleString(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 2,
        })
      : "0";

    const isInvited = isValidInvite.get(user._id as string);
    const loading = inviteLoading.get(user._id as string);

    const ticketColor =
      ticket?.status === "deposited"
        ? "#ca8a04"
        : ticket?.status === "released"
          ? "#16a34a"
          : "#2563eb";

    const ticketIcon =
      ticket?.status === "deposited"
        ? "clock-outline"
        : ticket?.status === "released"
          ? "checkbox-marked-circle-outline"
          : "cash-refund";

    return (
      <View
        key={user._id}
        className="w-full flex-row items-center bg-white px-4 py-4 mb-3 rounded-2xl border border-slate-100"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.03,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <Avatar size={48} source={user.avatar} name={user.name} />

        <View className="flex-1 ml-4">
          <View className="flex-row items-center gap-2">
            <Text className="font-poppins-semibold text-sm text-gray-900">
              {user.name}
            </Text>

            <View className="flex-row items-center gap-1">
              <MaterialCommunityIcons
                name="star"
                size={14}
                color={user.rate && user.rate > 0 ? "#eab308" : "#94a3b8"}
              />

              <Text className="font-dm-sans-medium text-xs text-gray-600">
                {formattedRate}
              </Text>
            </View>
          </View>

          <Text className="font-dm-sans-medium text-xs text-gray-500 mt-1">
            {user.location.city.name}, {user.location.country.code}
          </Text>

          {status !== "blocked" && ticket && (
            <View className="flex-row items-center gap-2 mt-2">
              <MaterialCommunityIcons
                name={ticketIcon as any}
                size={16}
                color={ticketColor}
              />

              <Text
                className="font-dm-sans-medium text-xs"
                style={{ color: ticketColor }}
              >
                Ticket {ticket.status}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={loading || isInvited}
          onPress={() => handleInvite(user._id as string)}
          className="px-4 py-2 rounded-xl flex-row items-center gap-2"
          style={{
            backgroundColor: isInvited ? "#94a3b8" : "#16a34a",
          }}
        >
          {loading ? (
            <ActivityIndicator size={14} color="white" />
          ) : (
            <MaterialCommunityIcons
              name="account-plus-outline"
              size={14}
              color="white"
            />
          )}

          <Text className="text-white text-xs font-poppins-medium">
            {isInvited ? "Invited" : "Invite"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View className="flex-1">{items.map((item) => renderItem(item))}</View>
  );
};

export default AttendeesCardGroup;
