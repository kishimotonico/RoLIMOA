import { atom } from 'recoil';

export type ScreenDisplay = {
  reverse: boolean;
};

export const defaultScreenDisplay: ScreenDisplay = {
  reverse: false,
};

const LOCAL_STORAGE_KEY = 'RoLIMOA-screen-display';

const localStorageEffect =
  <T>(key: string) =>
  ({ setSelf, onSet }: { setSelf: (value: T) => void; onSet: (fn: (value: T) => void) => void }) => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setSelf(JSON.parse(stored) as T);
      } catch {
        // パースに失敗した場合はデフォルト値を使用
      }
    }
    onSet((newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const screenDisplayAtom = atom<ScreenDisplay>({
  key: 'screenDisplay',
  default: defaultScreenDisplay,
  effects: [localStorageEffect<ScreenDisplay>(LOCAL_STORAGE_KEY)],
});
