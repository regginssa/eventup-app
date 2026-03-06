import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const LogoImage = require("@/assets/images/logo.png");

interface AuthScreenContainerProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthScreenContainer: React.FC<AuthScreenContainerProps> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar style="dark" />
      <View
        className={`flex-1 items-center justify-center gap-6 bg-[#EEF0FC] p-5`}
      >
        <View className="flex flex-col items-center justify-center">
          <Image source={LogoImage} style={styles.logo} />
          <Text className={`font-poppins-semibold text-2xl text-gray-800`}>
            {title}
          </Text>
          <Text className={`font-dm-sans-medium text-gray-600`}>
            {subtitle}
          </Text>
        </View>

        {children}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 64,
    height: 70,
  },
});

export default AuthScreenContainer;
