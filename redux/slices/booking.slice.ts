import {
  IRoomRate,
  ITransferBookingRequest,
  TFlight,
  THotel,
  TTransfer,
} from "@/types";
import { IBooking } from "@/types/data";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IBookingState {
  flight: TFlight | null;
  hotel: THotel | null;
  transfer: TTransfer | null;
  bookings: IBooking[];
}

const initialState: IBookingState = {
  flight: null,
  hotel: null,
  transfer: null,
  bookings: [],
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
    setBookingTransfer(state, action: PayloadAction<TTransfer | null>) {
      state.transfer = action.payload;
    },
    setBookingHotelRoomRates(state, action: PayloadAction<IRoomRate[]>) {
      if (state.hotel?.recommend) {
        state.hotel.recommend.roomRates = action.payload;
      }
    },
    setBookingHotelSelectedRoomRate(
      state,
      action: PayloadAction<IRoomRate | undefined>
    ) {
      if (state.hotel) {
        state.hotel.selectedRoomRate = action.payload;
      }
    },
    setBookingTransferBookingRequest(
      state,
      action: PayloadAction<{
        request: ITransferBookingRequest;
        type: "ah" | "he";
      }>
    ) {
      if (!state.transfer) return;

      const { type, request } = action.payload;
      state.transfer[type].bookingRequest = request;
    },
    addNewBooking(state, action: PayloadAction<IBooking>) {
      state.bookings.push(action.payload);
    },
    updateBooking(
      state,
      action: PayloadAction<{ id: string; booking: IBooking }>
    ) {
      const index = state.bookings.findIndex(
        (b) => b._id === action.payload.id
      );
      if (index !== -1) {
        state.bookings[index] = action.payload.booking;
      }
    },
  },
});

export const {
  setBookingFlight,
  setBookingHotel,
  setBookingTransfer,
  setBookingHotelRoomRates,
  setBookingHotelSelectedRoomRate,
  setBookingTransferBookingRequest,
  addNewBooking,
  updateBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
