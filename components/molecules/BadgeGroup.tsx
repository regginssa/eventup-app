import { Text, View } from "react-native";

interface BadgeGroupProps {
  badges: string[];
  showCount: number;
}

const BadgeGroup: React.FC<BadgeGroupProps> = ({ badges, showCount }) => {
  return (
    <View className="w-full flex flex-row flex-wrap gap-2 overflow-scroll">
      {badges.slice(0, showCount).map((badge, index) => (
        <View
          key={`badge-${badge}-${index}`}
          className="px-2 py-1 bg-gray-100 rounded-lg border border-gray-200"
        >
          <Text className="text-xs font-dm-sans-medium text-gray-600">
            {badge}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default BadgeGroup;
