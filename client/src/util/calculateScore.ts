import { PhaseState } from "slices/phase";
import { FieldScoreStateType, FieldSideType, ObjectsStateType, ScoreState } from "slices/score";
import { score as calculateScoreImplement } from "custom/rule.score";
import { evaluateFormula, FormulaExpression } from "./formulaExpression";
import * as Phase from "util/PhaseStateUtil";
import { ScoreInputType } from "./calculateScoreTypes";

export type ScoreRuleType = ScoreRuleSimpleType | ScoreRuleFormulaExpressionType | ScoreRuleImplementType;

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

type ScoreRuleImplementType = {
  format: "implement",
  expression: never,
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
function isScoreRuleImplementType(arg: any): arg is ScoreRuleImplementType {
  return arg.format === "implement";
}

// `scoreRule`に基づいてスコアを算出する
export function calculateScore(scoreRule: ScoreRuleType, fieldSide: FieldSideType, scoreState: ScoreState, phaseState: PhaseState): ScoreResultType {
  // タスクオブジェクトと係数の組み合わせによるシンプルなルール
  if (isScoreRuleSimpleType(scoreRule)) {
    const value = calculateScoreSimple(scoreRule, scoreState.fields[fieldSide].tasks);
    return { value };
  }

  const scoreInput = createScoreInput(fieldSide, scoreState, phaseState);

  // 汎用的な計算表現による複雑なルール記述
  if (isScoreRuleFormulaExpressionType(scoreRule)) {
    return calculateScoreFormulaExpression(scoreRule, scoreInput);
  }

  // TypeScriptで実装したルール記述を使って計算
  if (isScoreRuleImplementType(scoreRule)) {
    const result = calculateScoreImplement(scoreInput);
    if (typeof result === "number" ) {
      return { value: result };
    }
    return result;
  }

  throw new Error("ふぇぇ…点数計算でエラーが発生したよぉ");
}

function createScoreInput(fieldSide: FieldSideType, scoreState: ScoreState, phaseState?: PhaseState): ScoreInputType {
  // 点数計算に、適切な経過時間を取得する
  function matchElapsedSec(scoreState: FieldScoreStateType, phaseState?: PhaseState): number {
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

  return {
    fieldSide,
    globalObjects: scoreState.global,
    taskObjects: scoreState.fields[fieldSide].tasks,
    matchStats: {
      elapsedTime: matchElapsedSec(scoreState.fields[fieldSide], phaseState),
      isVgoaled: scoreState.fields[fieldSide].vgoal !== undefined ? 1 : 0,
      vgoalTime: scoreState.fields[fieldSide].vgoal ?? NaN,
    },
  };
}

function calculateScoreSimple(scoreRule: ScoreRuleSimpleType, taskObjects: ObjectsStateType): number {
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

function calculateScoreFormulaExpression(scoreRule: ScoreRuleFormulaExpressionType, scoreInput: ScoreInputType): ScoreResultType {
  const referencedStats = {
    ...scoreInput,
    refRecords: {}, // refRecordsの返り値
  };
  const value = evaluateFormula(scoreRule.expression, referencedStats);

  return {
    value,
    refs: referencedStats.refRecords
  };
}
