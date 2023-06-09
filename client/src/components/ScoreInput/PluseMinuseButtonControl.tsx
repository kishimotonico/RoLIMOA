import React, { FC, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ButtonGroup, Box, Grid, Paper, Typography } from '@mui/material';
import { SxProps } from '@mui/material/styles'
import { LyricalSocket } from 'lyricalSocket';
import { RootState } from 'slices';
import { scoreStateSlice, ObjectsStateType } from 'slices/score';
import { TaskObjectConfigType } from 'config/types';

interface PluseMinuseButtonControlProps {
  fieldSide: "blue" | "red";
  config: TaskObjectConfigType;
}

export const PluseMinuseButtonControl: FC<PluseMinuseButtonControlProps> = ({
  fieldSide,
  config,
}) => {
  const taskObjects = useSelector<RootState, ObjectsStateType>((state) => state.score.fields[fieldSide].tasks);
  const dispatch = useDispatch();
  
  const { id, description, min = 0, max = 524 } = config;
  const currentValue = taskObjects[id];

  if (currentValue === undefined) {
    console.error("ふぇぇ！", taskObjects, id);
  }

  const decrement = useCallback(() => {
    const nextValue = currentValue - 1;
    const action = scoreStateSlice.actions.setTaskUpdate({
      fieldSide,
      taskObjectId: id,
      afterValue: nextValue,
    });
    LyricalSocket.dispatch(action, dispatch);
  }, [dispatch, fieldSide, id, currentValue]);

  const increment = useCallback(() => {
    const nextValue = currentValue + 1;
    const action = scoreStateSlice.actions.setTaskUpdate({
      fieldSide,
      taskObjectId: id,
      afterValue: nextValue,
    });
    LyricalSocket.dispatch(action, dispatch);
  }, [dispatch, fieldSide, id, currentValue]);

  // styles
  const color = fieldSide === "blue" ? "primary" : "secondary";
  const buttonGroupSx: SxProps = {
    width: '100%',
    display: 'inline-flex',
    flexDirection: 'row',
    verticalAlign: 'baseline',
    padding: '0 .25em 0 0',
  };
  const innnerButtonSx = {
    width: '50%',
  };

  return (
    <Grid item xs={12} sm={6}>
      <Paper sx={{ p: '1em', userSelect: "none" }}>
        <Typography component="h2" variant="h6" gutterBottom>
          {description}
        </Typography>
        <Typography component="p" variant="h5" >
          {currentValue}
        </Typography>

        <Box sx={{ pt: 0.5 }}>
          <ButtonGroup sx={buttonGroupSx} color={color}>
            <Button sx={innnerButtonSx} variant="outlined" onClick={decrement} disabled={currentValue === min}>
              -1
            </Button>
            <Button sx={innnerButtonSx} variant="contained" onClick={increment} disabled={currentValue === max}>
              +1
            </Button>
          </ButtonGroup>
        </Box>
      </Paper>
    </Grid>
  );
};
