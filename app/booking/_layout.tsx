import { Stack } from "expo-router";

const BookingRootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="booked" />
      <Stack.Screen name="booking" />
      <Stack.Screen name="checkout" />
    </Stack>
  );
};

export default BookingRootLayout;
