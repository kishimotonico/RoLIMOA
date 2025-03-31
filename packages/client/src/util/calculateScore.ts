import type { ObjectsStateType } from '@rolimoa/common/redux';
import { score as calculateScoreImplement } from '@/custom/rule.score';
import { evaluateFormula, type FormulaExpression } from './formulaExpression';
import type { CurrentMatchStateType } from './currentMatchStateType';

export type ScoreRuleType =
  | ScoreRuleSimpleType
  | ScoreRuleFormulaExpressionType
  | ScoreRuleImplementType;

type ScoreRuleSimpleType = {
  format: 'simple';
  expression: {
    id: string;
    coefficient: number;
  }[];
};

type ScoreRuleFormulaExpressionType = {
  format: 'formulaExpression';
  expression: FormulaExpression;
};

type ScoreRuleImplementType = {
  format: 'implement';
  expression: never;
};

type ScoreResultType = {
  value: number;
  refs?: Record<string, number>;
};

function isScoreRuleSimpleType(arg: unknown): arg is ScoreRuleSimpleType {
  return (arg as ScoreRuleType).format === 'simple';
}
function isScoreRuleFormulaExpressionType(
  arg: unknown,
): arg is ScoreRuleFormulaExpressionType {
  return (arg as ScoreRuleType).format === 'formulaExpression';
}
function isScoreRuleImplementType(arg: unknown): arg is ScoreRuleImplementType {
  return (arg as ScoreRuleType).format === 'implement';
}

// `scoreRule`に基づいてスコアを算出する
export function calculateScore(
  scoreRule: ScoreRuleType,
  scoreInput: CurrentMatchStateType,
): ScoreResultType {
  // タスクオブジェクトと係数の組み合わせによるシンプルなルール
  if (isScoreRuleSimpleType(scoreRule)) {
    const value = calculateScoreSimple(scoreRule, scoreInput.taskObjects);
    return { value };
  }

  // 汎用的な計算表現による複雑なルール記述
  if (isScoreRuleFormulaExpressionType(scoreRule)) {
    return calculateScoreFormulaExpression(scoreRule, scoreInput);
  }

  // TypeScriptで実装したルール記述を使って計算
  if (isScoreRuleImplementType(scoreRule)) {
    const result = calculateScoreImplement(scoreInput);
    if (typeof result === 'number') {
      return { value: result };
    }
    return result;
  }

  throw new Error('ふぇぇ…点数計算でエラーが発生したよぉ');
}

function calculateScoreSimple(
  scoreRule: ScoreRuleSimpleType,
  taskObjects: ObjectsStateType,
): number {
  const subTotal = scoreRule.expression.map(({ coefficient, id }) => {
    const val = taskObjects[id];
    if (val === undefined) {
      console.warn(`ふぇぇ…IDが"${id}"の要素がないよぉ`);
      return Number.NaN; // error
    }
    return val * coefficient;
  });

  return subTotal.reduce((acc, cur) => acc + cur, 0);
}

function calculateScoreFormulaExpression(
  scoreRule: ScoreRuleFormulaExpressionType,
  scoreInput: CurrentMatchStateType,
): ScoreResultType {
  const referencedStats = {
    ...scoreInput,
    refRecords: {}, // refRecordsの返り値
  };
  const value = evaluateFormula(scoreRule.expression, referencedStats);

  return {
    value,
    refs: referencedStats.refRecords,
  };
}
