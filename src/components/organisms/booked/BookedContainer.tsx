import { ProfileDrawer } from "@/src/components/molecules";
import { Footer, MainContainer } from "@/src/components/organisms/layout";
import { useTheme } from "@/src/components/providers/ThemeProvider";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface BookedContainerProps {
  children: React.ReactNode;
}

const BookedContainer: React.FC<BookedContainerProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { theme } = useTheme();

  return (
    <MainContainer>
      <SafeAreaView className="flex-1 px-5">
        <View className="w-full flex flex-row items-center justify-between pb-5 sticky top-0">
          <Text
            className={`font-poppins-semibold text-lg ${
              theme === "light" ? "text-gray-800" : "text-gray-200"
            }`}
          >
            Booking Confirmation
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              theme === "light" ? "bg-white" : "bg-[#171C1C]"
            }`}
            style={styles.bar}
            onPress={() => setIsOpen(true)}
          >
            <AntDesign
              name="bars"
              size={20}
              color={theme === "light" ? "#1f2937" : "#e5e7eb"}
            />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 24 }}>
          {children}
        </ScrollView>
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

export default BookedContainer;
