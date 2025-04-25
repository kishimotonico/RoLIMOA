import { Dashboard } from '@/components/Dashboard';
import { ScoreBlock } from '@/components/ScoreBlock';
import { ScoreInputPanel } from '@/components/ScoreInput/ScoreInputPanel';
import { ScoreInputVgoalButton } from '@/components/ScoreInputVgoalButton';
import { useDisplayScore } from '@/functional/useDisplayScore';
import { LyricalSocket } from '@/lyricalSocket';
import { formatTime, parseFormatTime } from '@/util/formatTime';
import CheckIcon from '@mui/icons-material/Check';
import FlagIcon from '@mui/icons-material/Flag';
import {
  Backdrop,
  Box,
  Divider,
  Fab,
  FormControlLabel,
  FormGroup,
  Grid2,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import { config } from '@rolimoa/common/config';
import type { RootState } from '@rolimoa/common/redux';
import {
  type FieldScoreStateType,
  type FieldSideType,
  scoreStateSlice,
} from '@rolimoa/common/redux';
import { type FC, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type VGoalTimeInputProps = {
  onInputValidVgoalTime: (vgoalTime: number) => void;
  vgoalTime?: number;
};

const VGoalTimeInput: FC<VGoalTimeInputProps> = ({ onInputValidVgoalTime, vgoalTime }) => {
  const initialValue = vgoalTime ? formatTime(vgoalTime, 'm:ss') : '';
  const [value, setValue] = useState(initialValue);
  const [invalid, setInvalid] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value.trim());
  };

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    if (value === '') {
      setValue(initialValue);
      setInvalid(false);
      return;
    }

    const newVgoalTime = parseFormatTime(value);
    if (Number.isNaN(newVgoalTime)) {
      setInvalid(true);
      return;
    }
    // 正常値の場合、Vゴールタイムを親コンポーネントで更新
    onInputValidVgoalTime(newVgoalTime);
  };

  return (
    <Tooltip title="Vゴールタイムを変更" arrow>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <FlagIcon sx={{ width: '2rem' }} />
        <TextField
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={!vgoalTime}
          error={invalid}
          placeholder="Vゴールタイム"
          variant="outlined"
          size="small"
          sx={{ ml: 1 }}
        />
      </Box>
    </Tooltip>
  );
};

type FlagInputProps = {
  fieldSide: FieldSideType;
  color: 'primary' | 'secondary';
};

const FlagInput: FC<FlagInputProps> = ({ fieldSide, color }) => {
  const dispatch = useDispatch();
  const scoreState = useSelector<RootState, FieldScoreStateType>(
    (state) => state.score.fields[fieldSide],
  );

  const onEnableButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    LyricalSocket.dispatch(
      scoreStateSlice.actions.setScoreEnable({
        fieldSide,
        enable: event.target.checked,
      }),
      dispatch,
    );
  };

  const onWinnerButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    LyricalSocket.dispatch(
      scoreStateSlice.actions.setWinnerFlag({
        fieldSide,
        winner: event.target.checked,
      }),
      dispatch,
    );
  };

  const onVgoalTimeChange = (vgoalTime: number) => {
    LyricalSocket.dispatch(
      scoreStateSlice.actions.setVgoalTime({
        fieldSide,
        vgoalTime,
      }),
      dispatch,
    );
  };

  return (
    <>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={scoreState.enable} onChange={onEnableButton} color={color} />}
          label="スコア有効"
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          control={<Switch checked={scoreState.winner} onChange={onWinnerButton} color={color} />}
          label="勝利フラグ"
        />
      </FormGroup>
      {config.rule.vgoal.condition.type !== 'disabled' && (
        <FormGroup sx={{ mt: 1 }}>
          <VGoalTimeInput
            onInputValidVgoalTime={onVgoalTimeChange}
            vgoalTime={scoreState.vgoal}
            key={scoreState.vgoal} // Vゴールタイム変更時に再レンダリング
          />
        </FormGroup>
      )}
    </>
  );
};

type ScoreDisplayProps = {
  fieldSide: FieldSideType;
};

const ScoreDisplay: FC<ScoreDisplayProps> = ({ fieldSide }) => {
  const { refs } = useDisplayScore(fieldSide);
  const refValues = Object.entries(refs ?? {});

  return (
    <Grid2 container spacing={3}>
      <Grid2 size={12}>
        <ScoreBlock fieldSide={fieldSide} />
      </Grid2>
      {refValues.length > 0 && (
        <Grid2 size={12}>
          <TableContainer>
            <Table size="small">
              <TableBody>
                {refValues.map(([k, v]) => (
                  <TableRow key={k} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                    <TableCell>{k}</TableCell>
                    <TableCell>{v}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid2>
      )}
    </Grid2>
  );
};

type ScoreInputPageProps = {
  fieldSide: FieldSideType;
};

export const ScoreInputPage: FC<ScoreInputPageProps> = ({ fieldSide }) => {
  const isScoreEnable = useSelector<RootState, boolean>(
    (state) => state.score.fields[fieldSide].enable,
  );
  const dispatch = useDispatch();

  const onEnableButton = useCallback(() => {
    const action = scoreStateSlice.actions.setScoreEnable({
      fieldSide,
      enable: true,
    });
    LyricalSocket.dispatch(action, dispatch);
  }, [dispatch, fieldSide]);

  const kanji = { blue: '青', red: '赤' }[fieldSide];
  const color = fieldSide === 'blue' ? 'primary' : 'secondary';

  return (
    <Dashboard title={`${kanji}チーム得点入力`}>
      <Grid2 container spacing={2}>
        <Grid2
          size={{
            xs: 12,
            lg: 8,
          }}
        >
          <Grid2 container spacing={1}>
            <ScoreInputPanel fieldSide={fieldSide} />
          </Grid2>
        </Grid2>

        <Grid2
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <Paper sx={{ p: 2 }}>
            <Box sx={{ mb: 2 }}>
              <ScoreDisplay fieldSide={fieldSide} />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ my: 2 }}>
              <FlagInput fieldSide={fieldSide} color={color} />
            </Box>
            <Box>
              <ScoreInputVgoalButton fieldSide={fieldSide} color={color} />
            </Box>
          </Paper>
        </Grid2>

        <Backdrop open={!isScoreEnable}>
          <Fab color="default" variant="extended" onClick={onEnableButton}>
            <CheckIcon />
            スコアを有効化
          </Fab>
        </Backdrop>
      </Grid2>
    </Dashboard>
  );
};
