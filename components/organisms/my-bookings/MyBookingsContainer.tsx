import { Footer, MainContainer } from "@/components/organisms/layout";
import { ProfileDrawer } from "@/components/molecules";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MyBookingsContainerProps {
  children: React.ReactNode;
}

const MyBookingsContainer: React.FC<MyBookingsContainerProps> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <MainContainer>
      <SafeAreaView className="flex-1 px-5 gap-5">
        <View className="w-full flex flex-row items-center justify-between sticky top-0">
          <Text className="font-poppins-semibold text-lg text-gray-800">
            My Bookings
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
            style={styles.bar}
            onPress={() => setIsOpen(true)}
          >
            <AntDesign name="bars" size={20} color="#1f2937" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 gap-3">{children}</View>
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

export default MyBookingsContainer;
