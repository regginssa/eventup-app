import { CreateEventStepper } from "@/components/molecules";
import { MainContainer } from "@/components/organisms/layout";
import { Feather } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CreateEventContainerProps {
  step: number;
  title: string;
  subtitle: string;
  des?: string;
  children: React.ReactNode;
  logo?: React.ReactNode;
  onBack: () => void;
}

const CreateEventContainer: React.FC<CreateEventContainerProps> = ({
  step,
  title,
  subtitle,
  des,
  children,
  logo,
  onBack,
}) => {
  return (
    <MainContainer>
      <SafeAreaView className="flex-1 px-5">
        <View className="w-full flex flex-row items-center justify-between pb-5 sticky top-0">
          <TouchableOpacity
            activeOpacity={0.8}
            className="w-10 h-10 rounded-full bg-white flex flex-col items-center justify-center"
            onPress={onBack}
          >
            <Feather name="arrow-left" size={16} color="#4b5563" />
          </TouchableOpacity>
          <Text className="font-poppins-semibold text-lg text-gray-800">
            Step {step}
          </Text>
          <View className="w-10"></View>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 items-center justify-center gap-9 py-5">
            {logo && logo}
            <View className="items-center justify-center">
              <Text className="font-poppins-semibold text-2xl mb-2 text-gray-800">
                {title}
              </Text>
              <Text className="font-dm-sans text-gray-700 text-center">
                {subtitle}
              </Text>

              {des && (
                <Text className="font-dm-sans-medium text-sm text-gray-700 text-center mt-4">
                  {des}
                </Text>
              )}
            </View>

            <CreateEventStepper completedStep={step} />
            <View
              className="w-full p-4 gap-5 bg-[#eef1f7] rounded-3xl border"
              style={{ borderColor: "white" }}
            >
              {children}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </MainContainer>
  );
};

export default CreateEventContainer;
