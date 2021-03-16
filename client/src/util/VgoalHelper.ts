import { ScoreStateType } from "../features/score";
import rootConfig from "../config.json";

// この型定義でJSONを扱えれば便利なのだけど……
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type VgoalInfoType = {
  name: string,                   // Vゴール名称
  condition: VgoalConditionType,  // Vゴールを達成する条件
};
type VgoalConditionType = ManualConditionType;
type ManualConditionType = {
  type: "manual",
  required?: {
    tasks: {
      id: string,
      count: number,
    }[],
  },
};

// Vゴールが可能な状況かを判断する
export function isVgoalAvailable(scoreState: ScoreStateType): boolean {
  // TODO: "manual"type以外のVゴール判定の実装
  console.assert(rootConfig.rule.vgoal.condition.type === "manual");

  const required = rootConfig.rule.vgoal.condition.required;
  return ! required.tasks.every((requiredTask) => {
    return scoreState.tasks[requiredTask.id] >= requiredTask.count;
  });
}
