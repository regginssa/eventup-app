import { InitContainer } from "@/components/organisms";
import { ThemeProvider } from "@/components/providers";
import { STRIPE_PUBLISHABLE_KEY } from "@/constants/env";
import { store } from "@/redux/store";
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
        <ThemeProvider>
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
            <Stack.Screen name="checkout" />
            <Stack.Screen name="booked" />
            <Stack.Screen name="my-events" />
            <Stack.Screen name="my-bookings" />
          </Stack>
          <InitContainer />
        </ThemeProvider>
      </Provider>
    </StripeProvider>
  );
}
