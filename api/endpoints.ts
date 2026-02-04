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
export const FETCH_EVENTS_BY_USER = "/events/user";
export const CREATE_EVENT = "/events/create";

// Airports apis
export const FETCH_NEAREST_AIRPORTS = "/airports/nearest-multiple";

// Booking apis
export const FETCH_FLIGHT_OFFERS = "/booking/flight-offers";
export const FETCH_FLIGHT_OFFERS_PRICING = "/booking/flight-offers-pricing";
export const CREATE_FLIGHT_ORDER = "/booking/flight-order";
export const GET_FLIGHT_ORDER = "/booking/flight-order/";
export const CANCEL_FLIGHT_ORDER = "/booking/flight-order/";

export const FETCH_HOTEL_OFFERS = "/booking/hotel-offers";
export const FETCH_HOTEL_OFFER_PRICING = "/booking/hotel-offer-pricing/";
export const CREATE_HOTEL_ORDER = "/booking/hotel-order";

export const FETCH_TRANSFER_OFFERS = "/booking/transfer-offers";
export const CREATE_TRANSFER_ORDER = "/booking/transfer-order";

export const BOOKING_BASE = "/booking/";
export const FETCH_ALL_BOOKINGS = "/booking/all/";
export const CREATE_BOOKING = "/booking/create";
export const FETCH_BOOKINGS_BY_USERID_AND_EVENTID = "/booking/user-event/";

// Stripe
export const FETCH_STRIPE_CUSTOMER_ID = "/stripe/customer-id";
export const FETCH_STRIPE_CLIENT_SECRET = "/stripe/client-secret";
export const SAVE_STRIPE_PAYMENT_METHOD = "/stripe/save-payment-method";
export const CREATE_STRIPE_PAYMENT_INTENT = "/stripe/payment-intent";
export const REFUND_STRIPE_PAYMENT = "/stripe/payment-refund";

// Ticket
export const FETCH_ALL_TICKETS = "/ticket/all";
export const TICKET_BASE = "/ticket/";

// Transaction
export const TRANSACTION_BASE = "/tx";

// Web3
export const FETCH_TOKEN_PRICES_AND_FEE = "/web3/token-prices-fee";
