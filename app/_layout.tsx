import { InitContainer } from "@/components/organisms";
import {
  ConversationProvider,
  MessageProvider,
  SocketProvider,
  ThemeProvider,
  TicketProvider,
  ToastProvider,
} from "@/components/providers";
import AuthProvider from "@/components/providers/AuthProvider";
import { STRIPE_PUBLISHABLE_KEY } from "@/config/env";
import { store } from "@/store";
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
  useFonts as useDMSans,
} from "@expo-google-fonts/dm-sans";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts as usePoppins,
} from "@expo-google-fonts/poppins";
import { StripeProvider } from "@stripe/stripe-react-native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Provider } from "react-redux";
import "../global.css";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [poppinsLoaded] = usePoppins({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [dmSansLoaded] = useDMSans({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  const fontsReady = poppinsLoaded && dmSansLoaded;

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsReady]);

  if (!fontsReady) {
    return null;
  }
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <Provider store={store}>
        <AuthProvider>
          <TicketProvider>
            <SocketProvider>
              <ConversationProvider>
                <MessageProvider>
                  <ThemeProvider>
                    <KeyboardAvoidingView
                      behavior={Platform.OS === "ios" ? "padding" : undefined}
                      style={{ flex: 1 }}
                    >
                      <ToastProvider>
                        <Stack
                          screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: "transparent" },
                          }}
                        >
                          <Stack.Screen name="start" />
                          <Stack.Screen name="auth" />
                          <Stack.Screen name="home" />
                          <Stack.Screen name="map" />
                          <Stack.Screen name="didit" />
                          <Stack.Screen name="booking" />
                          <Stack.Screen name="profile" />
                          <Stack.Screen name="tickets" />
                          <Stack.Screen name="subscription" />
                          <Stack.Screen name="conversation" />
                        </Stack>
                      </ToastProvider>
                    </KeyboardAvoidingView>
                    <InitContainer />
                  </ThemeProvider>
                </MessageProvider>
              </ConversationProvider>
            </SocketProvider>
          </TicketProvider>
        </AuthProvider>
      </Provider>
    </StripeProvider>
  );
}
