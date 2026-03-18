import { Button, MineContainer } from "@/components";
import { useAuth } from "@/components/providers/AuthProvider";
import { ICommunityTicket } from "@/types/ticket";
import { getCurrencySymbol } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

const bannerImage = require("@/assets/images/ticket_banner.png");
const ticketCardBg = require("@/assets/images/ticket_card_bg.png");

type TTicketItem = {
  ticket: ICommunityTicket;
  count: number;
};

const MineTickets = () => {
  const [items, setItems] = useState<TTicketItem[]>([]);
  const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
  const { user, refreshAuthUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user?.tickets || user.tickets.length === 0) return;

    const map = new Map<string, TTicketItem>();

    user.tickets.forEach((ticket: ICommunityTicket) => {
      if (!ticket._id) return;

      if (map.has(ticket._id)) {
        map.get(ticket._id)!.count += 1;
      } else {
        map.set(ticket._id, {
          ticket,
          count: 1,
        });
      }
    });

    const result = Array.from(map.values());

    result.sort((a, b) => a.ticket.price - b.ticket.price);

    setItems(result);
  }, [user]);

  useEffect(() => {
    const refresh = async () => {
      await refreshAuthUser();
    };
    refresh();
  }, []);

  const handleRefresh = async () => {
    if (!user?._id) return;

    setRefreshLoading(true);
    await refreshAuthUser();
    setRefreshLoading(false);
  };

  const renderItem = ({ item }: { item: TTicketItem }) => {
    const { ticket, count } = item;

    return (
      <View className="relative w-full h-[160px]">
        <Image
          source={ticketCardBg}
          alt="Ticket Card BG"
          style={{ width: "100%", height: "100%", borderRadius: 10 }}
        />

        <View className="absolute inset-0 flex flex-row items-stretch justify-between">
          <View className="flex flex-col items-center justify-center w-1/2">
            <View className="w-[148px] h-[120px] rounded-lg overflow-hidden">
              <Image
                source={{ uri: ticket.image }}
                alt={ticket.name}
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
                    {getCurrencySymbol(ticket.currency as any)}
                  </Text>
                  <Text className="font-poppins-semibold text-3xl text-gray-800">
                    {ticket.price}
                  </Text>
                </View>

                <Text className="font-poppins text-gray-700">
                  {ticket.name} × {count}
                </Text>
              </View>

              <Button
                type="primary"
                label="Sell"
                buttonClassName="w-[108px] h-10"
                onPress={() =>
                  router.push({
                    pathname: "/mine/sell-tickets-checkout",
                    params: { id: item.ticket._id },
                  })
                }
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <MineContainer title="My Tickets">
      <View className="relative w-full h-[275px] overflow-hidden">
        <Image
          source={bannerImage}
          alt="Banner"
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />

        <View className="absolute bottom-10 left-5 right-5">
          <Text className="font-poppins-semibold text-2xl text-gray-800">
            Tickets Marketplace
          </Text>
          <Text className="font-dm-sans-medium text-sm text-gray-700">
            Sell your tickets in the marketplace
          </Text>
        </View>
      </View>

      <View className="px-5 mt-2">
        <View className="rounded-xl border border-purple-100 bg-purple-50/40 p-4 flex flex-row items-center gap-3">
          {/* Icon */}
          <View className="w-10 h-10 rounded-full bg-white items-center justify-center border border-purple-100">
            <LinearGradient
              colors={["#C427E0", "#844AFF", "#12A9FF"]}
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MaterialCommunityIcons name="refresh" size={16} color="white" />
            </LinearGradient>
          </View>

          {/* Text */}
          <View className="flex-1 gap-1">
            <Text className="font-poppins-semibold text-sm text-gray-800">
              Just completed your payment?
            </Text>

            <Text className="font-dm-sans text-xs text-gray-600">
              Payments may take a few moments to confirm. Tap refresh to check
              if your ticket purchase has been activated.
            </Text>
          </View>

          {/* Refresh button */}
          <Button
            type="gradient-soft"
            label="Refresh"
            buttonClassName="h-10"
            loading={refreshLoading}
            onPress={handleRefresh}
          />
        </View>
      </View>

      <View className="px-5 w-full mt-4">
        <View className="flex flex-row items-start gap-2 p-2 rounded-xl bg-blue-200 border border-blue-600">
          <MaterialCommunityIcons
            name="information-outline"
            size={20}
            color="#2563eb"
          />
          <Text className="font-poppins-semibold text-sm text-blue-600 flex-1">
            You can sell your tickets for up to 5% less than the original
            purchase price.
          </Text>
        </View>
      </View>

      <View className="flex-1 p-5">
        <FlatList
          data={items}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 16 }}
        />
      </View>
    </MineContainer>
  );
};

export default MineTickets;
