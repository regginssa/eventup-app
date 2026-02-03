import { Stack } from "expo-router";

const MineRootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="tickets" />
      <Stack.Screen name="sell-tickets-checkout" />
    </Stack>
  );
};

export default MineRootLayout;
