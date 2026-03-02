import eventServices from "@/api/services/event";
import { Button, Spinner } from "@/components/common";
import { PaymentMethodGroup } from "@/components/molecules";
import { SimpleContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { useFlight } from "@/components/providers/FlightProvider";
import { useHotel } from "@/components/providers/HotelProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { useTransfer } from "@/components/providers/TransferProvider";
import { IEvent } from "@/types/event";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

// --- REDESIGNED SUB-COMPONENTS ---

const SectionHeader = ({ title, icon }: { title: string; icon: string }) => (
  <View className="flex-row items-center mb-3 px-1">
    <MaterialCommunityIcons name={icon as any} size={18} color="#4B5563" />
    <Text className="font-poppins-semibold text-gray-800 ml-2 text-sm uppercase tracking-wider">
      {title}
    </Text>
  </View>
);

const EventHeroCard = ({ event, packageType, loading }: any) => {
  if (loading)
    return (
      <View className="h-40 justify-center">
        <Spinner size="md" />
      </View>
    );
  return (
    <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <View className="flex-row gap-4">
        <Image
          source={event?.images?.[0]}
          style={{ width: 90, height: 90, borderRadius: 10 }}
          contentFit="cover"
        />
        <View className="flex-1 justify-center">
          <View className="bg-indigo-50 self-start px-2 py-1 rounded-lg mb-2">
            <Text className="text-indigo-600 font-dm-sans-bold text-[10px] uppercase">
              {packageType} PACKAGE
            </Text>
          </View>
          <Text
            className="font-poppins-bold text-gray-900 text-lg leading-6"
            numberOfLines={2}
          >
            {event?.name}
          </Text>
          <View className="flex-row items-center mt-1">
            <MaterialCommunityIcons
              name="map-marker"
              size={14}
              color="#6366F1"
            />
            <Text className="text-gray-500 font-dm-sans-medium text-xs ml-1">
              {event?.location?.city?.name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const HighEndReceipt = ({ services, total, base, commission }: any) => (
  <View className="bg-white rounded-xl p-6 border border-slate-200">
    <SectionHeader title="Booking Summary" icon="receipt-outline" />
    <View className="gap-3 mt-2">
      {services.map((service: string, i: number) => (
        <View key={i} className="flex-row justify-between items-center">
          <Text className="text-slate-500 font-dm-sans text-sm">{service}</Text>
          <View className="h-[1px] flex-1 bg-slate-200 mx-3 italic opacity-50" />
          <Text className="text-slate-400 text-xs font-dm-sans">Included</Text>
        </View>
      ))}

      <View className="h-[1px] bg-slate-200 w-full my-2" />

      <View className="flex-row justify-between">
        <Text className="text-slate-600 font-dm-sans-medium">Subtotal</Text>
        <Text className="text-slate-900 font-dm-sans-bold">${base}</Text>
      </View>
      <View className="flex-row justify-between">
        <Text className="text-slate-600 font-dm-sans-medium">Charlie Fee</Text>
        <Text className="text-slate-900 font-dm-sans-bold">${commission}</Text>
      </View>

      <View className="flex-row justify-between items-center mt-4">
        <Text className="font-poppins-bold text-slate-900 text-base">
          Total Amount
        </Text>
        <Text className="font-poppins-bold text-green-600 text-2xl">
          ${total}
        </Text>
      </View>
    </View>
  </View>
);

// --- MAIN SCREEN ---

const CheckoutScreen = () => {
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookLabel, setBookLabel] = useState("Book Now");
  const [stripePaymentId, setStripePaymentId] = useState<string>("");
  const [services, setServices] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [baseAmount, setBaseAmount] = useState<number>(0);
  const [commissionAmount, setCommissionAmount] = useState<number>(0);

  const router = useRouter();
  const { eventId, packageType, ticketId } = useLocalSearchParams();
  const { user } = useAuth();
  const { offer: flightOffer } = useFlight();
  const { offer: hotelOffer } = useHotel();
  const { airportToHotelOffer, hotelToEventOffer } = useTransfer();
  const toast = useToast();

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) return;
      setLoading(true);
      const res = await eventServices.get(eventId as string);
      setEvent(res.data);
      setLoading(false);
    };
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (!user) return;
    setStripePaymentId(user.stripe?.paymentMethods[0].id || "");
  }, [user]);

  useEffect(() => {
    let services: string[] = [];
    let base = 0;

    if (flightOffer) {
      services.push("Flight");
      base += Number(flightOffer.totalAmount);
    }

    if (hotelOffer) {
      services.push("Hotel");
      base += Number(hotelOffer.totalAmount);
    }

    if (airportToHotelOffer) {
      services.push("Airport Transfer");
      base += Number(airportToHotelOffer.totalAmount);
    }

    if (hotelToEventOffer) {
      services.push("Event Transfer");
      base += Number(hotelToEventOffer.totalAmount);
    }

    const commission = Number((base * 0.1).toFixed(2));
    const total = Number((base + commission).toFixed(2));

    setBaseAmount(base);
    setCommissionAmount(commission);
    setTotalAmount(total);
    setServices(services);
  }, [flightOffer, hotelOffer, airportToHotelOffer, hotelToEventOffer]);

  const onBook = async () => {
    try {
      setBookLoading(true);
      setBookLabel("Securing your spot...");

      // Add your handleStripePayment and handleCommunityTicket logic here

      toast.success("Order Confirmed!");
      // router.replace("/booking/success");
    } catch (e) {
      toast.error("Process failed");
    } finally {
      setBookLoading(false);
      setBookLabel("Book Now");
    }
  };

  return (
    <SimpleContainer title="Checkout" scrolled>
      <View className="flex-1 gap-6">
        <EventHeroCard
          event={event}
          packageType={packageType}
          loading={loading}
        />

        <HighEndReceipt
          services={services}
          base={baseAmount}
          commission={commissionAmount}
          total={totalAmount}
        />

        <PaymentMethodGroup
          method="card"
          stripePaymentMethodId={stripePaymentId}
          onSelectMethod={() => {}}
          onSelectStripePaymentMethod={() => {}}
        />
      </View>

      <View className="gap-4">
        <Button
          type="primary"
          label={bookLabel}
          buttonClassName="h-12"
          textClassName="text-xl font-poppins-bold"
          loading={bookLoading}
          onPress={onBook}
        />

        <View className="flex-row items-center justify-center">
          <MaterialCommunityIcons name="lock" size={14} color="gray" />
          <Text className="text-xs text-gray-500 font-dm-sans ml-1">
            Secure 256-bit SSL Encrypted Payment
          </Text>
        </View>
      </View>
    </SimpleContainer>
  );
};

export default CheckoutScreen;
