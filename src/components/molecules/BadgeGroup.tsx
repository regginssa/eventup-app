import { ScrollView, Text, View } from "react-native";

interface BadgeGroupProps {
  badges: string[];
  showCount: number;
}

const BadgeGroup: React.FC<BadgeGroupProps> = ({ badges, showCount }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {badges.slice(0, showCount).map((badge, index) => (
        <View
          key={`badge-${badge}-${index}`}
          className="px-2 py-1 bg-gray-100 rounded-lg border border-gray-200 mr-2"
        >
          <Text className="text-xs font-dm-sans-medium text-gray-600">
            {badge}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default BadgeGroup;
