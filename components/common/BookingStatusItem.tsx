import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, Text, View } from "react-native";

interface BookingStatusItemProps {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  status: string;
  isLast?: boolean;
}

const BookingStatusItem: React.FC<BookingStatusItemProps> = ({
  label,
  icon,
  status,
  isLast = false,
}) => {
  const isCompleted = status === "confirmed" || status === "completed";
  const isProcessing = status === "processing" || status === "pending";
  const isFailed = status === "failed";

  return (
    <View className="flex-row items-start">
      <View className="items-center w-10 mr-4">
        {/* Circle Indicator */}
        <View
          className={`w-9 h-9 rounded-full items-center justify-center border-2 
          ${
            isCompleted
              ? "bg-emerald-500 border-emerald-500"
              : isProcessing
                ? "bg-white border-[#844AFF]"
                : isFailed
                  ? "bg-red-500 border-red-500"
                  : "bg-slate-50 border-slate-200"
          }`}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#844AFF" />
          ) : isFailed ? (
            <MaterialCommunityIcons
              name="information-outline"
              size={18}
              color="white"
            />
          ) : (
            <MaterialCommunityIcons
              name={isCompleted ? "check" : icon}
              size={18}
              color={isCompleted ? "white" : "#94a3b8"}
            />
          )}
        </View>

        {/* Vertical Line */}
        {!isLast && (
          <View
            className={`w-[2px] h-12 my-1 ${isCompleted ? "bg-emerald-500" : "bg-slate-100"}`}
          />
        )}
      </View>

      <View className="flex-1 pb-8">
        <Text
          className={`font-dm-sans-bold text-[10px] uppercase tracking-widest ${isProcessing ? "text-[#844AFF]" : "text-slate-400"}`}
        >
          {label}
        </Text>
        <Text
          className={`font-poppins-semibold text-base mt-0.5 text-slate-800`}
        >
          {isCompleted
            ? "Confirmed"
            : isProcessing
              ? "In Progress..."
              : "Failed"}
        </Text>
      </View>
    </View>
  );
};

export default BookingStatusItem;
