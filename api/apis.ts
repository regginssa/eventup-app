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
export const UPDATE_USER_NEAREST_AIRPORTS = "/airports/multiple";

// Booking apis
export const FETCH_STANDARD_FLIGHTS_AVAILABILITY =
  "/booking/standard-package/flights-availability/";
export const FETCH_STANDARD_HOTELS_AVAILABILITY =
  "/booking/standard-package/hotels-availability/";
export const FETCH_STANDARD_TRANSFERS_AVAILABILITY =
  "/booking/standard-package/transfers-availability/";
export const FETCH_HOTEL_DETAILS = "/booking/hotel/";
// /:sessionId/:hotelId/:productId/:tokenId
export const VALIDATE_FLIGHT_FARE_METHOD = "/booking/flight/validate/fare";

// Stripe
export const FETCH_STRIPE_CUSTOMER_ID = "/stripe/customer-id";
export const FETCH_STRIPE_CLIENT_SECRET = "/stripe/client-secret";
export const SAVE_STRIPE_PAYMENT_METHOD = "/stripe/save-payment-method";
