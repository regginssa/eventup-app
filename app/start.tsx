import { Button } from "@/components/common";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

const bgLightImage = require("@/assets/images/start.png");
const bgDarkImage = require("@/assets/images/start_dark.png");

const StartScreen = () => {
  const router = useRouter();

  return (
    <View className="flex-1 items-end relative">
      <StatusBar style="light" />
      <Image source={bgLightImage} alt="bg" style={styles.image} />

      {/* Start action section - Bottom of screen */}
      <View className="w-full absolute bottom-0 px-5 pb-14 gap-5">
        <View className="gap-3">
          <Text className="font-poppins-semibold text-white text-3xl text-center">
            EventUp
          </Text>
          <Text className="font-dm-sans text-white/90 font-medium text-center">
            AI Event Discovery System
          </Text>
        </View>
        <View className="w-full flex flex-row gap-4 items-center justify-center">
          <Button
            type="gradient-glass"
            label="Login"
            buttonClassName="w-1/2 h-12"
            onPress={() => router.replace("/auth/login")}
          />
          <Button
            type="primary"
            label="Explore Events"
            buttonClassName="w-1/2 h-12"
            onPress={() => router.replace("/home")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
});

export default StartScreen;
