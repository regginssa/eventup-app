import { Stack } from "expo-router";

const EventLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create" />
      <Stack.Screen name="mine" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="ai" />
      <Stack.Screen name="user" />
    </Stack>
  );
};

export default EventLayout;
