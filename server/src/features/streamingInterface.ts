import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type StreamingInterface = {
  showMainHud: boolean,
};

const initialState: StreamingInterface = {
  showMainHud: true,
};

export const streamingInterfaceSlice = createSlice({
  name: 'streamingInterface',
  initialState,
  reducers: {
    setState: (_, action: PayloadAction<StreamingInterface>) => action.payload,
    setShowMainHud: (cur, action: PayloadAction<boolean>) => {
      cur.showMainHud = action.payload;
    },
  },
});
