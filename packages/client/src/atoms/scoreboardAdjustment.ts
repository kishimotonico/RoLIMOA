import { atom } from 'recoil';

export type ScoreboardAdjustment = {
  scale: number;
  offsetY: number;
  scoreScale: number;
  teamNameScale: number;
};

export const defaultScoreboardAdjustment: ScoreboardAdjustment = {
  scale: 1.0,
  offsetY: 0,
  scoreScale: 1.0,
  teamNameScale: 1.0,
};

const LOCAL_STORAGE_KEY = 'RoLIMOA-scoreboard-adjustment';

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

export const scoreboardAdjustmentAtom = atom<ScoreboardAdjustment>({
  key: 'scoreboardAdjustment',
  default: defaultScoreboardAdjustment,
  effects: [localStorageEffect<ScoreboardAdjustment>(LOCAL_STORAGE_KEY)],
});
