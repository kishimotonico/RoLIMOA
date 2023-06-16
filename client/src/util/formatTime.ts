import { TimeFormat } from 'config/types';

// 秒数をフォーマット表示した文字列を返す
export const formatTime = (
  second: number,
  format: TimeFormat,
  colonWithSpace: boolean = false,
): string => {
  const m = Math.floor(second / 60);
  const s = second % 60;
  const colon = colonWithSpace ? " : " : ":";
  if (format === "mm:ss") {
    return `${m.toString().padStart(2, '0')}${colon}${s.toString().padStart(2, '0')}`;
  }
  if (format === "m:ss") {
    return `${m.toString().padStart(1, '0')}${colon}${s.toString().padStart(2, '0')}`;
  }
  if (format === "ss") {
    return second.toString().padStart(2, '0');
  }
  if (format === "s") {
    return second.toString();
  }

  throw new Error(`Invalid format "${format}"`);
};

// mm:ss形式の文字列から秒数を取得する。正しくないときはNaNが返る
export const parseFormatTime = (time: string): number => {
  const timeArray = time.split(':');
  if (timeArray.length === 1) {
    return parseInt(timeArray[0], 10);
  }
  if (timeArray.length === 2) {
    return parseInt(timeArray[0], 10) * 60 + parseInt(timeArray[1], 10);
  }
  throw new Error("Invalid time format");
};
