import { fetchAllTickets } from "@/api/services/ticket";
import { Button, Spinner, TicketsContainer } from "@/components";
import { ITicket } from "@/types/ticket";
import { getCurrencySymbol } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

const bannerImage = require("@/assets/images/ticket_banner.png");
const ticketCardBg = require("@/assets/images/ticket_card_bg.png");

const currencies = [
  { label: "USD", value: "usd" },
  { label: "EUR", value: "eur" },
  { label: "PLN", value: "pln" },
];

const TicketsScreen = () => {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<ITicket[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    currencies[0].value,
  );
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchTicketsData = async () => {
      try {
        setLoading(true);

        const response = await fetchAllTickets();

        if (response.data) {
          setTickets(response.data);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchTicketsData();
  }, []);

  useEffect(() => {
    switch (selectedCurrency) {
      case "eur":
        setFilteredTickets(tickets.filter((t) => t.currency === "eur"));
        break;
      case "pln":
        setFilteredTickets(tickets.filter((t) => t.currency === "pln"));
        break;
      default:
        setFilteredTickets(tickets.filter((t) => t.currency === "usd"));
        break;
    }
  }, [selectedCurrency, tickets]);

  const renderItem = ({ item }: { item: ITicket }) => {
    return (
      <View className="relative w-full h-[160px]">
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

              <Button
                type="primary"
                label="Purchase"
                buttonClassName="w-[108px] h-10"
                onPress={() =>
                  router.push({
                    pathname: "/tickets/checkout",
                    params: { id: item._id },
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
    <TicketsContainer>
      <View className="relative w-full h-[275px] overflow-hidden">
        <Image
          source={bannerImage}
          alt="Banner"
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />

        <View className="absolute bottom-10 left-5 right-5">
          <Text className="font-poppins-semibold text-2xl text-gray-800">
            Event Tickets
          </Text>
          <Text className="font-dm-sans-medium text-sm text-gray-700">
            Secure your spot at the hottest events
          </Text>
        </View>
      </View>

      <View className="gap-4 px-5">
        <View>
          <Text className="font-poppins-semibold text-xl text-gray-800">
            Available Tickets
          </Text>
          <Text className="font-dm-sans-medium text-sm text-gray-700">
            Choose your ticket type and secure your entry
          </Text>
        </View>

        <View className="flex flex-row items-center gap-3">
          {currencies.map((currency) => (
            <TouchableOpacity
              key={currency.value}
              activeOpacity={0.8}
              className={`px-3 py-1.5 rounded-lg flex flex-row items-center justify-center gap-2 border ${selectedCurrency === currency.value ? "bg-[#D7FFE7] border-green-500" : "bg-white border-white"}`}
              onPress={() => setSelectedCurrency(currency.value)}
            >
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={16}
                color={
                  selectedCurrency === currency.value ? "#22c55e" : "#374151"
                }
              />
              <Text className="font-dm-sans-medium text-sm text-gray-700">
                {currency.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-1 px-5 mt-5">
        {loading ? (
          <Spinner size="md" />
        ) : (
          <FlatList
            data={filteredTickets}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ gap: 16 }}
          />
        )}
      </View>
    </TicketsContainer>
  );
};

export default TicketsScreen;
