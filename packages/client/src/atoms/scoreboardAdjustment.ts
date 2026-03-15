import { atom } from 'recoil';
import { screenAdjustmentEffect } from './screenAdjustmentStorage';

export type ScoreboardAdjustment = {
  scale: number;
  offsetY: number;
  scoreScale: number;
  teamNameScale: number;
};

export const defaultScoreboardAdjustment: ScoreboardAdjustment = {
  scale: 1.0,
  offsetY: 0,
  scoreScale: 1.0,
  teamNameScale: 1.0,
};

export const scoreboardAdjustmentAtom = atom<ScoreboardAdjustment>({
  key: 'scoreboardAdjustment',
  default: defaultScoreboardAdjustment,
  effects: [screenAdjustmentEffect('scoreboard')],
});
