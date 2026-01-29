import { IEvent } from "@/src/types/event";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IEventState {
  newEvent: IEvent | null;
}

const initialState: IEventState = {
  newEvent: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setNewEvent(state, action: PayloadAction<IEvent>) {
      state.newEvent = action.payload;
    },
  },
});

export const { setNewEvent } = eventSlice.actions;

export default eventSlice.reducer;
