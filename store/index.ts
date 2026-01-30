import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useSelector } from "react-redux";

// Reducers
import authReducer from "./slices/auth.slice";
import bookingReducer from "./slices/booking.slice";
import eventReducer from "./slices/event.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,

      // OR tune if you prefer keeping them:
      // serializableCheck: { warnAfter: 128 },
      // immutableCheck:    { warnAfter: 128 },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Custom hooks for dispatch and selector with types
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
