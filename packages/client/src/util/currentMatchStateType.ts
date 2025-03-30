import type { FieldSideType } from '@rolimoa/common/redux';

export type CurrentMatchStateType = {
  // 自チームの青コート or 赤コート
  fieldSide: FieldSideType;

  // グローバルオブジェクト
  globalObjects: { [id: string]: number };

  // 自チームのタスクオブジェクト
  taskObjects: { [id: string]: number };

  // 相手チームのタスクオブジェクト
  // TODO: ひとまずの実装。もっと良い構造がある気がするので改善したい
  opponentTaskObjects: { [id: string]: number };

  matchStats: {
    // 試合の経過時間
    elapsedTime: number;

    // Vゴールフラグ（0: Vゴールしていない, 1: Vゴールした）
    isVgoaled: number;

    // Vゴールタイム
    vgoalTime?: number;
  };
};
