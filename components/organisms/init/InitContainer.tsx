import {
  AirwallexProvider,
  BookingProvider,
  CommunityTicketProvider,
  ConversationProvider,
  EventProvider,
  FlightProvider,
  HotelProvider,
  IapProvider,
  MessageProvider,
  NotificationProvider,
  SocketProvider,
  SubscriptionProvider,
  ToastProvider,
  TransferProvider,
} from "@/components/providers";
import AuthProvider from "@/components/providers/AuthProvider";
import DuffelProvider from "@/components/providers/DuffelProvider";
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
        <SocketProvider>
          <ToastProvider>
            <AirwallexProvider>
              <SubscriptionProvider>
                <CommunityTicketProvider>
                  <IapProvider>
                    <EventProvider>
                      <BookingProvider>
                        <ConversationProvider>
                          <MessageProvider>
                            <NotificationProvider>
                              <FlightProvider>
                                <HotelProvider>
                                  <TransferProvider>
                                    <DuffelProvider>
                                      <KeyboardAvoidingView
                                        behavior={
                                          Platform.OS === "ios"
                                            ? "padding"
                                            : undefined
                                        }
                                        style={{ flex: 1 }}
                                      >
                                        {children}
                                      </KeyboardAvoidingView>
                                    </DuffelProvider>
                                  </TransferProvider>
                                </HotelProvider>
                              </FlightProvider>
                            </NotificationProvider>
                          </MessageProvider>
                        </ConversationProvider>
                      </BookingProvider>
                    </EventProvider>
                  </IapProvider>
                </CommunityTicketProvider>
              </SubscriptionProvider>
            </AirwallexProvider>
          </ToastProvider>
        </SocketProvider>
      </AuthProvider>
    </StripeProvider>
  );
};

export default InitContainer;
