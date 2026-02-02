import { Stack } from "expo-router";

const TicketRootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="checkout" />
    </Stack>
  );
};

export default TicketRootLayout;
