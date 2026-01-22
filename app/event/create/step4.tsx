import { Button } from "@/components/common";
import { CreateEventContainer } from "@/components/organisms";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";

const CongImage = require("@/assets/images/cong_image.png");

const CreateEventStep4Screen = () => {
  const lottieRef = useRef<LottieView>(null);

  const router = useRouter();

  const handleJoinNow = async () => {};

  return (
    <CreateEventContainer
      step={4}
      title="Congratulations!"
      subtitle="Your party has been successfully created"
      des="London's midnight is now live! People can discover and join your event. You can manage details from your dashboard"
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

      <Button type="primary" label="Join now" buttonClassName="h-12" />
    </CreateEventContainer>
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

export default CreateEventStep4Screen;
