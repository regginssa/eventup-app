import { Button, Modal, Spinner } from "@/components";
import { SimpleContainer } from "@/components/organisms/layout";
import { useTicket } from "@/components/providers/TicketProvider";
import { ICommunityTicket } from "@/types/ticket";
import { getCurrencySymbol } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  const [filteredTickets, setFilteredTickets] = useState<ICommunityTicket[]>(
    [],
  );
  const [selectedTicket, setSelectedTicket] = useState<ICommunityTicket | null>(
    null,
  );
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    currencies[0].value,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const { amount, currency, from, callback } = useLocalSearchParams();
  const router = useRouter();

  const { tickets } = useTicket();

  useEffect(() => {
    switch (selectedCurrency) {
      case "eur":
        setFilteredTickets(
          tickets.filter((t) => t.currency.toUpperCase() === "EUR"),
        );
        break;
      case "pln":
        setFilteredTickets(
          tickets.filter((t) => t.currency.toUpperCase() === "PLN"),
        );
        break;
      default:
        setFilteredTickets(
          tickets.filter((t) => t.currency.toUpperCase() === "USD"),
        );
        break;
    }
  }, [selectedCurrency, tickets]);

  useEffect(() => {
    if (!amount || !currency || !from || tickets.length === 0) return;
    setSelectedTicket(
      tickets.find(
        (t) =>
          t.price === Number(amount) &&
          t.currency.toUpperCase() === currency.toString().toUpperCase(),
      ) || null,
    );
    setIsOpen(true);
  }, [amount, currency, from, tickets]);

  const renderItem = ({ item }: { item: ICommunityTicket }) => {
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
    <SimpleContainer title="Tickets" backRoute={(callback as any) || undefined}>
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

      <View className="flex-1 p-5">
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

      <Modal
        title="Confirm Ticket"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        scrolled
      >
        {selectedTicket ? (
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
                    source={{ uri: selectedTicket.image }}
                    alt={selectedTicket.name}
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
                        {getCurrencySymbol(selectedTicket.currency as any)}
                      </Text>
                      <Text className="font-poppins-semibold text-3xl text-gray-800">
                        {selectedTicket.price}
                      </Text>
                    </View>

                    <Text className="font-poppins text-gray-700">
                      {selectedTicket.name}
                    </Text>
                  </View>

                  <Button
                    type="primary"
                    label="Purchase"
                    buttonClassName="w-[108px] h-10"
                    onPress={() =>
                      router.push({
                        pathname: "/tickets/checkout",
                        params: { id: selectedTicket._id, from },
                      })
                    }
                  />
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className="flex-1 flex flex-col items-center justify-center gap-2">
            <MaterialCommunityIcons
              name="cart-remove"
              size={24}
              color="#4b5563"
            />
            <Text className="font-dm-sans-medium text-gray-600">
              No Selected Ticket
            </Text>
          </View>
        )}
      </Modal>
    </SimpleContainer>
  );
};

export default TicketsScreen;
