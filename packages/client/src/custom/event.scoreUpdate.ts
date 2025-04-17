import type { Dispatch, UnknownAction } from '@reduxjs/toolkit';
import type { scoreStateSlice } from '@rolimoa/common/redux';

type ActionType =
  | ReturnType<typeof scoreStateSlice.actions.setTaskUpdate>
  | ReturnType<typeof scoreStateSlice.actions.setGloablUpdate>;

export type ScoreUpdateContext = {
  dispatch: Dispatch<UnknownAction>;
  event: {
    type: 'scoreUpdate';
    afterValue: number;
    fieldSide: 'blue' | 'red' | 'global';
    taskObjectId: string;
    command?: string;
    action: ActionType;
  };
  extra?: {
    [key: string]: unknown;
  };
};

/**
 * 点数の更新をdispatchする前のイベント
 *
 * この関数でfalseを返すと、点数の更新など後続の処理をキャンセルします。
 * その場合、onScoreUpdateAfterも実行されません。
 *
 * @param _ctx
 */
export function onScoreUpdateBefore(_ctx: ScoreUpdateContext): boolean {
  // const { event } = _ctx;
  // if (event.fieldSide === 'blue' && event.taskObjectId === 'hoge') {
  //   console.log('青コートだけ11点以上にさせない');
  //   return event.afterValue <= 10;
  // }

  return true;
}

/**
 * 点数の更新をdispatchした後のイベント
 *
 * @param _ctx
 */
export function onScoreUpdateAfter(_ctx: ScoreUpdateContext): void {
  // const { event } = _ctx;
  // console.log(
  //   `${event.fieldSide}コートの${event.taskObjectId}が${event.afterValue}に更新されたよ`,
  // );
}
