import { FieldSideType } from '@/slices/score';

export type CurrentMatchStateType = {
  // 自チームの青コート or 赤コート
  fieldSide: FieldSideType,

  // グローバルオブジェクト
  globalObjects: { [id: string]: number },

  // 自チームのタスクオブジェクト
  taskObjects: { [id: string]: number },

  matchStats: {
    // 試合の経過時間
    elapsedTime: number,

    // Vゴールフラグ（0: Vゴールしていない, 1: Vゴールした）
    isVgoaled: number,

    // Vゴールタイム
    vgoalTime?: number,
  },
};

