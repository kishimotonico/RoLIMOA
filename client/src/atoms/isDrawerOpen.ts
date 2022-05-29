import { atom } from 'recoil';

export const isDrawerOpen = atom<boolean>({
  key: "isDrawerOpen",
  default: true,
});
