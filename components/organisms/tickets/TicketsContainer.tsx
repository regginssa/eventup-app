import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MainContainer } from "../layout";

interface TicketsContainerProps {
  children: React.ReactNode;
}

const TicketsContainer: React.FC<TicketsContainerProps> = ({ children }) => {
  const router = useRouter();

  return (
    <MainContainer>
      <SafeAreaView className="flex-1 gap-5">
        <View className="w-full px-5 flex flex-row items-center justify-between sticky top-0">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-10 h-10 rounded-full bg-white flex flex-col items-center justify-center"
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={16} color="#4b5563" />
          </TouchableOpacity>
          <Text className="font-poppins-semibold text-lg text-gray-800">
            Tickets
          </Text>
          <View className="w-10"></View>
        </View>

        <View className="flex-1">{children}</View>
      </SafeAreaView>
    </MainContainer>
  );
};

export default TicketsContainer;
