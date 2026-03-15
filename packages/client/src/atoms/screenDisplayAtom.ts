import { atom } from 'recoil';
import { screenAdjustmentEffect } from './screenAdjustmentStorage';

export type ScreenDisplay = {
  reverse: boolean;
};

export const defaultScreenDisplay: ScreenDisplay = {
  reverse: false,
};

export const screenDisplayAtom = atom<ScreenDisplay>({
  key: 'screenDisplay',
  default: defaultScreenDisplay,
  effects: [screenAdjustmentEffect('display')],
});
