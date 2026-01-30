import { MainContainer } from "@/components/organisms/layout";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MyEventsScreenContainerProps {
  children: React.ReactNode;
}

const MyEventsScreenContainer: React.FC<MyEventsScreenContainerProps> = ({
  children,
}) => {
  const router = useRouter();

  return (
    <MainContainer>
      <SafeAreaView className="flex-1 px-5 gap-5">
        <View className="w-full flex flex-row items-center justify-between sticky top-0">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center"
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={16} color="#4b5563" />
          </TouchableOpacity>

          <Text className="font-poppins-semibold text-lg text-gray-800">
            My Events
          </Text>

          <View className="w-10 h-10"></View>
        </View>

        <View className="flex-1 gap-5">{children}</View>
      </SafeAreaView>
    </MainContainer>
  );
};

export default MyEventsScreenContainer;
