import { FC } from 'react';
import { FieldSideType, scoreStateSlice } from '@/slices/score';
import { Grid, Paper, Stack, Typography } from '@mui/material';
import { CustomToggleButton } from './CustomToggleButton';
import { RootState } from '@/slices';
import { useDispatch, useSelector } from 'react-redux';
import { LyricalSocket } from '@/lyricalSocket';
import { CustomSwitchButton } from './CustomSwitchButton';
import { CustomPluseMinuseButton } from './CustomPluseMinuseButton';


type CustomScoreInputProps = {
  fieldSide: FieldSideType,
};

export const CustomScoreInput: FC<CustomScoreInputProps> = ({
  fieldSide,
}) => {
  const globalObj = useSelector<RootState, Record<string, number>>((state) => state.score.global);
  const taskObj = useSelector<RootState, Record<string, number>>((state) => state.score.fields[fieldSide].tasks);
  const dispatch = useDispatch();
  const update = (id: string) => ((value: number) => {
    const props = {
      taskObjectId: id,
      afterValue: value,
    };
    const action = id.startsWith('shop') // XXX: 使い捨てコードなので雑に分岐
            ? scoreStateSlice.actions.setGloablUpdate(props)
            : scoreStateSlice.actions.setTaskUpdate({ fieldSide, ...props });

    LyricalSocket.dispatch(action, dispatch);
  });

  const color = fieldSide === 'blue' ? 'primary' : 'secondary';

  return <>
    <Grid item md={3} xs={6}>
      <Paper sx={{ p: 2, userSelect: "none" }}>
        <Stack spacing={1} sx={{ alignItems: 'center' }}>
          <Typography variant='h6'>売店エリア</Typography>
          <CustomToggleButton label='1' value={globalObj['shop_1']} onChange={update('shop_1')} />
          <CustomToggleButton label='2' value={globalObj['shop_2']} onChange={update('shop_2')} />
          <CustomToggleButton label='3' value={globalObj['shop_3']} onChange={update('shop_3')} />
          <CustomToggleButton label='4' value={globalObj['shop_4']} onChange={update('shop_4')} />
          <CustomToggleButton label='5' value={globalObj['shop_5']} onChange={update('shop_5')} />
          <CustomToggleButton label='6' value={globalObj['shop_6']} onChange={update('shop_6')} />
          <CustomToggleButton label='7' value={globalObj['shop_7']} onChange={update('shop_7')} />
          <CustomToggleButton label='8' value={globalObj['shop_8']} onChange={update('shop_8')} />
        </Stack>
      </Paper>
    </Grid>
    <Grid item md={9} xs={6}>
      <Stack spacing={1} >
        <CustomSwitchButton label='A. 台座に接触' value={taskObj['rule_A']} onChange={update('rule_A')} color={color} />
        <CustomPluseMinuseButton label='B. 雛人形が接地' value={taskObj['rule_B']} onChange={update('rule_B')} color={color} max={5}/>
        <CustomSwitchButton label='C. 大台座が接地' value={taskObj['rule_C']} onChange={update('rule_C')} color={color} />
        <CustomSwitchButton label='D. 小台座が接地' value={taskObj['rule_D']} onChange={update('rule_D')} color={color} />
        <CustomSwitchButton label='E. 台座完成' value={taskObj['rule_E']} onChange={update('rule_E')} color={color} />
        <CustomPluseMinuseButton label='F. 内裏雛を配置' value={taskObj['rule_F']} onChange={update('rule_F')} color={color} max={2} />
        <CustomPluseMinuseButton label='G. 三人官女を配置' value={taskObj['rule_G']} onChange={update('rule_G')} color={color} max={3} />
      </Stack>
    </Grid>
  </>;
};

