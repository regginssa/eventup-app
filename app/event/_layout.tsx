import { Stack } from "expo-router";

const EventLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create" />
      <Stack.Screen name="mine" />
      <Stack.Screen name="details" />
    </Stack>
  );
};

export default EventLayout;
