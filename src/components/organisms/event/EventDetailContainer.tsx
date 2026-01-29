import { MainContainer } from "@/src/components/organisms/layout";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface EventDetailContainerProps {
  children: React.ReactNode;
}

const EventDetailContainer: React.FC<EventDetailContainerProps> = ({
  children,
}) => {
  const router = useRouter();

  return (
    <MainContainer>
      <SafeAreaView className="flex-1 px-5 gap-5">
        <View className="w-full flex flex-row items-center justify-between sticky top-0">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-10 h-10 rounded-full bg-white flex flex-col items-center justify-center"
            onPress={() => router.replace("/home")}
          >
            <Feather name="arrow-left" size={16} color="#4b5563" />
          </TouchableOpacity>
          <Text className="font-poppins-semibold text-lg text-gray-800">
            Event Details
          </Text>
          <View className="w-10"></View>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {children}
        </ScrollView>
      </SafeAreaView>
    </MainContainer>
  );
};

export default EventDetailContainer;
