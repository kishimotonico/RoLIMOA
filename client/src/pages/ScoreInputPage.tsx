import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, Fab, FormControlLabel, FormGroup, Grid, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { RootState } from 'slices';
import { FieldSideType, scoreStateSlice, ScoreStateType } from 'slices/score';
import { Dashboard } from 'components/Dashboard';
import { TaskObject } from 'components/TaskObjectContainer';
import { ScoreInputVgloaButton } from 'components/ScoreInputVgoalButton';
import { LyricalSocket } from 'lyricalSocket';
import config from 'config.json';
import { ScoreBlock } from 'components/ScoreBlock';
import { useDisplayScore } from 'functional/useDisplayScore';

type FlagInputProps = {
  fieldSide: FieldSideType,
  color: "primary" | "secondary",
};

const FlagInput: FC<FlagInputProps> = ({ fieldSide, color }) => {
  const dispatch = useDispatch();
  const scoreState = useSelector<RootState, ScoreStateType>((state) => state.score[fieldSide]);
  
  const onEnableButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    LyricalSocket.dispatch(scoreStateSlice.actions.setScoreEnable({
      fieldSide,
      enable: event.target.checked,
    }), dispatch);
  };

  const onWinnerButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    LyricalSocket.dispatch(scoreStateSlice.actions.setWinnerFlag({
      fieldSide,
      winner: event.target.checked,
    }), dispatch);
  };

  return (
    <Paper sx={{ padding: "1em" }}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={scoreState.enable} onChange={onEnableButton} color={color} />
          }
          label="スコア有効"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch checked={scoreState.winner} onChange={onWinnerButton} color={color} />
          }
          label="勝利フラグ"
        />
      </FormGroup>
    </Paper>
  );
};

type ScoreDisplayProps = {
  fieldSide: FieldSideType,
};

const ScoreDisplay: FC<ScoreDisplayProps> = ({ fieldSide }) => {
  const { refs } = useDisplayScore(fieldSide);
  const refValues = Object.entries(refs ?? {});

  return (
    <Paper sx={{ padding: "1em" }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ScoreBlock fieldSide={fieldSide} />
        </Grid>
        {refValues.length > 0 &&
          <Grid item xs={12}>
            <TableContainer>
              <Table size="small">
                <TableBody>
                  {refValues.map(([k, v]) => (
                    <TableRow key={k}>
                      <TableCell>{k}</TableCell>
                      <TableCell>{v}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        }
      </Grid>
    </Paper>
  );
};

type ScoreInputPageProps = {
  fieldSide: FieldSideType,
};

export const ScoreInputPage: FC<ScoreInputPageProps> = ({ fieldSide }) => {
  const isScoreEnable = useSelector<RootState, boolean>((state) => state.score[fieldSide].enable);
  const dispatch = useDispatch();

  const onEnableButton = useCallback(() => {
    const action = scoreStateSlice.actions.setScoreEnable({
      fieldSide,
      enable: true,
    });
    LyricalSocket.dispatch(action, dispatch);
  }, [dispatch, fieldSide]);

  const kanji = {blue: "青", red: "赤"}[fieldSide];
  const color = fieldSide === "blue" ? "primary" : "secondary";

  return (
    <Dashboard title={`${kanji}チーム得点入力`}>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Grid container spacing={2}>
            {
              config.rule.task_objects.map(config => (
                <TaskObject
                  key={config.id}
                  fieldSide={fieldSide}
                  {...config}
                />
              ))
            }
            <Grid item xs={12}>
              <ScoreInputVgloaButton fieldSide={fieldSide} color={color} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FlagInput fieldSide={fieldSide} color={color} />
            </Grid>
            <Grid item xs={12}>
              <ScoreDisplay fieldSide={fieldSide} />
            </Grid>
          </Grid>
        </Grid>

        <Backdrop open={!isScoreEnable}>
          <Fab color="default" variant="extended" onClick={onEnableButton}>
            <CheckIcon />
            スコアを有効化
          </Fab>
        </Backdrop>
      </Grid>
    </Dashboard>
  );
}
