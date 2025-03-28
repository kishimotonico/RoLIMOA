import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type StreamingInterface = {
  showMainHud: boolean;
  showScoreBoard: boolean;
};

const initialState: StreamingInterface = {
  showMainHud: true,
  showScoreBoard: true,
};

export const streamingInterfaceSlice = createSlice({
  name: 'streamingInterface',
  initialState,
  reducers: {
    setState: (_, action: PayloadAction<StreamingInterface>) => action.payload,
    setShowMainHud: (cur, action: PayloadAction<boolean>) => {
      cur.showMainHud = action.payload;
    },
    setShowScoreBoard: (cur, action: PayloadAction<boolean>) => {
      cur.showScoreBoard = action.payload;
    },
  },
});
