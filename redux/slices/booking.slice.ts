import { TFlight, THotel, TTransfer } from "@/types";
import {
  TAmadeusFlightBookingRequest,
  TAmadeusFlightOffer,
  TAmadeusHotelBookingRequest,
  TAmadeusHotelOffer,
} from "@/types/amadeus";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IBookingState {
  flight: TFlight | null;
  hotel: THotel | null;
  transfer: TTransfer | null;
  travelers: number;
  hotelRooms: number;
}

const initialState: IBookingState = {
  flight: null,
  hotel: null,
  transfer: null,
  travelers: 1,
  hotelRooms: 1,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setBookingFlight(state, action: PayloadAction<TFlight | null>) {
      state.flight = action.payload;
    },
    updateBookingFlightOfferById(
      state,
      action: PayloadAction<{ id: string; offer: TAmadeusFlightOffer }>
    ) {
      const index = state.flight?.offers.findIndex(
        (f) => f.id === action.payload.id
      );

      if (index !== -1) {
        state.flight!.offers[index as number] = action.payload.offer;
      }
    },
    setBookingFlightRequest(
      state,
      action: PayloadAction<TAmadeusFlightBookingRequest>
    ) {
      state.flight!.request = action.payload;
    },

    setBookingHotel(state, action: PayloadAction<THotel | null>) {
      state.hotel = action.payload;
    },

    updateBookingHotelByIndex(
      state,
      action: PayloadAction<{ index: number; offer: TAmadeusHotelOffer }>
    ) {
      state.hotel!.offers[action.payload.index] = action.payload.offer;
    },

    setBookingHotelRequest(
      state,
      action: PayloadAction<TAmadeusHotelBookingRequest>
    ) {
      state.hotel!.request = action.payload;
    },

    setBookingTravelers(state, action: PayloadAction<number>) {
      state.travelers = action.payload;
    },
    setBookingHotelRooms(state, action: PayloadAction<number>) {
      state.hotelRooms = action.payload;
    },

    setBookingTransfer(state, action: PayloadAction<TTransfer | null>) {
      state.transfer = action.payload;
    },
  },
});

export const {
  setBookingFlight,
  updateBookingFlightOfferById,
  setBookingFlightRequest,

  setBookingHotel,
  updateBookingHotelByIndex,
  setBookingHotelRequest,

  setBookingTransfer,

  setBookingTravelers,
  setBookingHotelRooms,
} = bookingSlice.actions;

export default bookingSlice.reducer;
