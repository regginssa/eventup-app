import { TPagination } from "@/types";
import type { IEvent } from "@/types/data";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IEventState {
  events: IEvent[];
  pagination: TPagination;
  loading: boolean;
  newEvent: IEvent | null;
}

const initialState: IEventState = {
  events: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  },
  loading: false,
  newEvent: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setAllEvents(state, action: PayloadAction<IEvent[]>) {
      state.events = action.payload;
    },
    setPagination(state, action: PayloadAction<TPagination>) {
      state.pagination = action.payload;
    },
    addManyEvents(state, action: PayloadAction<IEvent[]>) {
      state.events.push(...action.payload);
    },
    setEventLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setNewEvent(state, action: PayloadAction<IEvent>) {
      state.newEvent = action.payload;
    },
  },
});

export const {
  setAllEvents,
  setPagination,
  addManyEvents,
  setEventLoading,
  setNewEvent,
} = eventSlice.actions;

export default eventSlice.reducer;
