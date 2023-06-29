import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid } from '@mui/material';
import { RootState } from '@/slices';
import { scoreStateSlice } from '@/slices/score';
import { config } from '@/config/load';
import { TaskObjectToggleButtonUiType } from '@/config/types';
import { LyricalSocket } from '@/lyricalSocket';
import { ToggleButtonControl } from './ToggleButtonControl';

const PoleInput = ({ id }: { id: string }) => {
  const currentValue = useSelector<RootState, number|undefined>((state) => state.score.global[id]);
  const dispatch = useDispatch();

  const stateUpdate = useCallback((value: number) => {
    const action = scoreStateSlice.actions.setGloablUpdate({
      taskObjectId: id,
      afterValue: value,
    });
    LyricalSocket.dispatch(action, dispatch);
  }, [dispatch, id]);

  if (config.rule.control_panel.type !== "custom") {
    return <></>;
  }
  const controlConfig = config.rule.control_panel.panels?.find(panel => panel.id === `@global/${id}`);
  const taskConfig = config.rule.global_objects.find(global => global.id === id);

  return (
    <ToggleButtonControl
      controlConfig={controlConfig as TaskObjectToggleButtonUiType }
      currentValue={currentValue ?? NaN}
      stateUpdate={stateUpdate}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      taskConfig={taskConfig!}
    />
  );
};

export const NHK2023CustomControlPanel = () => {

  const barSx = {
    height: "670px",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    writingMode: "vertical-rl", 
  };
  const boxSx = {
    height: "680px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  };
  
  return <>
    <Grid item xs={12} sm={1}>
      <Box sx={boxSx}>
        <Box sx={{ ...barSx, backgroundColor: "rgba(255,0,0,0.3)" }}>
          赤コート
        </Box>
      </Box>
    </Grid>
    <Grid item xs={12} sm={2} spacing={1}>
      <Box sx={boxSx}>
        <PoleInput id="P01" />
        <PoleInput id="P02" />
        <PoleInput id="P03" />
      </Box>
    </Grid>
    <Grid item xs={12} sm={2} spacing={1} sx={{ height: "680px%" }}>
      <Box sx={boxSx}>
        <PoleInput id="P04" />
        <PoleInput id="P05" />
      </Box>
    </Grid>
    <Grid item xs={12} sm={2}>
      <Box sx={boxSx}>
        <PoleInput id="P06" />
      </Box>
    </Grid>
    <Grid item xs={12} sm={2}>
      <Box sx={boxSx}>
        <PoleInput id="P07" />
        <PoleInput id="P08" />
      </Box>
    </Grid>
    <Grid item xs={12} sm={2}>
      <Box sx={boxSx}>
        <PoleInput id="P09" />
        <PoleInput id="P10" />
        <PoleInput id="P11" />
      </Box>
    </Grid>
    <Grid item xs={12} sm={1}>
      <Box sx={boxSx}>
        <Box sx={{ ...barSx, backgroundColor: "rgba(0,0,255,0.3)" }}>
          青コート
        </Box>
      </Box>
    </Grid>
  </>;
};
