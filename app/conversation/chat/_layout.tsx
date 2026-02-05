import { Stack } from "expo-router";

const ChatRootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="group" />
      <Stack.Screen name="dm" />
    </Stack>
  );
};
