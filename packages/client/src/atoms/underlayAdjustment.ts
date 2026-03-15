import { atom } from 'recoil';

export type UnderlayAdjustment = {
  scale: number;
  offsetX: number;
  offsetY: number;
  gap: number;
};

export const defaultUnderlayAdjustment: UnderlayAdjustment = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
  gap: 120,
};

const LOCAL_STORAGE_KEY = 'RoLIMOA-underlay-adjustment';

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

export const underlayAdjustmentAtom = atom<UnderlayAdjustment>({
  key: 'underlayAdjustment',
  default: defaultUnderlayAdjustment,
  effects: [localStorageEffect<UnderlayAdjustment>(LOCAL_STORAGE_KEY)],
});
