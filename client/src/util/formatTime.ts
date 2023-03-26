export type TimeFormat = "mm:ss" | "m:ss" | "ss" | "s";

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

  throw new Error("Invalid format");
};
