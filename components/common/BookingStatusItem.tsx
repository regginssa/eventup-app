import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Text, View } from "react-native";

interface BookingStatusItemProps {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  status: string;
  value?: string | number | null;
}

const BookingStatusItem: React.FC<BookingStatusItemProps> = ({
  label,
  icon,
  status,
  value,
}) => {
  if (value === null || value === undefined) return null;

  const isProcessing = status === "processing" || status === "pending";
  const isConfirmed = status === "confirmed";
  const isFailed = status === "failed";

  return (
    <View className="flex flex-row items-center mb-6">
      {/* Timeline Indicator */}
      <View className="items-center mr-4">
        <View
          className={`w-10 h-10 rounded-full items-center justify-center border-2 
          ${isConfirmed ? "bg-green-50 border-green-500" : isProcessing ? "bg-blue-50 border-blue-500" : "bg-gray-50 border-gray-200"}`}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#2563eb" />
          ) : (
            <MaterialCommunityIcons
              name={
                isConfirmed ? "check-circle" : isFailed ? "alert-circle" : icon
              }
              size={20}
              color={isConfirmed ? "#16a34a" : isFailed ? "#dc2626" : "#9ca3af"}
            />
          )}
        </View>
        <View className="w-[2px] h-6 bg-gray-100 mt-1" />
      </View>

      {/* Text Content */}
      <View className="flex-1 -mt-6">
        <Text className="font-dm-sans-bold text-gray-400 text-[10px] uppercase tracking-widest">
          {label}
        </Text>
        <Text
          className={`font-poppins-semibold text-sm ${isConfirmed ? "text-gray-800" : "text-gray-400"}`}
        >
          {isConfirmed
            ? "Confirmed"
            : isProcessing
              ? "Securing your spot..."
              : "Waiting..."}
        </Text>
      </View>
    </View>
  );
};

export default BookingStatusItem;
