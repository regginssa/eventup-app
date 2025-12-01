import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainContainer from "./MainContainer";

interface CheckoutContainerProps {
  children: React.ReactNode;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ children }) => {
  const router = useRouter();

  return (
    <MainContainer>
      <SafeAreaView className="flex-1 px-5">
        <View className="w-full flex flex-row items-center justify-between pb-5 sticky top-0">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-10 h-10 rounded-full bg-white flex flex-col items-center justify-center"
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={16} color="#4b5563" />
          </TouchableOpacity>
          <Text className="font-poppins-semibold text-lg text-gray-800">
            Checkout
          </Text>
          <View className="w-10"></View>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 24 }}>
          {children}
        </ScrollView>
      </SafeAreaView>
    </MainContainer>
  );
};

export default CheckoutContainer;
