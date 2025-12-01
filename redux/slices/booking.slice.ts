import { TFlight, THotel } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IBookingState {
  flight: TFlight | null;
  hotel: THotel | null;
}

const initialState: IBookingState = {
  flight: null,
  hotel: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingFlight(state, action: PayloadAction<TFlight | null>) {
      state.flight = action.payload;
    },
    setBookingHotel(state, action: PayloadAction<THotel | null>) {
      state.hotel = action.payload;
    },
  },
});

export const { setBookingFlight, setBookingHotel } = bookingSlice.actions;

export default bookingSlice.reducer;
