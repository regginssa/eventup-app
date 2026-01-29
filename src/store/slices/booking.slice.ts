import { TFlight, THotel, TTransfer } from "@/src/types";
import {
  TAmadeusFlightBookingRequest,
  TAmadeusFlightOffer,
  TAmadeusFlightOrder,
  TAmadeusHotelBookingRequest,
  TAmadeusHotelOffer,
  TAmadeusHotelOrder,
  TAmadeusTransferBookingRequest,
  TAmadeusTransferOrder,
} from "@/src/types/amadeus";
import { IBooking } from "@/src/types/booking";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IBookingState {
  flight: TFlight | null;
  hotel: THotel | null;
  transfer: TTransfer | null;
  travelers: number;
  hotelRooms: number;
  bookings: IBooking[];
}

const initialState: IBookingState = {
  flight: null,
  hotel: null,
  transfer: null,
  travelers: 1,
  hotelRooms: 1,
  bookings: [],
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
    setBookingFlightOrder(state, action: PayloadAction<TAmadeusFlightOrder>) {
      state.flight!.order = action.payload;
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
    setBookingHotelOrder(state, action: PayloadAction<TAmadeusHotelOrder>) {
      state.hotel!.order = action.payload;
    },

    setBookingTransfer(state, action: PayloadAction<TTransfer | null>) {
      state.transfer = action.payload;
    },
    setBookingTransferRequest(
      state,
      action: PayloadAction<TAmadeusTransferBookingRequest[]>
    ) {
      state.transfer!.requests = action.payload;
    },
    setBookingTransferOrder(
      state,
      action: PayloadAction<TAmadeusTransferOrder[]>
    ) {
      state.transfer!.orders = action.payload;
    },

    setBookingTravelers(state, action: PayloadAction<number>) {
      state.travelers = action.payload;
    },
    setBookingHotelRooms(state, action: PayloadAction<number>) {
      state.hotelRooms = action.payload;
    },
    setBookings(state, action: PayloadAction<IBooking[]>) {
      state.bookings = action.payload;
    },
  },
});

export const {
  setBookingFlight,
  updateBookingFlightOfferById,
  setBookingFlightRequest,
  setBookingFlightOrder,

  setBookingHotel,
  updateBookingHotelByIndex,
  setBookingHotelRequest,
  setBookingHotelOrder,

  setBookingTransfer,
  setBookingTransferRequest,
  setBookingTransferOrder,

  setBookingTravelers,
  setBookingHotelRooms,
  setBookings,
} = bookingSlice.actions;

export default bookingSlice.reducer;
