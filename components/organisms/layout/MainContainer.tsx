import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

const bgLightImage = require("@/assets/images/bg.png");
const bgDarkImage = require("@/assets/images/bg_dark.png");

interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  return (
    <View className="flex-1 relative">
      <StatusBar translucent backgroundColor="transparent" style="dark" />
      <Image source={bgLightImage} alt="bg" style={styles.image} />
      <View className="flex-1 pt-2">{children}</View>
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

export default MainContainer;
