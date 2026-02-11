import { ITicket } from "@/types/ticket";
import { getCurrencySymbol } from "@/utils/format";
import { Image } from "expo-image";
import { Text, View } from "react-native";

const ticketCardBg = require("@/assets/images/ticket_card_bg.png");

interface UserTicketItemProps {
  item: ITicket | null;
}

const UserTicketItem: React.FC<UserTicketItemProps> = ({ item }) => {
  if (!item) return null;

  return (
    <View className="relative w-full h-[160px] rounded-xl overflow-hidden">
      <Image
        source={ticketCardBg}
        alt="Ticket Card BG"
        style={{ width: "100%", height: "100%" }}
      />

      <View className="absolute inset-0 flex flex-row items-stretch justify-between">
        <View className="flex flex-col items-center justify-center w-1/2">
          <View className="w-[148px] h-[120px] rounded-lg overflow-hidden">
            <Image
              source={{ uri: item.image }}
              alt={item.name}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </View>
        </View>

        <View className="flex flex-col items-center justify-center w-1/2">
          <View className="flex flex-col items-center justify-between gap-6">
            <View className="flex flex-col items-center justify-center">
              <View className="flex flex-row items-start">
                <Text className="font-poppins-semibold text-lg text-gray-500">
                  {getCurrencySymbol(item.currency as any)}
                </Text>
                <Text className="font-poppins-semibold text-3xl text-gray-800">
                  {item.price}
                </Text>
              </View>

              <Text className="font-poppins text-gray-700">{item.name}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserTicketItem;
