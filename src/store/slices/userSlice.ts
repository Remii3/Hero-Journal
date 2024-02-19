import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../types/types';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
  } as { user: null | User },
  reducers: {
    updateUserData(state, action) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
    },
  },
});

export const { logout, updateUserData } = userSlice.actions;

export const selectuser = (state: {
  user: {
    user: User | null;
  };
}) => state.user.user;

export default userSlice.reducer;
