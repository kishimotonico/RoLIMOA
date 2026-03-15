import type { ScoreboardAdjustment } from './scoreboardAdjustment';
import type { ScreenDisplay } from './screenDisplayAtom';
import type { TimerAdjustment } from './timerAdjustment';
import type { UnderlayAdjustment } from './underlayAdjustment';

const STORAGE_KEY = 'RoLIMOA-screen-adjustment';

type ScreenAdjustmentStorage = {
  scoreboard?: ScoreboardAdjustment;
  display?: ScreenDisplay;
  underlay?: UnderlayAdjustment;
  timer?: TimerAdjustment;
};

function readStorage(): ScreenAdjustmentStorage {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as ScreenAdjustmentStorage;
  } catch {
    // パース失敗は無視
  }
  return {};
}

function writeStorage(data: ScreenAdjustmentStorage): void {
  if (Object.keys(data).length === 0) {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

export function screenAdjustmentEffect<K extends keyof ScreenAdjustmentStorage>(field: K) {
  return ({
    setSelf,
    onSet,
  }: {
    setSelf: (value: NonNullable<ScreenAdjustmentStorage[K]>) => void;
    onSet: (fn: (newValue: NonNullable<ScreenAdjustmentStorage[K]>, _: unknown, isReset: boolean) => void) => void;
  }) => {
    const stored = readStorage()[field];
    if (stored !== undefined) {
      setSelf(stored as NonNullable<ScreenAdjustmentStorage[K]>);
    }
    onSet((newValue, _, isReset) => {
      const data = readStorage();
      if (isReset) {
        delete data[field];
      } else {
        data[field] = newValue;
      }
      writeStorage(data);
    });
  };
}
