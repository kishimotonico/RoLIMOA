import { FC, useCallback, useState, useEffect } from 'react';
import { Box, Button, Grid, IconButton, Paper, SxProps, Table, TableBody, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { Theme } from '@mui/system';
import CachedIcon from '@mui/icons-material/Cached';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { Dashboard } from '@/components/Dashboard';
import { ScoreBlock } from '@/components/ScoreBlock';
import { useDisplayScore } from '@/functional/useDisplayScore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/slices';
import { FieldSideType, ScoreState } from '@/slices/score';
import { resultRecordsStateSlice } from '@/slices/resultRecord';
import { MatchState, matchStateSlice } from '@/slices/match';
import { CurrentPhaseState } from '@/slices/phase';
import { LyricalSocket } from '@/lyricalSocket';
import { config } from '@/config/load';
import * as Phase from '@/util/PhaseStateUtil';

const thStyle: SxProps<Theme> = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  color: (theme) => theme.palette.text.secondary,
  userSelect: "none",
  width: "80%",
};

type ScoreDetailTableProps = {
  fieldSide: FieldSideType,
};

const ScoreDetailTable: FC<ScoreDetailTableProps> = ({
  fieldSide,
}) => {
  const { value: scoreValue, scoreState } = useDisplayScore(fieldSide);
  const taskObjects = scoreState.tasks;

  return (
    <>
      <Table sx={{ tableLayout: "fixed", marginBottom: "3rem" }} size="small">
        <TableBody>
          {config.rule.task_objects.map((config) => (
            <TableRow
              key={config.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" sx={{ ...thStyle }}>
                {config.description}
              </TableCell>
              <TableCell align="right">
                {taskObjects[config.id]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table sx={{ tableLayout: "fixed" }} size="small">
        <TableBody>
          <TableRow>
           <TableCell component="th" scope="row" sx={{ ...thStyle }}>
              点数
            </TableCell>
            <TableCell align="right">
              {scoreValue}
            </TableCell>
          </TableRow>
          <TableRow>
           <TableCell component="th" scope="row" sx={{ ...thStyle }}>
              Vゴールタイム (s)
            </TableCell>
            <TableCell align="right">
              {scoreState.vgoal ?? "-"}
            </TableCell>
          </TableRow>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
           <TableCell component="th" scope="row" sx={{ ...thStyle }}>
              勝利フラグ
            </TableCell>
            <TableCell align="right">
              {scoreState.winner ? "⭕" : "❌"}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
);
};

export const RefereePage: FC = () => {
  // TODO: 細かい処理もここに放り込んじゃったので、もうちょときれいにする
  const dispath = useDispatch();
  const match = useSelector<RootState, MatchState>((state) => state.match);
  const score = useSelector<RootState, ScoreState>((state) => state.score);
  const currentPhase = useSelector<RootState, CurrentPhaseState>((state) => state.phase.current);
  
  const { value: blueScoreValue } = useDisplayScore("blue");
  const { value: redScoreValue } = useDisplayScore("red");
  const matchName = match.name;
  const isLastPhase = Phase.isLast(currentPhase.id);

  const [comment, setComment] = useState<string>("");
  const onCommentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  }, []);

  const [isReverse, setIsReverse] = useState(false);
  const onReverseClick = useCallback(() => { setIsReverse(!isReverse) }, [isReverse]);

  const [isConfirmable, setIsConfirmable] = useState(isLastPhase && !match.isConfirmed && currentPhase.id !== "default");
  useEffect(() => {
    // TODO: useStateとuseEffectでやってるの頭悪い気がするので、もっとスマートにしたい
    setIsConfirmable(isLastPhase && !match.isConfirmed && currentPhase.id !== "default");
    console.debug("RefeePage@useEffect");
  }, [isLastPhase, match.isConfirmed, currentPhase.id]);
  
  const onConfirmButtonClick = useCallback(() => {
    setIsConfirmable(false);

    const confirmedAt = Number(new Date());
    const confirmedBy = "not implemented";

    const matchAction = matchStateSlice.actions.setConfirmed(true);
    const resultRecordAction = resultRecordsStateSlice.actions.addResult({
      match,
      finalScore: score,
      confirmedScore: {
        blue: blueScoreValue,   // 現在は確定スコアの編集機能がないため
        red: redScoreValue,     // 最終スコアと同じ値になる
      },
      comment,
      confirmedAt,
      confirmedBy,
    });

    LyricalSocket.dispatch([matchAction, resultRecordAction], dispath);
  }, [match, score, blueScoreValue, redScoreValue, comment, dispath]);

  return (
    <Dashboard title="主審入力">
      <Paper sx={{ padding: '1em' }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          現在の試合：{matchName}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Grid container spacing={6}>
              {/* スコア */}
              <Grid item xs={12} container justifyContent="space-between" alignItems="center" direction={isReverse ? "row-reverse" : "row"}>
                <Grid item xs={5}>
                  <ScoreBlock fieldSide="blue" teamNameVariant="subtitle1" />
                  <ScoreDetailTable fieldSide="blue" />
                </Grid>
                <Grid item xs={1} textAlign="center">
                  <IconButton aria-label="delete" color="default" onClick={onReverseClick} size="large">
                    <CachedIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={5}>
                  <ScoreBlock fieldSide="red" teamNameVariant="subtitle1" />
                  <ScoreDetailTable fieldSide="red" />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Box sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "end",
              paddingLeft: "1rem",
            }}>
              <Box>
                <Table sx={{ marginBottom: "3rem" }} size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">
                        現在フェーズ
                      </TableCell>
                      <TableCell align="right">
                        {currentPhase.id}
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        確定済み？
                      </TableCell>
                      <TableCell align="right">
                        {match.isConfirmed ? "⭕" : "❌"}
                      </TableCell>
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
                  sx={{ marginBottom: "1rem" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={onConfirmButtonClick}
                  disabled={!isConfirmable}
                  // disabled={match.isConfirmed || !isLastPhase || currentPhase.id === "default"}
                >
                  {isLastPhase ? "試合結果を確定" : "競技が進行中です"} <AssignmentTurnedInIcon />
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Dashboard>
  );
}
