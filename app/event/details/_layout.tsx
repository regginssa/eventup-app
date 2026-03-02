import { Stack } from "expo-router";

const EventDetailRootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ai" />
      <Stack.Screen name="user" />
    </Stack>
  );
};

export default EventDetailRootLayout;
