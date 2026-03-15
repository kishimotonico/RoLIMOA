import { atom } from 'recoil';
import { screenAdjustmentEffect } from './screenAdjustmentStorage';

export type UnderlayAdjustment = {
  scale: number;
  offsetY: number;
  gap: number;
  opacity: number;
};

export const defaultUnderlayAdjustment: UnderlayAdjustment = {
  scale: 1.0,
  offsetY: 0,
  gap: 120,
  opacity: 1.0,
};

export const underlayAdjustmentAtom = atom<UnderlayAdjustment>({
  key: 'underlayAdjustment',
  default: defaultUnderlayAdjustment,
  effects: [screenAdjustmentEffect('underlay')],
});
