import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// `startTime`から経過した現在の秒数を取得する
export function calculateElapsedSecond(
  startTime: number,
  nowUnixtime: number | undefined = undefined,
  pausedTime: number | undefined = undefined,
): number {
  const now = nowUnixtime ?? Date.now();
  return Math.floor((pausedTime ?? now - startTime) / 1000);
}

export type PhaseState = {
  current: CurrentPhaseState; // sever-sync: 現在のフェーズ
  elapsedSecond: number; // client-only:フェーズ移行後の経過秒数
};

export type CurrentPhaseState = {
  id: string; // 現在のフェーズID
  startTime: number; // フェーズの開始時刻(Unix時間)
  pausedTime?: number; // フェーズの一時停止時刻(Unix時間)
};

export const initialState: PhaseState = {
  current: {
    id: 'default',
    startTime: Date.now(),
    pausedTime: undefined,
  },
  elapsedSecond: 0,
};

export const phaseStateSlice = createSlice({
  name: 'phase',
  initialState,
  reducers: {
    setState: (state, action: PayloadAction<CurrentPhaseState>) => {
      state.elapsedSecond = calculateElapsedSecond(
        action.payload.startTime,
        action.payload.pausedTime,
      );
      state.current = action.payload;
    },
    setElapsedSecond: (
      state,
      action: PayloadAction<{ newElapsedSecond: number }>,
    ) => {
      state.elapsedSecond = action.payload.newElapsedSecond;
    },
    setPause: (state, action: PayloadAction<{ pausedTime?: number }>) => {
      state.current.pausedTime = action.payload.pausedTime;
    },
  },
});
