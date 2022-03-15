import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PhaseState = {
  id: string,
  startTime: number
};

export const initialState: PhaseState = {
  id: "default",
  startTime: Date.now(),
};

export const phaseStateSlice = createSlice({
  name: 'phase',
  initialState,
  reducers: {
    setCurrent: (_, action: PayloadAction<PhaseState>) => action.payload,
  },
});
