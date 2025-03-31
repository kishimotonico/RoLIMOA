import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FieldSideType } from './score.js';

export type MatchState = {
  name: string; // 試合名
  teams: TeamsType; // 各チームの情報
  isConfirmed: boolean; // 試合の結果が確定したかどうか
};

type TeamsType = Record<FieldSideType, TeamType | undefined>;

export type TeamType = {
  shortName: string; // 表示名
  id?: string;
  name?: string;
  school?: string;
};

const initialState: MatchState = {
  name: '',
  teams: {
    blue: undefined,
    red: undefined,
  },
  isConfirmed: false,
};

export const matchStateSlice = createSlice({
  name: 'match',
  initialState,
  reducers: {
    setState: (_, action: PayloadAction<MatchState>) => action.payload,
    setConfirmed: (cur, action: PayloadAction<boolean>) => {
      cur.isConfirmed = action.payload;
    },
  },
});
