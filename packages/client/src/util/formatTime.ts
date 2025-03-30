import type { TimeFormat } from '@rolimoa/common/config';

// 秒数をフォーマット表示した文字列を返す
export const formatTime = (
  second: number,
  format: TimeFormat,
  colonWithSpace = false,
): string => {
  const m = Math.floor(second / 60);
  const s = second % 60;
  const colon = colonWithSpace ? ' : ' : ':';
  if (format === 'mm:ss') {
    return `${m.toString().padStart(2, '0')}${colon}${s.toString().padStart(2, '0')}`;
  }
  if (format === 'm:ss') {
    return `${m.toString().padStart(1, '0')}${colon}${s.toString().padStart(2, '0')}`;
  }
  if (format === 'ss') {
    return second.toString().padStart(2, '0');
  }
  if (format === 's') {
    return second.toString();
  }

  throw new Error(`Invalid format "${format}"`);
};

// mm:ss形式の文字列から秒数を取得する。正しくないときはNaNが返る
export const parseFormatTime = (time: string): number => {
  const timeArray = time.split(':');
  if (timeArray.length === 1) {
    return Number.parseInt(timeArray[0], 10);
  }
  if (timeArray.length === 2) {
    return (
      Number.parseInt(timeArray[0], 10) * 60 + Number.parseInt(timeArray[1], 10)
    );
  }
  throw new Error('Invalid time format');
};

// Unix時刻をミリ秒まで含めた `23:59:01.234` 形式の日時にする
export const unixToTimeWithMillis = (unixtime: number): string => {
  const date = new Date(unixtime);
  const hhmmss = date.toLocaleTimeString('sv-SE');
  const ms = (date.getMilliseconds() % 1000).toString().padStart(3, '0');

  return `${hhmmss}.${ms}`;
};
