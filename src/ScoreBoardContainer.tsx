import React, { FC } from 'react';
import { GlobalState, TaskObjectsType, WholeTaskState } from './reducer';
import { ScoreBoardComponent } from './ScoreBoardComponent';
import { useSelector } from 'react-redux';
import config from './config.json';

function calcScore(rule: { coefficient: number; id: string; }[], taskState: TaskObjectsType): number {
  return rule.map(({coefficient, id}) => {
    const val = taskState[id];
    if (val === undefined) {
      return NaN; // error
    }
    return val * coefficient;
  }).reduce((acc, cur) => acc + cur, 0);
}

interface ScoreBoardContainerProps {
  focusedFieldSide?: "blue"|"red"|undefined;
}

export const ScoreBoardContainer: FC<ScoreBoardContainerProps> = ({
  focusedFieldSide = undefined,
}) => {
  const taskState = useSelector<GlobalState, WholeTaskState>((state) => state.taskObjects);

  const blueScore = calcScore(config.rule.score, taskState.blue);
  const redScore = calcScore(config.rule.score, taskState.red);

  return <ScoreBoardComponent blueScore={blueScore} redScore={redScore} focusedFieldSide={focusedFieldSide}/>;
};
