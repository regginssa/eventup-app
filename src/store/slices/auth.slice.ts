import { IUser } from "@/src/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUserSliceState {
  isAuthenticated: boolean;
  user: IUser | null;
  lastUpdated: number | null;
}

const initialAuthSliceState: IUserSliceState = {
  isAuthenticated: false,
  user: null,
  lastUpdated: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthSliceState,
  reducers: {
    setAuth: (
      state: IUserSliceState,
      action: PayloadAction<{ isAuthenticated: boolean; user: IUser | null }>
    ) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
    },
    setAuthUser: (state: IUserSliceState, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
  },
});

export const { setAuth, setAuthUser } = authSlice.actions;

export default authSlice.reducer;
