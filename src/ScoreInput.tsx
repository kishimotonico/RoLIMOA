import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import { TaskObject } from './TaskObjectContainer';
import config from './config.json';

interface ScoreInputProps {
  fieldSide: "blue" | "red";
}

export const ScoreInput: FC<ScoreInputProps> = ({ fieldSide }) => {
  return (
    <Grid container spacing={3}>
      {config.rule.task_objects.map(config => (
        <TaskObject {...config} fieldSide={fieldSide}/>
      ))}
    </Grid>
  );
}
