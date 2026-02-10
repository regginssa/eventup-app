import { Stack } from "expo-router";

const ConversationRootLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="create-group" />
    </Stack>
  );
};

export default ConversationRootLayout;
