import { atom } from 'recoil';

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

const LOCAL_STORAGE_KEY = 'RoLIMOA-timer-adjustment';

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

export const timerAdjustmentAtom = atom<TimerAdjustment>({
  key: 'timerAdjustment',
  default: defaultTimerAdjustment,
  effects: [localStorageEffect<TimerAdjustment>(LOCAL_STORAGE_KEY)],
});
