import { Foundation } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface CreateEventStepperProps {
  completedStep: number;
}

const CreateEventStepper: React.FC<CreateEventStepperProps> = ({
  completedStep,
}) => {
  return (
    <View className="w-full relative h-[55px]">
      {/* background track */}
      <View className="absolute top-[9px] left-2 right-2 bg-[#E0E0E0] h-[13px]">
        {completedStep > 1 && (
          <View
            className="absolute bg-[#8CD835] top-0.5 bottom-0.5 left-0.5"
            style={{
              right: `${
                completedStep === 4 ? 0 : completedStep === 3 ? 33 : 70
              }%`,
            }}
          />
        )}
      </View>

      {/* step indicators */}
      <View className="absolute inset-0 flex flex-row items-center justify-between z-10">
        {Array.from({ length: 4 }).map((_, index) => (
          <View
            key={index}
            className="flex flex-col items-center justify-center gap-2"
          >
            <View
              className={`w-8 h-8 rounded-sm items-center justify-center ${
                completedStep > index ? "bg-[#8CD835]" : "bg-[#BDBDBD]"
              }`}
            >
              {completedStep > index ? (
                <Foundation name="check" size={14} color="white" />
              ) : (
                <Text className="font-poppins-semibold text-lg text-white">
                  {index + 1}
                </Text>
              )}
            </View>
            <Text className="font-dm-sans text-sm text-gray-800">
              Step {index + 1}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CreateEventStepper;
