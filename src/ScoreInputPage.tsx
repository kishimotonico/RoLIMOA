import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import { Dashboard } from './Dashboard';
import { TaskObject } from './TaskObjectContainer';
import config from './config.json';

interface ScoreInputPageProps {
  fieldSide: "blue" | "red";
}

export const ScoreInputPage: FC<ScoreInputPageProps> = ({ fieldSide }) => {
  return (
    <Dashboard title="赤チーム得点入力">
      <Grid container spacing={3}>
        {config.rule.task_objects.map(config => (
          <TaskObject {...config} fieldSide={fieldSide}/>
        ))}
      </Grid>      
    </Dashboard>
  );
}
