import type { TimeProgressConfigType } from '../types.js';

type CustomType = NonNullable<TimeProgressConfigType['custom']>[number];

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
