import { Stack } from "expo-router";

const ChatRootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="group" />
      <Stack.Screen name="dm" />
    </Stack>
  );
};

export default ChatRootLayout;
