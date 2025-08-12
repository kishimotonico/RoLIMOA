import { z } from 'zod';
import config from '../config.js';
import type { TimeProgressConfigType } from '../types.js';

type CustomType = NonNullable<TimeProgressConfigType['custom']>[number];

/**
 * 時間経過によるカスタム設定を取得する関数
 *
 * Array.findなどに渡せる引数を返す
 *
 * @param elapsedSec 現在のフェーズ経過秒数
 * @param wholeMatchTime フェーズ全体の秒数
 * @returns {(custom: CustomType) => boolean} 指定された時間と一致するかを判定する関数
 */
export const createTimeConfigMatcher =
  (elapsedSec: number, wholeMatchTime: number) => (custom: CustomType) => {
    if (typeof custom.elapsedTime === 'number') {
      return custom.elapsedTime === elapsedSec;
    }

    // "L-10" のような形の場合、最後から10秒前に一致する
    const match = custom.elapsedTime.match(/L-(\d+)/);
    if (match) {
      const lastTime = Number.parseInt(match[1], 10);
      return wholeMatchTime - lastTime === elapsedSec;
    }
    return false;
  };

/**
 * 初期状態・デフォルトのフェーズ設定
 */
const defaultConfig = {
  id: 'default',
  type: 'default',
  description: '',
  duration: Number.MAX_SAFE_INTEGER,
  isAutoTransition: false,
  style: {
    timerFormat: 's',
    timerType: 'countup',
  },
  custom: [],
} as Required<TimeProgressConfigType>;

/**
 * time_progressの各フェーズについて取得する関数群
 */
export const Phase = {
  getIndex: (phaseId?: string): number => {
    if (phaseId === undefined || phaseId === 'default') {
      return 0;
    }
    return config.time_progress.findIndex((phase) => phase.id === phaseId);
  },

  getConfig: (
    phaseId?: string,
    overrideConfig?: { [k: string]: unknown },
  ): Required<TimeProgressConfigType> => {
    if (phaseId === undefined || phaseId === 'default') {
      return defaultConfig;
    }
    return {
      ...defaultConfig,
      ...config.time_progress[Phase.getIndex(phaseId)],
      ...getOverriddenConfig(phaseId, overrideConfig),
    };
  },

  getRawConfig: (phaseId: string): TimeProgressConfigType => {
    if (phaseId === 'default') {
      return defaultConfig;
    }
    return config.time_progress[Phase.getIndex(phaseId)];
  },

  isLast: (phaseId: string): boolean => {
    if (phaseId === 'default') {
      return true;
    }
    return Phase.getIndex(phaseId) === config.time_progress.length - 1;
  },

  getFirstPhase: (): string => {
    return config.time_progress[0].id;
  },

  getLastPhase: (): string => {
    return config.time_progress[config.time_progress.length - 1].id;
  },

  getPrevPhase: (phaseId: string): string => {
    if (phaseId === 'default' || Phase.getIndex(phaseId) === 0) {
      return phaseId;
    }
    return config.time_progress[Phase.getIndex(phaseId) - 1].id;
  },

  getNextPhase: (phaseId: string): string => {
    if (phaseId === 'default' || Phase.isLast(phaseId)) {
      return phaseId;
    }
    return config.time_progress[Phase.getIndex(phaseId) + 1].id;
  },
};

/**
 * フェーズ設定に上書き設定を適用する
 */
const getOverriddenConfig = (
  phaseId: string,
  configOverrides?: {
    [key: string]: unknown;
  },
): Partial<TimeProgressConfigType> => {
  // configOverridesは `{ 'phase.match': { duration: 60 } }` のような形
  const unknownOverrides = configOverrides?.[`phase.${phaseId}`];
  const parsed = overridesSchema.safeParse(unknownOverrides);

  return parsed.success ? { ...parsed.data } : {};
};

const overridesSchema = z.object({
  duration: z.number().optional(),
});
