import { Stack } from "expo-router";

const SubscriptionRootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="checkout" />
    </Stack>
  );
};

export default SubscriptionRootLayout;
