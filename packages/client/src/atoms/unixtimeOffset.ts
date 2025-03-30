import { atom } from 'recoil';

export const unixtimeOffset = atom<number>({
  key: "unixtimeOffset",
  default: 0,
});
