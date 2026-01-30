import { ReviewCardGroup } from "@/components/molecules";
import { IReview } from "@/types/review";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface ProfileReviewsProps {
  reviews: IReview[];
}

const ProfileReviews: React.FC<ProfileReviewsProps> = ({ reviews }) => {
  return (
    <View className="flex-1 bg-white rounded-lg mt-6 p-4">
      <View className="mb-6 w-full flex flex-row items-center gap-2">
        <MaterialCommunityIcons
          name="message-star-outline"
          size={18}
          color="#1f2937"
        />
        <Text className="font-poppins-semibold text-gray-800">Reviews</Text>
      </View>
      <ReviewCardGroup items={reviews} />
    </View>
  );
};

export default ProfileReviews;
