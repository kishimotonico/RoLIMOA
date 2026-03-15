import { atom } from 'recoil';
import { screenAdjustmentEffect } from './screenAdjustmentStorage';

export type TimerAdjustment = {
  scale: number;
  offsetY: number;
  bgOpacity: number;
};

export const defaultTimerAdjustment: TimerAdjustment = {
  scale: 1.0,
  offsetY: 0,
  bgOpacity: 0,
};

export const timerAdjustmentAtom = atom<TimerAdjustment>({
  key: 'timerAdjustment',
  default: defaultTimerAdjustment,
  effects: [screenAdjustmentEffect('timer')],
});
