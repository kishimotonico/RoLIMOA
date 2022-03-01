import { atom } from 'recoil';

export const timerClockState = atom<number | null>({
  key: "timerClockState",
  default: null,
});
