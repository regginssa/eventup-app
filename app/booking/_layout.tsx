import { Stack } from "expo-router";

const BookingRootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="booked" />
      <Stack.Screen name="booking-form" />
      <Stack.Screen name="checkout" />
    </Stack>
  );
};

export default BookingRootLayout;
