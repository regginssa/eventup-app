import { TApplication } from "@/types/event";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FlatList, Text, View } from "react-native";
import { FlagButton } from "react-native-country-picker-modal";
import { Avatar } from "../common";

interface ApplicationCardGroupProps {
  items: TApplication[];
}

const ApplicationCardGroup: React.FC<ApplicationCardGroupProps> = ({
  items,
}) => {
  const renderItem = ({ item }: { item: TApplication }) => {
    const { user, ticket, status } = item;

    const formattedRate = user.rate
      ? user.rate.toLocaleString(undefined, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 20,
        })
      : 0;

    return (
      <View className="w-full flex flex-row items-center justify-between py-2 bg-slate-100 rounded-xl">
        <View className="flex flex-col items-center justify-center gap-2">
          <Avatar size={40} source={user.avatar} name={user.name} />
          <Text className="font-poppins-semibold text-sm text-gray-800">
            {user.name}
          </Text>
          <View className="flex flex-row items-center gap-2">
            <Text className="font-dm-sans-medium text-sm text-gray-700">
              {user.location.city.name}, {user.location.country.name}
            </Text>
            <FlagButton
              placeholder=""
              countryCode={user.location.country.code as any}
              containerButtonStyle={{ marginBottom: 4 }}
            />
          </View>

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
      </View>
    );
  };

  return (
    <View className="flex-1 bg-white rounded-xl p-4 gap-5">
      <Text className="font-poppins-semibold text-gray-800 text-lg">
        Applications
      </Text>
      <FlatList
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingTop: 20, gap: 24 }}
      />
    </View>
  );
};

export default ApplicationCardGroup;
