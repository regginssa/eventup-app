import { fetchUser } from "@/src/api/services/user";
import { Button } from "@/src/components/common";
import { OnboardingContainer } from "@/src/components/organisms";
import { setAuthUser } from "@/src/store/slices/auth.slice";

import { RootState } from "@/src/store";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const CongImage = require("@/assets/images/cong_image.png");

const OnboarindStep5Screen = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const lottieRef = useRef<LottieView>(null);

  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleJoinNow = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);

      const response = await fetchUser(user._id);

      if (response.ok) {
        dispatch(setAuthUser(response.data));
        router.replace("/home");
      }
    } catch (error: any) {
      const message = error?.response?.data?.message;
      Alert.alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingContainer
      title="Congratulations!"
      subtitle="You’ve successfully complete the onboarding."
      des="You’re all set to explore our platform and discover all the amazing features we have to offer"
      step={4}
      onBack={() => router.back()}
      logo={
        <View className="w-[372px] h-[266px] relative">
          <Image
            source={CongImage}
            alt="Congratulation"
            contentFit="cover"
            transition={100}
            style={styles.image}
          />
          <LottieView
            ref={lottieRef}
            source={require("@/assets/animations/cong.json")}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
        </View>
      }
    >
      <Text className="font-dm-sans-medium text-sm text-gray-700 text-center">
        Onboarding completed
      </Text>

      <Button
        type="primary"
        label="Join now"
        buttonClassName="h-12"
        loading={loading}
        onPress={handleJoinNow}
      />
    </OnboardingContainer>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
  },
  lottie: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
});

export default OnboarindStep5Screen;
