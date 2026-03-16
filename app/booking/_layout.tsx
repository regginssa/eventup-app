import { Stack } from "expo-router";

const BookingRootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="checkout" />
      <Stack.Screen name="booked" />
      <Stack.Screen name="status" />
    </Stack>
  );
};

export default BookingRootLayout;
