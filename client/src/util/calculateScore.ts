import { PhaseState } from "slices/phase";
import { ScoreStateType } from "../slices/score";
import { evaluateFormula, FormulaExpression, ReferencedStatsType } from "./formulaExpression";
import * as Phase from "util/PhaseStateUtil";

export type ScoreRuleType = ScoreRuleSimpleType | ScoreRuleFormulaExpressionType;

type ScoreRuleSimpleType = {
  format: "simple",
  expression: {
    id: string,
    coefficient: number,
  }[],
};

type ScoreRuleFormulaExpressionType = {
  format: "formulaExpression",
  expression: FormulaExpression,
};

function isScoreRuleSimpleType(arg: any): arg is ScoreRuleSimpleType {
  return arg.format === "simple";
}
function isScoreRuleFormulaExpressionType(arg: any): arg is ScoreRuleFormulaExpressionType {
  return arg.format === "formulaExpression";
}

// `scoreRule`に基づいてスコアを算出する
export function calculateScore(scoreRule: ScoreRuleType, scoreState: ScoreStateType, phaseState: PhaseState): { value: number, refs?: Record<string, number> } {
  const taskObjects = scoreState.tasks;

  // タスクオブジェクトと係数の組み合わせによるシンプルなルール
  if (isScoreRuleSimpleType(scoreRule)) {
    const subTotal = scoreRule.expression.map(({coefficient, id}) => {
      const val = taskObjects[id];
      if (val === undefined) {
        console.warn(`ふぇぇ…IDが"${id}"の要素がないよぉ`);
        return NaN; // error
      }
      return val * coefficient;
    });
    const value = subTotal.reduce((acc, cur) => acc + cur, 0);
    return { value };
  }

  // 汎用的な計算表現による複雑なルール記述
  if (isScoreRuleFormulaExpressionType(scoreRule)) {
    let matchElapsedSec = phaseState.elapsedSecond;
    // Vゴール時にはVゴールタイムを経過時間にする
    if (scoreState.vgoal) {
      matchElapsedSec = scoreState.vgoal;
    }
    // 競技開始前は0秒として扱う
    if (phaseState.current.id !== "match") { // TODO: ハードコーディング気味なので良いアイデアがあれば改善
      matchElapsedSec = 0;
    }
    // 競技終了後は競技時間を経過時間として扱う
    if (phaseState.current.id === "match_finish") {
      matchElapsedSec = Phase.getConfig("match").time;
    }

    const referencedStats: ReferencedStatsType = {
      taskObjects,
      matchStats: {
        elapsedTime: matchElapsedSec,
        isVgoaled: scoreState.vgoal !== undefined ? 1 : 0,
        vgoalTime: scoreState.vgoal ?? NaN,
      },
    };
    const value = evaluateFormula(scoreRule.expression, referencedStats);
    return {
      value,
      refs: referencedStats.refRecords
    };
  }

  return {
    value: NaN,
  };
}
