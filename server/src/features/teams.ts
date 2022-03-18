import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldSideType } from './score';

export type TeamsState = Record<FieldSideType, TeamInfo>;

export type TeamInfo = {
  short: string,      // 表示名
  id?: string,
  name?: string,
  school?: string,
};

const initialState: TeamsState = {
  blue: {
    short: "",
  },
  red: {
    short: "",
  },
};

export const teamsStateSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setCurrent: (_, action: PayloadAction<TeamsState>) => action.payload,
  },
});
