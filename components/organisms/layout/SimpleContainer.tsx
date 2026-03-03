import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MainContainer from "./MainContainer";

interface SimpleContainerProps {
  children: React.ReactNode;
  title: string;
  scrolled?: boolean;
  backRoute?: string;
  hiddenBack?: boolean;
}

const SimpleContainer: React.FC<SimpleContainerProps> = ({
  children,
  title,
  scrolled,
  backRoute,
  hiddenBack,
}) => {
  const router = useRouter();

  return (
    <MainContainer>
      <SafeAreaView className="flex-1 px-5 gap-5">
        <View className="w-full flex flex-row items-center justify-between sticky top-0">
          {hiddenBack ? (
            <View className="w-10 h-10"></View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.8}
              className="w-10 h-10 rounded-full bg-white flex flex-col items-center justify-center"
              onPress={() =>
                backRoute ? router.replace(backRoute as any) : router.back()
              }
            >
              <Feather name="arrow-left" size={16} color="#4b5563" />
            </TouchableOpacity>
          )}
          <Text className="font-poppins-semibold text-lg text-gray-800">
            {title}
          </Text>
          <View className="w-10"></View>
        </View>

        {scrolled ? (
          <ScrollView contentContainerStyle={{ flexGrow: 1, gap: 24 }}>
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1 gap-6">{children}</View>
        )}
      </SafeAreaView>
    </MainContainer>
  );
};

export default SimpleContainer;
