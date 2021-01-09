import React, { FC } from 'react';
import { Grid } from '@material-ui/core';
import { Dashboard } from './Dashboard';
import { TaskObject } from './TaskObjectContainer';
import { ScoreBoard } from './ScoreBoard';
import config from './config.json';

interface ScoreInputPageProps {
  fieldSide: "blue" | "red";
}

export const ScoreInputPage: FC<ScoreInputPageProps> = ({ fieldSide }) => {
  const kanji = {blue: "青", red: "赤"}[fieldSide];

  return (
    <Dashboard title={`${kanji}チーム得点入力`}>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            {config.rule.task_objects.map(config => (
              <TaskObject {...config} fieldSide={fieldSide}/>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12} lg={4}>
          <ScoreBoard focusedFieldSide={fieldSide}/>
        </Grid>
      </Grid>
    </Dashboard>
  );
}
