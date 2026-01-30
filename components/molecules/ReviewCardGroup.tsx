import { IReview } from "@/types/review";
import { formatDateTime } from "@/utils/format";
import { ScrollView, Text, View } from "react-native";
import { Avatar } from "../common";

interface ReviewCardGroupProps {
  items: IReview[];
}

const ReviewCardGroup: React.FC<ReviewCardGroupProps> = ({ items }) => {
  return (
    <ScrollView>
      <View className="flex-1 flex flex-col gap-2">
        {items.map((item, index) => (
          <View
            key={item._id}
            className={`${
              index < items.length - 1 && "border-b border-gray-200"
            } w-full flex flex-row items-start gap-4`}
          >
            <Avatar name={item.from.name} source={item.from.avatar} />

            <View className="flex-1">
              <Text className="font-poppins-medium text-gray-800">
                {item.event.name}
              </Text>
              <Text className="mt-1 font-dm-sans text-sm text-gray-700">
                {item.description}
              </Text>

              <Text className="mt-1 font-dm-sans-medium text-gray-700 text-xs text-right">
                {formatDateTime(item.createdAt.toISOString())}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ReviewCardGroup;
