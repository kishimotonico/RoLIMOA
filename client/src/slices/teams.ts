import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FieldSideType } from './score';

export type TeamsState = Record<FieldSideType, string>;

const initialState: TeamsState = {
  blue: "",
  red: "",
};

export const teamsStateSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setCurrent: (_, action: PayloadAction<TeamsState>) => action.payload,
  },
});
