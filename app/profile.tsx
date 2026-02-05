import { fetchUser } from "@/api/services/user";
import { Spinner } from "@/components/common";
import {
  ProfileContainer,
  ProfileHeader,
  ProfileReviews,
} from "@/components/organisms";
import { useAuth } from "@/components/providers/AuthProvider";
import { IReview } from "@/types/review";
import { IUser } from "@/types/user";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

const ProfileScreen = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  const { id: userId } = useLocalSearchParams();
  const { user: authUser } = useAuth();

  const fetchUserInfo = async () => {
    if (!userId) return;

    setLoading(true);
    const response = await fetchUser(userId as string);

    if (!response.data) {
      setIsNotFound(true);
    } else {
      setUser(response.data);
      setIsNotFound(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log(userId);
    if (!userId) return;
    fetchUserInfo();
  }, [userId]);

  const renderContent = () => {
    if (loading) {
      return <Spinner size="md" />;
    } else if (isNotFound) {
      return (
        <View className="flex-1 items-center justify-center">
          <View className="flex-1 items-center justify-center gap-2">
            <MaterialCommunityIcons
              name="emoticon-sad-outline"
              size={48}
              color="#1f2937"
            />
            <Text className="text-gray-800 font-poppins-semibold">No Data</Text>
          </View>
        </View>
      );
    } else if (user) {
      return (
        <>
          <ProfileHeader
            name={user?.name as string}
            idVerified={user?.idVerified as boolean}
            title={user?.title as string}
            country={user?.location.country as any}
            cityName={user?.location.city.name as string}
            description={user?.description as string}
            rate={user?.rate as number}
            avatar={user?.avatar}
            isMe={user._id === authUser?._id}
          />

          <ProfileReviews reviews={reviews} />
        </>
      );
    }
  };

  return (
    <ProfileContainer title={user?.name || "Profile"}>
      {renderContent()}
    </ProfileContainer>
  );
};

export default ProfileScreen;
