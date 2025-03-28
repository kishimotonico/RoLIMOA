import { atom } from 'recoil';

export const isDrawerOpen = atom<undefined | boolean>({
  key: 'isDrawerOpen',
  default: undefined,
});
