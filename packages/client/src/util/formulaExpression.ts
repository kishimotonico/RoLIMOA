// 演算子(operator)と演算対象(operand)の配列で再帰的に計算式を表現
export type FormulaExpression = OperandType;

type OperandType = (ValueType | OperatorType) & CommentType;

type CommentType = {
  "//"?: {
    record?: string,
    comment?: string,
  } | string,
};

type ValueType = ConstValueType | RefValueType;
type ConstValueType = {
  value: {
    const: number,
  },
};
type RefValueType = {
  value: {
    type: "globalObject" | "taskObject" | "matchStatus" | "refRecord",
    ref: string,
  }
};

type OperatorType = SumOperatorType | ProdOperatorType | LtOperatorType | LeOperatorType | GtOperatorType | GeOperatorType
                  | AndOperatorType | OrOperatorType | MatchOperatorType | CaseOperatorType;
type SumOperatorType = {
  operator: "sum",
  operands: OperandType[],
};
type ProdOperatorType = {
  operator: "prod",
  operands: OperandType[],
};
type LtOperatorType = {
  operator: "lt",
  operands: OperandType[],
};
type LeOperatorType = {
  operator: "le",
  operands: OperandType[],
};
type GtOperatorType = {
  operator: "gt",
  operands: OperandType[],
};
type GeOperatorType = {
  operator: "ge",
  operands: OperandType[],
};
type AndOperatorType = {
  operator: "and",
  operands: OperandType[],
};
type OrOperatorType = {
  operator: "or",
  operands: OperandType[],
};
type MatchOperatorType = {
  operator: "match",
  operands: CaseOperatorType[],
};
type CaseOperatorType = {
  operator: "case" | "default",
  operands: OperandType[],
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function isConstValueType(arg: any): arg is ConstValueType { 
  return arg.value?.const !== undefined;
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function isRefValueType(arg: any): arg is RefValueType {
  return arg.value?.ref !== undefined && arg.value?.ref !== undefined;
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function isOperatorType(arg: any): arg is OperatorType {
  return arg.operator !== undefined && arg.operands !== undefined;
}

type ReferenceVariables = {
  globalObjects: { [id: string]: number },
  taskObjects: { [id: string]: number },
  matchStats: { [id: string]: number },
  refRecords?: { [id: string]: number },
};

// 演算対象となる項（オペランド: 値もしくは計算式）を評価する
function EvaluateOperand(referencedStats: ReferenceVariables, operand: OperandType): number {
  let result = Number.NaN;

  if (isOperatorType(operand)) {
    result = EvaluateOperation(referencedStats, operand);
  }
  if (isConstValueType(operand)) {
    result = operand.value.const;
  }
  if (isRefValueType(operand)) {
    if (operand.value.type === "globalObject") {
      result = referencedStats.globalObjects[operand.value.ref];
    }
    if (operand.value.type === "taskObject") {
      result = referencedStats.taskObjects[operand.value.ref];
    }
    if (operand.value.type === "matchStatus") {
      result = referencedStats.matchStats[operand.value.ref];
    }
    if (operand.value.type === "refRecord") {
      result = referencedStats.refRecords?.[operand.value.ref] ?? Number.NaN;
    }
  }

  // "record"付きのコメントがあるとき、`refRecords`に値を格納
  if (typeof operand["//"] !== "string" && operand["//"]?.record) {
    const id = operand["//"].record;
    referencedStats.refRecords = {
      ...referencedStats.refRecords,
      [id]: result,
    };
  }

  return result;
}

// 各演算子に対応する計算結果を求める
function EvaluateOperation(referencedStats: ReferenceVariables, op: OperatorType): number {
  const values = (op.operands as OperandType[]).map(operand => EvaluateOperand(referencedStats, operand));
  switch (op.operator) {
    case "sum":
      return EvaluateSum(values);

    case "prod":
      return EvaluateProd(values);

    case "lt":
      return EvaluateLessThan(values);

    case "le":
      return EvaluateLessOrEqualThan(values);

    case "gt":
      return EvaluateGreaterThan(values);

    case "ge":
      return EvaluateGreaterOrEqualThan(values);

    case "and":
      return EvaluateAnd(values);

    case "or":
      return EvaluateOr(values);

    case "match":
      return EvaluateMatch(referencedStats, op.operands);
  }
  return Number.NaN;
}
function EvaluateSum(values: number[]): number {
  return values.reduce((acc, cur) => acc + cur);
}
function EvaluateProd(values: number[]): number {
  return values.reduce((acc, cur) => acc * cur);
}
function EvaluateLessThan(values: number[]): number {
  // [1, 2, 3, 4] -> true(1)
  return values.map((_, i, array) => i ? array[i] - array[i - 1] : null)
    .every(val => val == null || val > 0) ? 1 : 0;
}
function EvaluateLessOrEqualThan(values: number[]): number {
  // [1, 3, 3, 4] -> true(1)
  return values.map((_, i, array) => i ? array[i] - array[i - 1] : null)
    .every(val => val == null || val >= 0) ? 1 : 0;
}
function EvaluateGreaterThan(values: number[]): number {
  // [5, 2, -4] -> true(1)
  return values.map((_, i, array) => i ? array[i] - array[i - 1] : null)
    .every(val => val == null || val < 0) ? 1 : 0;
}
function EvaluateGreaterOrEqualThan(values: number[]): number {
  // [5, 3, 3, 1] -> true(1)
  return values.map((_, i, array) => i ? array[i] - array[i - 1] : null)
    .every(val => val == null || val <= 0) ? 1 : 0;
}
function EvaluateAnd(values: number[]): number {
  return values.every(Boolean) ? 1 : 0;
}
function EvaluateOr(values: number[]): number {
  return values.some(Boolean) ? 1 : 0;
}
function EvaluateMatch(referencedStats: ReferenceVariables, caseOperators: CaseOperatorType[]): number {
  const matchedCase = caseOperators.find(caseOperator =>
    caseOperator.operator === "default" || EvaluateOperand(referencedStats, caseOperator.operands[0]));
  if (matchedCase?.operator === "default") {
    return EvaluateOperand(referencedStats, matchedCase.operands[0]);
  }
  if (matchedCase?.operator === "case") {
    return EvaluateOperand(referencedStats, matchedCase.operands[1]);
  }
  return Number.NaN;
}



const defaultReferencedStats: ReferenceVariables = {
  globalObjects: {},
  taskObjects: {},
  matchStats: {},
};

export function evaluateFormula(formulaExpression: FormulaExpression, referencedStats: ReferenceVariables = defaultReferencedStats) {
  return EvaluateOperand(referencedStats, formulaExpression);
}



export function _testEvaluateFormula() {
  const testFormula: FormulaExpression = {
    "operator": "sum",
    "operands": [
      // ① オブジェクトによる得点
      {
        "//": {
          "record": "1_basic_score",
          "comment": ""
        },
        "operator": "sum",
        "operands": [
          {
            "operator": "prod",
            "operands": [
              {
                "value": {
                  "type": "taskObject",
                  "ref": "A_yellow_in",
                }
              },
              {
                "value": {
                  "const": 10,
                }
              }
            ],
          },
          {
            "operator": "prod",
            "operands": [
              {
                "value": {
                  "type": "taskObject",
                  "ref": "B_yellow_on"
                }
              },
              {
                "value": {
                  "const": 15
                }
              }
            ]
          },
          {
            "operator": "prod",
            "operands": [
              {
                "value": {
                  "type": "taskObject",
                  "ref": "C1_red_in"
                }
              },
              {
                "value": {
                  "const": 15
                }
              }
            ]
          },
          {
            "operator": "prod",
            "operands": [
              {
                "value": {
                  "type": "taskObject",
                  "ref": "D1_red_on"
                }
              },
              {
                "value": {
                  "const": 30
                }
              }
            ]
          },
          {
            "operator": "prod",
            "operands": [
              {
                "value": {
                  "type": "taskObject",
                  "ref": "C2_blue_in"
                }
              },
              {
                "value": {
                  "const": 15
                }
              }
            ]
          },
          {
            "operator": "prod",
            "operands": [
              {
                "value": {
                  "type": "taskObject",
                  "ref": "D2_blue_on"
                }
              },
              {
                "value": {
                  "const": 30
                }
              }
            ]
          },
          {
            "operator": "prod",
            "operands": [
              {
                "value": {
                  "type": "taskObject",
                  "ref": "E_ball_in"
                }
              },
              {
                "value": {
                  "const": 30
                }
              }
            ]
          },
          {
            "operator": "prod",
            "operands": [
              {
                "value": {
                  "type": "taskObject",
                  "ref": "F_ball_on"
                }
              },
              {
                "value": {
                  "const": 60
                }
              }
            ]
          }
        ],
      },
      // ②×③
      {
        "operator": "prod",
        "operands": [
          // ② ボーナスによる得点
          {
            "//": {
              "record": "2_box_count_bonus",
              "comment": ""
            },
            "operator": "sum",
            "operands": [
              {
                "operator": "prod",
                "operands": [
                  {
                    "operator": "le",
                    "operands": [
                      {
                        "value": {
                          "const": 2
                        }
                      },
                      // XYZ
                      {
                        "//": {
                          "record": "XYZ_matched_count",
                          "comment": "",
                        },
                        "operator": "sum",
                        "operands": [
                          {
                            "//": "黄色の生活用品が入っている",
                            "operator": "or",
                            "operands": [
                              {
                                "value": {
                                  "type": "taskObject",
                                  "ref": "A_yellow_in"
                                }
                              },
                              {
                                "value": {
                                  "type": "taskObject",
                                  "ref": "B_yellow_on"
                                }
                              },
                            ]
                          },
                          {
                            "//": "赤色の生活用品が入っている",
                            "operator": "or",
                            "operands": [
                              {
                                "value": {
                                  "type": "taskObject",
                                  "ref": "C1_red_in"
                                }
                              },
                              {
                                "value": {
                                  "type": "taskObject",
                                  "ref": "D1_red_on"
                                }
                              },
                            ]
                          },
                          {
                            "//": "黄色の生活用品が入っている",
                            "operator": "or",
                            "operands": [
                              {
                                "value": {
                                  "type": "taskObject",
                                  "ref": "C2_blue_in"
                                }
                              },
                              {
                                "value": {
                                  "type": "taskObject",
                                  "ref": "D2_blue_on"
                                }
                              },
                            ]
                          },
                          {
                            "//": "思い出の品が入っている",
                            "operator": "or",
                            "operands": [
                              {
                                "value": {
                                  "type": "taskObject",
                                  "ref": "E_ball_in"
                                }
                              },
                              {
                                "value": {
                                  "type": "taskObject",
                                  "ref": "F_ball_on"
                                }
                              },
                            ]
                          },
                        ]
                      }
                    ]
                  },
                  {
                    "value": {
                      "const": 20,
                    }
                  }
                ]
              },
              {
                "operator": "prod",
                "operands": [
                  {
                    "operator": "le",
                    "operands": [
                      {
                        "value": {
                          "const": 3
                        }
                      },
                      {
                        "value": {
                          "type": "refRecord",
                          "ref": "XYZ_matched_count",
                        }
                      }
                    ]
                  },
                  {
                    "value": {
                      "const": 40,
                    }
                  }
                ]
              },
              {
                "operator": "prod",
                "operands": [
                  {
                    "operator": "le",
                    "operands": [
                      {
                        "value": {
                          "const": 4
                        }
                      },
                      {
                        "value": {
                          "type": "refRecord",
                          "ref": "XYZ_matched_count",
                        }
                      }
                    ]
                  },
                  {
                    "value": {
                      "const": 60,
                    }
                  }
                ]
              }
            ]
          },
          // ③ 時間によるボーナス係数
          {
            "//": {
              "record": "3_time_bonus_coefficient",
              "comment": ""
            },
            "operator": "match",
            "operands": [
              {
                "operator": "case",
                "operands": [
                  {
                    "operator": "le",
                    "operands": [
                      {
                        "value": {
                          "type": "matchStatus",
                          "ref": "elapsedTime"
                        },
                      },
                      {
                        "value": {
                          "const": 45,
                        }
                      }
                    ],
                  },
                  {
                    "value": {
                      "const": 2.5,
                    }
                  }
                ]
              },
              {
                "operator": "case",
                "operands": [
                  {
                    "operator": "le",
                    "operands": [
                      {
                        "value": {
                          "type": "matchStatus",
                          "ref": "elapsedTime"
                        },
                      },
                      {
                        "value": {
                          "const": 90,
                        }
                      }
                    ],
                  },
                  {
                    "value": {
                      "const": 2.0,
                    }
                  }
                ]
              },
              {
                "operator": "case",
                "operands": [
                  {
                    "operator": "le",
                    "operands": [
                      {
                        "value": {
                          "type": "matchStatus",
                          "ref": "elapsedTime"
                        },
                      },
                      {
                        "value": {
                          "const": 135,
                        }
                      }
                    ],
                  },
                  {
                    "value": {
                      "const": 1.5,
                    }
                  }
                ]
              },
              {
                "operator": "default",
                "operands": [
                  {
                    "value": {
                      "const": 1.0,
                    }
                  }
                ]
              },
            ],
          }
        ]
      }
    ],
  };
  const referencedStats: ReferenceVariables = {
    globalObjects: {},
    taskObjects: {
      A_yellow_in: 0,
      B_yellow_on: 0,
      C1_red_in: 0,
      D1_red_on: 0,
      C2_blue_in: 0,
      D2_blue_on: 0,
      E_ball_in: 0,
      F_ball_on: 0,
    },
    matchStats: {
      elapsedTime: 10,
    },
  };
  console.log(evaluateFormula(testFormula, referencedStats));
}
