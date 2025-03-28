import { atom } from 'recoil';

export const connectionState = atom<boolean>({
  key: 'connectionState',
  default: false,
});
