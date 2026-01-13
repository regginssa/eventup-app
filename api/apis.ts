// Auth apis
export const GOOGLE_LOGIN = "/auth/login-google";
export const GOOGLE_REGISTER = "/auth/register-google";
export const EMAIL_LOGIN = "/auth/login-email";
export const EMAIL_REGISTER = "/auth/register-email";

// User apis
export const FETCH_USER = "/user/";
export const UPDATE_USER = "/user/";

// Upload api
export const UPLOAD = "/upload";

// Didit apis
export const FETCH_IDENTITY_VERIFICATION_SESSION = "/didit/create-session/";

// Events apis
export const FETCH_EVENTS_FEED = "/events/feed";
export const FETCH_ALL_EVENTS = "/events/all";
export const FETCH_EVENT = "/events/";

// Airports apis
export const FETCH_NEAREST_AIRPORTS = "/airports/nearest-multiple";

// Booking apis
export const FETCH_FLIGHTS_AVAILABILITY = "/booking/flights-availability/";
export const FETCH_HOTELS_AVAILABILITY = "/booking/hotels-availability/";
export const FETCH_TRANSFERS_AVAILABILITY = "/booking/transfers-availability/";
export const FETCH_HOTEL_DETAILS = "/booking/hotel/";
// /:sessionId/:hotelId/:productId/:tokenId
export const VALIDATE_FLIGHT_FARE_METHOD = "/booking/flight/validate/fare";
export const FETCH_HOTEL_ROOM_RATES = "/booking/hotel/room-rates";
export const CHECK_HOTEL_ROOM_RATES = "/booking/hotel/check-room-rates";
export const BOOKING_FLIGHT_METHOD = "/booking/flight";
export const BOOKING_HOTEL_METHOD = "/booking/hotel";
export const TICKET_FLIGHT_METHOD = "/booking/ticket/flight";
export const ADD_NEW_FLIGHT = "/booking/add/flight";
export const ADD_NEW_HOTEL = "/booking/add/hotel";
export const BOOKING_BASE = "/booking/";
export const FETCH_ALL_BOOKINGS = "/booking/all/";

// Stripe
export const FETCH_STRIPE_CUSTOMER_ID = "/stripe/customer-id";
export const FETCH_STRIPE_CLIENT_SECRET = "/stripe/client-secret";
export const SAVE_STRIPE_PAYMENT_METHOD = "/stripe/save-payment-method";
export const CREATE_STRIPE_PAYMENT_INTENT = "/stripe/payment-intent";
export const REFUND_STRIPE_PAYMENT = "/stripe/payment-refund";
