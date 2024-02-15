import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../types/types";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  } as { user: null | User },
  reducers: {
    login(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { login, logout } = userSlice.actions;

export const selectuser = (state: {
  user: {
    user: {
      user: null | User;
    };
  };
}) => state.user.user;

export default userSlice.reducer;
