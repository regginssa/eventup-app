import { Stack } from "expo-router";

const ConversationRootLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="chat" />
    </Stack>
  );
};

export default ConversationRootLayout;
