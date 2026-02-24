import { ProfileDrawer } from "@/components/molecules";
import { useConversation } from "@/components/providers/ConversationProvider";
import { useNotification } from "@/components/providers/NotificationProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Footer from "./Footer";
import MainContainer from "./MainContainer";

interface LayoutContainerProps {
  children: React.ReactNode;
  title: string;
}

const LayoutContainer: React.FC<LayoutContainerProps> = ({
  children,
  title,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();
  const { totalNotificationsUnreads } = useNotification();
  const { totalMessagesUnreads } = useConversation();
  const { theme } = useTheme();

  return (
    <MainContainer>
      <SafeAreaView className="flex-1 px-5 gap-5">
        <View className="w-full flex flex-row items-center justify-between sticky top-0">
          <Text
            className={`font-poppins-semibold text-lg ${theme === "light" ? "text-gray-800" : "text-gray-300"}`}
          >
            {title}
          </Text>

          <View className="flex flex-row items-center gap-2">
            <TouchableOpacity
              activeOpacity={0.8}
              className={`w-10 h-10 rounded-full ${theme === "light" ? "bg-white" : "bg-[#262C2C]"} text-gray-300 flex items-center justify-center relative`}
              style={styles.bar}
              onPress={() => router.push("/notification")}
            >
              <AntDesign
                name="bell"
                size={20}
                color={theme === "light" ? "#1f2937" : "#d1d5db"}
              />

              {totalNotificationsUnreads > 0 && (
                <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              className={`w-10 h-10 rounded-full ${theme === "light" ? "bg-white" : "bg-[#262C2C]"} flex items-center justify-center relative`}
              style={styles.bar}
              onPress={() => router.push("/conversation" as any)}
            >
              <AntDesign
                name="message"
                size={20}
                color={theme === "light" ? "#1f2937" : "#d1d5db"}
              />
              {totalMessagesUnreads > 0 && (
                <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              className={`w-10 h-10 rounded-full ${theme === "light" ? "bg-white" : "bg-[#262C2C]"} flex items-center justify-center`}
              style={styles.bar}
              onPress={() => setIsOpen(true)}
            >
              <AntDesign
                name="bars"
                size={20}
                color={theme === "light" ? "#1f2937" : "#d1d5db"}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1">{children}</View>
      </SafeAreaView>

      <ProfileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <Footer />
    </MainContainer>
  );
};

const styles = StyleSheet.create({
  bar: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});

export default LayoutContainer;
