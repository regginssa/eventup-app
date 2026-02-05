import { Stack } from "expo-router";

const ChatRoomRootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="group" />
      <Stack.Screen name="dm" />
    </Stack>
  );
};
