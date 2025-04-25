import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import CachedIcon from '@mui/icons-material/Cached';
import {
  Box,
  Button,
  Grid2,
  IconButton,
  Paper,
  type SxProps,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import type { Theme } from '@mui/system';
import { config } from '@rolimoa/common/config';
import type { RootState } from '@rolimoa/common/redux';
import type { FieldSideType, ScoreState } from '@rolimoa/common/redux';
import { resultRecordsStateSlice } from '@rolimoa/common/redux';
import { type MatchState, matchStateSlice } from '@rolimoa/common/redux';
import type { CurrentPhaseState } from '@rolimoa/common/redux';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ScoreBlock } from '~/components/ScoreBlock';
import { useDisplayScore } from '~/functional/useDisplayScore';
import { LyricalSocket } from '~/lyricalSocket';
import * as Phase from '~/util/PhaseStateUtil';

const thStyle: SxProps<Theme> = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: (theme) => theme.palette.text.secondary,
  userSelect: 'none',
  width: '80%',
};

const ScoreDetailTable = (props: {
  fieldSide: FieldSideType;
}) => {
  const { fieldSide } = props;
  const { value: scoreValue, scoreState } = useDisplayScore(fieldSide);
  const taskObjects = scoreState.tasks;

  return (
    <>
      <Table sx={{ tableLayout: 'fixed', marginBottom: '3rem' }} size="small">
        <TableBody>
          {config.rule.task_objects.map((config) => (
            <TableRow key={config.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" sx={{ ...thStyle }}>
                {config.description}
              </TableCell>
              <TableCell align="right">{taskObjects[config.id]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table sx={{ tableLayout: 'fixed' }} size="small">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row" sx={{ ...thStyle }}>
              点数
            </TableCell>
            <TableCell align="right">{scoreValue}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" sx={{ ...thStyle }}>
              Vゴールタイム (s)
            </TableCell>
            <TableCell align="right">{scoreState.vgoal ?? '-'}</TableCell>
          </TableRow>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row" sx={{ ...thStyle }}>
              勝利フラグ
            </TableCell>
            <TableCell align="right">{scoreState.winner ? '⭕' : '❌'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

const ResultConfirm = () => {
  const dispatch = useDispatch();
  const match = useSelector<RootState, MatchState>((state) => state.match);
  const score = useSelector<RootState, ScoreState>((state) => state.score);
  const currentPhase = useSelector<RootState, CurrentPhaseState>((state) => state.phase.current);
  const { value: blueScoreValue } = useDisplayScore('blue');
  const { value: redScoreValue } = useDisplayScore('red');
  const isLastPhase = Phase.isLast(currentPhase.id);

  const [comment, setComment] = useState<string>('');
  const onCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value);

  const isConfirmable = isLastPhase && !match.isConfirmed && currentPhase.id !== 'default';

  const onConfirmButtonClick = useCallback(() => {
    const confirmedAt = Number(new Date());
    const confirmedBy = 'not implemented';

    const matchAction = matchStateSlice.actions.setConfirmed(true);
    const resultRecordAction = resultRecordsStateSlice.actions.addResult({
      match,
      finalScore: score,
      confirmedScore: {
        blue: blueScoreValue, // 現在は確定スコアの編集機能がないため
        red: redScoreValue, // 最終スコアと同じ値になる
      },
      comment,
      confirmedAt,
      confirmedBy,
    });

    LyricalSocket.dispatch([matchAction, resultRecordAction], dispatch);
  }, [match, score, blueScoreValue, redScoreValue, comment, dispatch]);

  return (
    <Box>
      <Table sx={{ marginBottom: '3rem' }} size="small">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              現在フェーズ
            </TableCell>
            <TableCell align="right">{currentPhase.id}</TableCell>
          </TableRow>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              確定済み？
            </TableCell>
            <TableCell align="right">{match.isConfirmed ? '⭕' : '❌'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <TextField
        label="コメント [optional]"
        multiline
        fullWidth
        rows={4}
        onChange={onCommentChange}
        value={comment}
        sx={{ marginBottom: '1rem' }}
        disabled={match.isConfirmed}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onConfirmButtonClick}
        disabled={!isConfirmable}
      >
        {isLastPhase ? '試合結果を確定' : '競技が進行中です'} <AssignmentTurnedInIcon />
      </Button>
    </Box>
  );
};

export const MatchResultContainer = () => {
  const match = useSelector<RootState, MatchState>((state) => state.match);

  const [isReverse, setIsReverse] = useState(false);
  const onReverseClick = () => setIsReverse((toggle) => !toggle);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        現在の試合：{match.name}
      </Typography>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12, lg: 8 }}>
          <Grid2 container spacing={6}>
            {/* スコア */}
            <Grid2
              size={12}
              container
              justifyContent="space-between"
              alignItems="center"
              direction={isReverse ? 'row-reverse' : 'row'}
            >
              <Grid2 size={5}>
                <ScoreBlock fieldSide="blue" teamNameVariant="subtitle1" />
                <ScoreDetailTable fieldSide="blue" />
              </Grid2>
              <Grid2 size={2} textAlign="center">
                <IconButton
                  aria-label="delete"
                  color="default"
                  onClick={onReverseClick}
                  size="large"
                >
                  <CachedIcon />
                </IconButton>
              </Grid2>
              <Grid2 size={5}>
                <ScoreBlock fieldSide="red" teamNameVariant="subtitle1" />
                <ScoreDetailTable fieldSide="red" />
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>
        <Grid2 size={{ xs: 12, lg: 4 }}>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'end',
              paddingLeft: '1rem',
            }}
          >
            <ResultConfirm />
          </Box>
        </Grid2>
      </Grid2>
    </Paper>
  );
};
