import { useTheme } from "@/src/components/providers/ThemeProvider";
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
  const { theme } = useTheme();

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <StatusBar style="dark" />
      <View
        className={`flex-1 items-center justify-center gap-8 ${
          theme === "light" ? "bg-[#EEF0FC]" : "bg-black"
        } p-5`}
      >
        <View className="flex flex-col items-center justify-center">
          <Image source={LogoImage} style={styles.logo} />
          <Text
            className={`font-poppins-semibold text-2xl ${
              theme === "light" ? "text-gray-800" : "text-gray-200"
            }`}
          >
            {title}
          </Text>
          <Text
            className={`font-dm-sans-medium ${
              theme === "light" ? "text-gray-600" : "text-gray-400"
            }`}
          >
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
