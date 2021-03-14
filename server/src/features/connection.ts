import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: boolean = false;

export const connectionStateSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setCurrent: (_, action: PayloadAction<boolean>) => action.payload,
  },
});
