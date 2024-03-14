import { FC, useState } from 'react';
import { FieldSideType, ObjectsStateType, scoreStateSlice } from '@/slices/score';
import { Box, Button, Grid, Modal, Paper, Stack, SxProps, Typography } from '@mui/material';
import { CustomToggleButton } from './CustomToggleButton';
import { RootState } from '@/slices';
import { useDispatch, useSelector } from 'react-redux';
import { LyricalSocket } from '@/lyricalSocket';
import { CustomSwitchButton } from './CustomSwitchButton';
import { CustomPluseMinuseButton } from './CustomPluseMinuseButton';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';

const ShopAreaControl = (props: { sx?: SxProps, spacing?: number | string  }) => {
  const globalObj = useSelector<RootState, ObjectsStateType>((state) => state.score.global);
  const dispatch = useDispatch();

  const globalUpdate = (id: string) => ((value: number) => {
    const action = scoreStateSlice.actions.setGloablUpdate({
      taskObjectId: id,
      afterValue: value,
    });
    LyricalSocket.dispatch(action, dispatch);
  });

  return (
    <Paper sx={{ p: 2.4, userSelect: "none", ...props.sx }}>
      <Stack spacing={props.spacing ?? 2} sx={{ alignItems: 'center' }}>
        <Typography variant='h6'>売店エリア</Typography>
        <CustomToggleButton label='1' value={globalObj['shop_1']} onChange={globalUpdate('shop_1')} />
        <CustomToggleButton label='2' value={globalObj['shop_2']} onChange={globalUpdate('shop_2')} />
        <CustomToggleButton label='3' value={globalObj['shop_3']} onChange={globalUpdate('shop_3')} />
        <CustomToggleButton label='4' value={globalObj['shop_4']} onChange={globalUpdate('shop_4')} />
        <CustomToggleButton label='5' value={globalObj['shop_5']} onChange={globalUpdate('shop_5')} />
        <CustomToggleButton label='6' value={globalObj['shop_6']} onChange={globalUpdate('shop_6')} />
        <CustomToggleButton label='7' value={globalObj['shop_7']} onChange={globalUpdate('shop_7')} />
        <CustomToggleButton label='8' value={globalObj['shop_8']} onChange={globalUpdate('shop_8')} />
      </Stack>
    </Paper>
  );
};

type CustomScoreInputProps = {
  fieldSide: FieldSideType,
};

export const CustomScoreInput: FC<CustomScoreInputProps> = ({
  fieldSide,
}) => {
  const taskObj = useSelector<RootState, ObjectsStateType>((state) => state.score.fields[fieldSide].tasks);
  const dispatch = useDispatch();

  const [isOpenShopAreaModal, setIsOpenShopAreaModal] = useState(false);

  const taskUpdate = (id: string) => ((value: number) => {
    const actions = [scoreStateSlice.actions.setTaskUpdate({
      fieldSide,
      taskObjectId: id,
      afterValue: value,
    })];

    // XXX: 条件を満たしたとき「H.雛壇完成」を自動で達成する雑な実装
    if (id === 'rule_E' || id === 'rule_F' || id === 'rule_G') {
      const rule_E = id === 'rule_E' ? value : taskObj['rule_E'];
      const rule_F = id === 'rule_F' ? value : taskObj['rule_F'];
      const rule_G = id === 'rule_G' ? value : taskObj['rule_G'];

      actions.push(scoreStateSlice.actions.setTaskUpdate({
        fieldSide,
        taskObjectId: 'rule_H',
        afterValue: (rule_E === 1 && rule_F === 2 && rule_G === 3) ? 1 : 0,
      }));
    }

    LyricalSocket.dispatch(actions, dispatch);
  });

  const color = fieldSide === 'blue' ? 'primary' : 'secondary';

  return <>
    <Grid item xs={12} sx={{ display: { xs: 'flex', sm: 'none' } }}>
      <Button onClick={() => setIsOpenShopAreaModal(true)} variant='outlined' color={color} fullWidth>
        売店エリア <OpenInBrowserIcon />
      </Button>
      <Modal open={isOpenShopAreaModal} onClose={() => setIsOpenShopAreaModal(false)}>
        <Box sx={{
          width: '60%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'absolute',
        }}>
          <ShopAreaControl sx={{ p: 2 }} spacing={1} />
        </Box>
      </Modal>
    </Grid>
    <Grid item md={9} sm={8} xs={12}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <CustomSwitchButton label='A. 台座に接触' value={taskObj['rule_A']} onChange={taskUpdate('rule_A')} color={color} />
        </Grid>
        <Grid item xs={12}>
          <CustomPluseMinuseButton label='B. 雛人形が接地' value={taskObj['rule_B']} onChange={taskUpdate('rule_B')} color={color} max={5}/>
        </Grid>
        <Grid item xs={12}>
          <CustomSwitchButton label='C. 大台座が接地' value={taskObj['rule_C']} onChange={taskUpdate('rule_C')} color={color} />
        </Grid>
        <Grid item xs={12}>
          <CustomSwitchButton label='D. 小台座が接地' value={taskObj['rule_D']} onChange={taskUpdate('rule_D')} color={color} />
        </Grid>
        <Grid item xs={12}>
          <CustomSwitchButton label='E. 台座完成' value={taskObj['rule_E']} onChange={taskUpdate('rule_E')} color={color} />
        </Grid>
        <Grid item xs={12}>
          <CustomPluseMinuseButton label='F. 内裏雛を配置' value={taskObj['rule_F']} onChange={taskUpdate('rule_F')} color={color} max={2} />
        </Grid>
        <Grid item xs={12}>
          <CustomPluseMinuseButton label='G. 三人官女を配置' value={taskObj['rule_G']} onChange={taskUpdate('rule_G')} color={color} max={3} />
        </Grid>
        <Grid item xs={12}>
          <CustomSwitchButton label='H. 雛壇完成' value={taskObj['rule_H']} onChange={taskUpdate('rule_H')} color={color} isAuto />
        </Grid>
      </Grid>
    </Grid>
    <Grid item md={3} sm={4} xs={0} sx={{ display: { xs: 'none', sm: 'flex' } }}>
      <ShopAreaControl />
    </Grid>
  </>;
};

