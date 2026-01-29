import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const EventDetailEmpty = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <View className="flex-1 items-center justify-center gap-2">
        <MaterialCommunityIcons
          name="emoticon-sad-outline"
          size={48}
          color="#1f2937"
        />
        <Text className="text-gray-800 font-poppins-semibold">No Data</Text>
      </View>
    </View>
  );
};

export default EventDetailEmpty;
