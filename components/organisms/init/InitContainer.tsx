import {
  BookingProvider,
  CommunityTicketProvider,
  ConversationProvider,
  EventProvider,
  FlightProvider,
  HotelProvider,
  MessageProvider,
  NotificationProvider,
  SocketProvider,
  SubscriptionProvider,
  ToastProvider,
  TransferProvider,
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
        <SubscriptionProvider>
          <CommunityTicketProvider>
            <SocketProvider>
              <EventProvider>
                <BookingProvider>
                  <ConversationProvider>
                    <MessageProvider>
                      <NotificationProvider>
                        <FlightProvider>
                          <HotelProvider>
                            <TransferProvider>
                              <KeyboardAvoidingView
                                behavior={
                                  Platform.OS === "ios" ? "padding" : undefined
                                }
                                style={{ flex: 1 }}
                              >
                                <ToastProvider>{children}</ToastProvider>
                              </KeyboardAvoidingView>
                            </TransferProvider>
                          </HotelProvider>
                        </FlightProvider>
                      </NotificationProvider>
                    </MessageProvider>
                  </ConversationProvider>
                </BookingProvider>
              </EventProvider>
            </SocketProvider>
          </CommunityTicketProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </StripeProvider>
  );
};

export default InitContainer;
