import { PhaseState } from "slices/phase";
import { ScoreStateType, TaskStateType } from "slices/score";
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

type ScoreResultType = {
  value: number,
  refs?: Record<string, number>,
};

function isScoreRuleSimpleType(arg: any): arg is ScoreRuleSimpleType {
  return arg.format === "simple";
}
function isScoreRuleFormulaExpressionType(arg: any): arg is ScoreRuleFormulaExpressionType {
  return arg.format === "formulaExpression";
}

// `scoreRule`に基づいてスコアを算出する
export function calculateScore(scoreRule: ScoreRuleType, scoreState: ScoreStateType, phaseState: PhaseState): ScoreResultType {
  // タスクオブジェクトと係数の組み合わせによるシンプルなルール
  if (isScoreRuleSimpleType(scoreRule)) {
    const value = calculateScoreSimple(scoreRule, scoreState.tasks);
    return { value };
  }

  // 汎用的な計算表現による複雑なルール記述
  if (isScoreRuleFormulaExpressionType(scoreRule)) {
    return calculateScoreFormulaExpression(scoreRule, scoreState, phaseState);
  }
  
  throw new Error("ふぇぇ…点数計算でエラーが発生したよぉ");
}

function calculateScoreSimple(scoreRule: ScoreRuleSimpleType, taskObjects: TaskStateType): number {
  const subTotal = scoreRule.expression.map(({coefficient, id}) => {
    const val = taskObjects[id];
    if (val === undefined) {
      console.warn(`ふぇぇ…IDが"${id}"の要素がないよぉ`);
      return NaN; // error
    }
    return val * coefficient;
  });
  return subTotal.reduce((acc, cur) => acc + cur, 0);
}

function calculateScoreFormulaExpression(scoreRule: ScoreRuleFormulaExpressionType, scoreState: ScoreStateType, phaseState?: PhaseState): ScoreResultType {
  // 点数計算に、適切な経過時間を取得する
  function matchElapsedSec(scoreState: ScoreStateType, phaseState?: PhaseState): number {
    if (! phaseState) {
      return NaN;
    }
    // Vゴール時にはVゴールタイムを経過時間にする
    if (scoreState.vgoal) {
      return scoreState.vgoal;
    }
    // 競技終了後は競技時間を経過時間として扱う
    if (phaseState.current.id === "match_finish") {
      return Phase.getConfig("match").time;
    }
    // 競技開始前は0秒として扱う
    if (phaseState.current.id !== "match") { // TODO: ハードコーディング気味なので良いアイデアがあれば改善
      return 0;
    }
    // 競技中は、経過時間をそのまま
    return phaseState.elapsedSecond;
  }

  const taskObjects = scoreState.tasks;
  const elapsedTime = matchElapsedSec(scoreState, phaseState);

  const referencedStats: ReferencedStatsType = {
    taskObjects,
    matchStats: {
      elapsedTime,
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
