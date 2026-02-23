import { TAttendees } from "@/types/event";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { Avatar } from "../common";

interface AttendeesCardGroupProps {
  items: TAttendees[];
}

const AttendeesCardGroup: React.FC<AttendeesCardGroupProps> = ({ items }) => {
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

        <View className="flex-1 gap-3">
          {status !== "blocked" && ticket && (
            <View className="flex flex-row items-start gap-2">
              <MaterialCommunityIcons
                name={
                  ticket?.status === "deposited"
                    ? "clock-outline"
                    : "checkbox-marked-circle-outline"
                }
                size={18}
                color="#ca8a04"
              />
              <Text className="font-poppins-medium text-yellow-600 text-sm">
                Ticket is {ticket?.status}
              </Text>
            </View>
          )}

          <View className="flex flex-row items-start gap-2">
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
          </View>

          <Pressable className="p-2 rounded-xl w-full bg-green-600 flex flex-row items-center justify-center gap-2">
            <MaterialCommunityIcons
              name="account-plus-outline"
              size={16}
              color="white"
            />
            <Text className="font-poppins-medium text-sm text-white">
              Invite
            </Text>
          </Pressable>
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
