import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface TicketBookingStatusItemProps {
  label: string;
  status: string;
  isLast?: boolean;
  onPress?: () => void;
}

const TicketBookingStatusItem: React.FC<TicketBookingStatusItemProps> = ({
  label,
  status,
  isLast = false,
  onPress,
}) => {
  const isCompleted = status === "confirmed" || status === "completed";
  const needsAction = status === "pending";

  return (
    <View className="flex-row items-start">
      <View className="items-center w-10 mr-4">
        {/* Circle Indicator */}
        <View
          className={`w-9 h-9 rounded-full items-center justify-center border-2 ${
            isCompleted
              ? "bg-emerald-500 border-emerald-500"
              : needsAction
                ? "bg-[#844AFF]/10 border-[#844AFF]"
                : "bg-slate-50 border-slate-200"
          }`}
        >
          <MaterialCommunityIcons
            name={isCompleted ? "check" : "ticket-outline"}
            size={18}
            color={isCompleted ? "white" : "#844AFF"}
          />
        </View>

        {!isLast && (
          <View
            className={`w-[2px] h-12 my-1 ${
              isCompleted ? "bg-emerald-500" : "bg-slate-100"
            }`}
          />
        )}
      </View>

      <View className="flex-1 pb-8">
        <Text className="font-dm-sans-bold text-[10px] uppercase tracking-widest text-slate-400">
          {label}
        </Text>

        {isCompleted ? (
          <Text className="font-poppins-semibold text-base text-slate-900 mt-0.5">
            Ticket Purchased
          </Text>
        ) : needsAction ? (
          <Pressable
            onPress={onPress}
            className="flex-row items-center mt-2 self-start px-3 py-2 rounded-lg bg-[#844AFF]"
          >
            <MaterialCommunityIcons
              name="open-in-new"
              size={16}
              color="white"
            />
            <Text className="text-white ml-2 font-poppins-semibold text-sm">
              Buy Ticket
            </Text>
          </Pressable>
        ) : (
          <Text className="font-poppins-semibold text-base text-slate-500 mt-0.5">
            Waiting for confirmation
          </Text>
        )}
      </View>
    </View>
  );
};

export default TicketBookingStatusItem;
