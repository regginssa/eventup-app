import eventServices from "@/api/services/event";
import userServices from "@/api/services/user";
import { Button, Spinner } from "@/components/common";
import { PaymentMethodGroup } from "@/components/molecules";
import { SimpleContainer } from "@/components/organisms/layout";
import { useAuth } from "@/components/providers/AuthProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { TPaymentMethod } from "@/types";
import { IEvent } from "@/types/event";
import { IUser } from "@/types/user";
import { formatName } from "@/utils/format";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

// --- IMPROVED SUB-COMPONENTS ---

const EventSummaryCard = ({ event, packageType, totalPrice, loading }: any) => {
  if (loading)
    return (
      <View className="h-32 justify-center">
        <Spinner size="md" text="Loading..." />
      </View>
    );
  if (!event) return null;

  return (
    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <View className="flex-row gap-4">
        <Image
          source={event.images?.[0]}
          style={{ width: 80, height: 80, borderRadius: 12 }}
          contentFit="cover"
        />
        <View className="flex-1 justify-center">
          <View className="bg-blue-50 self-start px-2 py-0.5 rounded-md mb-1">
            <Text className="text-blue-600 font-dm-sans-bold text-[10px] uppercase">
              {formatName(packageType)} Package
            </Text>
          </View>
          <Text
            className="font-poppins-semibold text-gray-800 text-base"
            numberOfLines={1}
          >
            {event.name}
          </Text>
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons
              name="map-marker"
              size={12}
              color="#6b7280"
            />
            <Text className="text-gray-500 font-dm-sans-medium text-xs">
              {event.location?.city?.name}, {event.location?.country?.name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const PriceBreakdown = ({ services, total, base, commission }: any) => (
  <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mt-4">
    <Text className="font-poppins-semibold text-gray-800 mb-4">
      Payment Summary
    </Text>

    <View className="gap-3">
      {services.map((s: string, i: number) => (
        <View key={i} className="flex-row justify-between">
          <Text className="text-gray-500 font-dm-sans text-sm">{s}</Text>
          <Text className="text-gray-700 font-dm-sans-medium text-sm">—</Text>
        </View>
      ))}

      <View className="flex-row justify-between py-2 border-t border-gray-50">
        <Text className="text-gray-500 font-dm-sans text-sm">Base Price</Text>
        <Text className="text-gray-800 font-dm-sans-bold text-sm">${base}</Text>
      </View>

      <View className="flex-row justify-between mb-2">
        <Text className="text-gray-500 font-dm-sans text-sm">Service Fee</Text>
        <Text className="text-gray-800 font-dm-sans-bold text-sm">
          ${commission}
        </Text>
      </View>

      <View className="h-[1px] bg-gray-100 w-full my-1" />

      <View className="flex-row justify-between items-center pt-2">
        <Text className="font-poppins-bold text-lg text-gray-900">Total</Text>
        <Text className="font-poppins-bold text-2xl text-green-700">
          ${total}
        </Text>
      </View>
    </View>
  </View>
);

// --- MAIN SCREEN ---

const CheckoutScreen = () => {
  const [event, setEvent] = useState<IEvent | undefined>();
  const [eventLoading, setEventLoading] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookLabel, setBookLabel] = useState("Book Now");
  const [paymentMethod, setPaymentMethod] = useState<TPaymentMethod>("card");
  const [stripePaymentMethodId, setStripePaymentMethodId] = useState("");

  const { eventId, packageType, ticketId } = useLocalSearchParams();
  const { user, setAuthUser } = useAuth();
  const toast = useToast();

  // Mocked prices - replace with actual logic or props
  const basePrice = 450;
  const commissionPrice = 45;
  const totalPrice = basePrice + commissionPrice;
  const services = ["Round-trip Flight", "4 Nights Hotel", "Airport Transfers"];

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        setEventLoading(true);
        const res = await eventServices.get(eventId as string);
        setEvent(res.data);
      } catch (e) {
        toast.error("Could not load event");
      } finally {
        setEventLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  // Integrated Booking Logic
  const handleBook = async () => {
    if (!user?._id) return toast.error("Please login to continue");

    setBookLoading(true);
    setBookLabel("Initializing...");

    try {
      // 1. Payment Processing
      setBookLabel("Processing Payment...");
      const paymentSuccess = await handleStripePayment(totalPrice, "usd");
      if (!paymentSuccess) throw new Error("Payment failed");

      // 2. Ticket Handling (Community)
      if (event?.type === "user" && ticketId) {
        setBookLabel("Securing Ticket...");
        const ticketRes = await handleCommunityTicketTransfer();
        if (!ticketRes) throw new Error("Ticket transfer failed");
      }

      // 3. API Bookings (Flight/Hotel/Transfer)
      setBookLabel("Finalizing Bookings...");
      // Logic for createFlightOrder, createHotelOrder etc goes here...

      // 4. Save to DB
      setBookLabel("Saving Itinerary...");
      // await createBooking(bookingData);

      toast.success("Package Booked Successfully!");
      // router.replace("/booking/success");
    } catch (error: any) {
      toast.error(error.message || "Booking encountered an error");
    } finally {
      setBookLoading(false);
      setBookLabel("Book Now");
    }
  };

  const handleCommunityTicketTransfer = async () => {
    // Logic simplified: Filter ticket out directly
    const updatedTickets =
      user?.tickets.filter((t) => t._id !== ticketId) || [];
    const meRes = await userServices.update(
      user?._id as string,
      {
        ...user,
        tickets: updatedTickets,
      } as IUser,
    );

    if (meRes.data) {
      setAuthUser(meRes.data);
      return true;
    }
    return false;
  };

  const handleStripePayment = async (amount: number, currency: string) => {
    // Keep your existing createStripePaymentIntent & confirmPayment logic here
    // Returning true/false based on result
    return true;
  };

  return (
    <SimpleContainer title="Checkout" scrolled>
      <View className="px-4 pb-10">
        <EventSummaryCard
          event={event}
          loading={eventLoading}
          packageType={packageType}
          totalPrice={totalPrice}
        />

        <PriceBreakdown
          services={services}
          total={totalPrice}
          base={basePrice}
          commission={commissionPrice}
        />

        <View className="mt-6">
          <Text className="font-poppins-semibold text-gray-800 mb-3 ml-1">
            Payment Method
          </Text>
          <PaymentMethodGroup
            method={paymentMethod}
            stripePaymentMethodId={stripePaymentMethodId}
            onSelectMethod={setPaymentMethod}
            onSelectStripePaymentMethod={setStripePaymentMethodId}
          />
        </View>

        <View className="mt-8">
          <Button
            type="primary"
            label={bookLabel}
            buttonClassName="h-14 rounded-2xl shadow-sm"
            textClassName="text-lg font-poppins-bold"
            loading={bookLoading}
            onPress={handleBook}
          />
          <Text className="text-center text-gray-400 text-[10px] mt-4 font-dm-sans">
            By clicking Book Now, you agree to EventUp's Terms of Service and
            Cancellation Policy.
          </Text>
        </View>
      </View>
    </SimpleContainer>
  );
};

export default CheckoutScreen;
