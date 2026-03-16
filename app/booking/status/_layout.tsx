import { Stack } from "expo-router";

const BookingStatusRootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" />
    </Stack>
  );
};

export default BookingStatusRootLayout;
