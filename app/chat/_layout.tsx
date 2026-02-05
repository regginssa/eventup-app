import { Stack } from "expo-router";

const ChatRootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="room" />
    </Stack>
  );
};
