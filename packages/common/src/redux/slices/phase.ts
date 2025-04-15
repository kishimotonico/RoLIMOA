import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { config } from '../../config/index.js';

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

export const phaseInitialState: PhaseState = {
  current: {
    id: 'default',
    startTime: Date.now(),
    pausedTime: undefined,
  },
  elapsedSecond: 0,
};

export const phaseStateSlice = createSlice({
  name: 'phase',
  initialState: phaseInitialState,
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
    // タイマーを一時停止する
    doPause: (state, action: PayloadAction<{ now: number }>) => {
      if (state.current.pausedTime) {
        console.warn('ふぇぇ！一時停止中に再度一時停止しようとしてるよぉ');
        return;
      }
      state.current.pausedTime = action.payload.now;
    },
    // タイマーの一時停止を解除する
    doResume: (state, action: PayloadAction<{ now: number }>) => {
      if (!state.current.pausedTime) {
        console.warn('ふぇぇ！一時停止していないのに再開しようとしてるよぉ');
        return;
      }

      const now = action.payload.now;
      if (config.option.truncate_millisec_on_pause) {
        // 再開時に、ミリ秒を切り捨てる (e.g: 9.9 sで一時停止したときに、9.0 sからタイマーを再開する)
        const newElapsedSec = calculateElapsedSecond(
          state.current.startTime,
          state.current.pausedTime,
        );
        const delta = 10; // 多分大丈夫だけど、丸め誤差対策に念のため…
        state.current.startTime = now - (newElapsedSec * 1000 + delta);
        state.current.pausedTime = undefined;
      } else {
        // 切り捨てない
        const pausedDuration =
          state.current.pausedTime - state.current.startTime;
        state.current.startTime = now - pausedDuration;
        state.current.pausedTime = undefined;
      }
    },
  },
});
