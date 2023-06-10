import React, { FC } from 'react';
import { TaskObjectContainer } from 'components/ScoreInput/TaskObjectContainer';
import { config } from 'config/load';
import { FieldSideType } from 'slices/score';

type ScoreInputPanelProps = {
  fieldSide: FieldSideType,
};

export const ScoreInputPanel: FC<ScoreInputPanelProps> = ({
  fieldSide,
}) => {
  return <>
    {
      config.rule.task_objects.map(config => (
        <TaskObjectContainer
          key={config.id}
          fieldSide={fieldSide}
          config={config}
        />
      ))
    }
  </>;
};

