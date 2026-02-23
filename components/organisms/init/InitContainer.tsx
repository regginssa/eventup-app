import {
  BookingProvider,
  ConversationProvider,
  EventProvider,
  MessageProvider,
  NotificationProvider,
  SocketProvider,
  ThemeProvider,
  TicketProvider,
  ToastProvider,
} from "@/components/providers";
import AuthProvider from "@/components/providers/AuthProvider";
import { STRIPE_PUBLISHABLE_KEY } from "@/config/env";
import { StripeProvider } from "@stripe/stripe-react-native";
import { KeyboardAvoidingView, Platform } from "react-native";

interface InitContainerProps {
  children: React.ReactNode;
}

const InitContainer: React.FC<InitContainerProps> = ({ children }) => {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <AuthProvider>
        <TicketProvider>
          <SocketProvider>
            <EventProvider>
              <BookingProvider>
                <ConversationProvider>
                  <MessageProvider>
                    <NotificationProvider>
                      <ThemeProvider>
                        <KeyboardAvoidingView
                          behavior={
                            Platform.OS === "ios" ? "padding" : undefined
                          }
                          style={{ flex: 1 }}
                        >
                          <ToastProvider>{children}</ToastProvider>
                        </KeyboardAvoidingView>
                      </ThemeProvider>
                    </NotificationProvider>
                  </MessageProvider>
                </ConversationProvider>
              </BookingProvider>
            </EventProvider>
          </SocketProvider>
        </TicketProvider>
      </AuthProvider>
    </StripeProvider>
  );
};

export default InitContainer;
