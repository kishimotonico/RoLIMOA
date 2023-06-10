import React, { FC } from 'react';
import { FieldSideType } from 'slices/score';
import { TaskObjectContainer } from 'components/ScoreInput/TaskObjectContainer';
import { GlobalObjectContainer } from './GlobalObjectContainer';
import { config } from 'config/load';

type ScoreInputPanelProps = {
  fieldSide: FieldSideType,
};

export const ScoreInputPanel: FC<ScoreInputPanelProps> = ({
  fieldSide,
}) => {
  return <>
    {
      config.rule.global_objects.map(config => (
        <GlobalObjectContainer key={config.id} config={config} />
      ))
    }
    {
      config.rule.task_objects.map(config => (
        <TaskObjectContainer key={config.id} fieldSide={fieldSide} config={config} />
      ))
    }
  </>;
};

