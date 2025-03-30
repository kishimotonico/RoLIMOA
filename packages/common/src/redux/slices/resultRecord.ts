import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { MatchState } from './match.js';
import type { FieldSideType, ScoreState } from './score.js';

export type ResultRecordsType = ResultRecord[];

export type ResultRecord = {
  match: MatchState; // 対戦チーム
  finalScore: ScoreState; // 最終的な試合状況

  comment?: string; // 備考
  confirmedScore: ConfirmedScore; // 確定した点数（基本的にはfinalScoreで算出されるスコアと同じになる）
  confirmedBy?: string; // 結果を確定したユーザ名
  confirmedAt?: number; // 結果を確定した時刻
};

type ConfirmedScore = Record<FieldSideType, number>;

export const resultRecordsStateSlice = createSlice({
  name: 'resultRecords',
  initialState: [] as ResultRecordsType,
  reducers: {
    setState: (_, action: PayloadAction<ResultRecordsType>) => action.payload,
    addResult: (cur, action: PayloadAction<ResultRecord>) => {
      cur.push(action.payload);
    },
  },
});
