import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PhaseState = {
  current: CurrentPhaseState, // sever-sync: 現在のフェーズ
  elapsedSecond: number,      // client-only:フェーズ移行後の経過秒数
}

export type CurrentPhaseState = {
  id: string,                 // 現在のフェーズID
  startTime: number,          // フェーズの開始時刻(Unix時間)
};

export const initialState: PhaseState = {
  current: {
    id: "default",
    startTime: Date.now(),
  },
  elapsedSecond: 0,
};

export const phaseStateSlice = createSlice({
  name: 'phase',
  initialState,
  reducers: {
    setCurrent: (state, action: PayloadAction<CurrentPhaseState>) => {
      state.elapsedSecond = 0;
      state.current = action.payload;
    },
    setElapsedSecond: (state, action: PayloadAction<{ newElapsedSecond: number}>) => {
      state.elapsedSecond = action.payload.newElapsedSecond;
    },
  },
});
