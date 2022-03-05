import { TaskStateType } from "../features/score";
import { evaluateFormula, FormulaExpression, ReferencedStatsType } from "./formulaExpression";

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
export function calculateScore(scoreRule: ScoreRuleType, taskStates: TaskStateType, elapsedSecond?: number): { value: number, refs?: {[id: string]: number} } {
  // タスクオブジェクトと係数の組み合わせによるシンプルなルール
  if (isScoreRuleSimpleType(scoreRule)) {
    const subTotal = scoreRule.expression.map(({coefficient, id}) => {
      const val = taskStates[id];
      if (val === undefined) {
        return NaN; // error
      }
      return val * coefficient;
    });
    const value = subTotal.reduce((acc, cur) => acc + cur, 0);
    return { value };
  }

  // 汎用的な計算表現による複雑なルール記述
  if (isScoreRuleFormulaExpressionType(scoreRule)) {
    const referencedStats: ReferencedStatsType = {
      taskObjects: taskStates,
      matchStats: {
        elapsedTime: elapsedSecond ?? NaN,
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
