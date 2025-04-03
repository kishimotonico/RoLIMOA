import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import { CenterFlex } from '@/ui/CenterFlex';
import { SlideTransition } from '@/ui/SlideTransition';
import { RootState } from '@/slices';
import { FieldSideType } from '@/slices/score';
import { useDisplayScore } from '@/functional/useDisplayScore';
import { formatTime } from '@/util/formatTime';
import { config } from '@/config/load';
import { TimerDisplay } from '../TimerDisplay';

const ScoreBlock = (props: {
  fieldSide: FieldSideType,
  placement: "left" | "right",
}) => {
  const { fieldSide, placement } = props;
  const teamName = useSelector<RootState, string | undefined>((state) => state.match.teams[fieldSide]?.shortName);
  const displayScore = useDisplayScore(fieldSide);

  const color = fieldSide as string; // "blue" | "red"をそのまま文字列として使う

  const containerHeight = 260;
  const outlineBorderWidth = 8;
  const innerBorderWidth = 6;
  const nameBlockHeight = 80;
  const scoreBlockHeight = containerHeight - nameBlockHeight - outlineBorderWidth * 2;

  let teamNameFontSize = 40;
  if (teamName && teamName?.length > 12) {
    teamNameFontSize = 36;
  }
  if (teamName && teamName?.length > 14) {
    teamNameFontSize = 30;
  }

  return (
    <Box>
      <Box sx={{
        width: '600px',
        height: `${containerHeight}px`,
        textAlign: 'center',
        border: `${outlineBorderWidth}px solid ${color}`,
        boxSizing: 'border-box',
        backgroundColor: 'rgba(240, 240, 240, 0.8)',
      }}>
        <CenterFlex sx={{
          height: `${nameBlockHeight}px`,
          lineHeight: `${nameBlockHeight}px`,
          borderBottom: `${innerBorderWidth}px solid ${color}`,
          boxSizing: 'border-box',
          fontSize: `${teamNameFontSize}px`,
        }}>
          {teamName ?? " "}
        </CenterFlex>
        <CenterFlex sx={{
          height: `${scoreBlockHeight}px`,
          fontSize: '100px',
          flexDirection: placement === "left" ? 'row' : 'row-reverse',
        }}>
          {displayScore.scoreState.vgoal && (
            <Box sx={{ fontSize: "40px" }}>
              <Box>
                {config.rule.vgoal.name}
              </Box>
              <Box sx={{
                mt: 0.5,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
                <TimerOutlinedIcon sx={{ mr: 1, pt: 0.5, fontSize: "120%", color: "rgba(80, 80, 80, 0.9)" }} />
                {formatTime(displayScore.scoreState.vgoal, "m:ss")}
              </Box>
            </Box>
          )}
          <Box sx={{ padding: "0 .5em", lineHeight: `${scoreBlockHeight}px`, }}>
            {displayScore.value}
          </Box>
        </CenterFlex>
      </Box>
      <Box sx={{
        display: "flex",
        width: "100%",
        justifyContent: placement === "left" ? "flex-start" : "flex-end",
      }}>
        {displayScore.scoreState.winner &&
          <CenterFlex sx={{
            width: '240px',
            height: '60px',
            backgroundColor: `${color}`,
            fontSize: "42px",
            color: "rgba(255, 255, 255, 0.95)",
          }}>
            Winner
          </CenterFlex>
        }
      </Box>
    </Box>
  );
};

export const MainHud = ({
  showScoreBoard,
  params,
}: {
  showScoreBoard: boolean,
  params: { reverse: boolean },
}) => {
  return (
    <Box sx={{
      width: '100%',
      height: '320px',
      display: 'flex',
    }}>
      <SlideTransition in={showScoreBoard} direction="left" duration={800} appear={false}>
        <Box>
          <ScoreBlock
            fieldSide={ params.reverse ? "blue" : "red" }
            placement="left"
          />
        </Box>
      </SlideTransition>
      <TimerDisplay />
      <SlideTransition in={showScoreBoard} direction="right" duration={800} appear={false}>
        <Box>
          <ScoreBlock
            fieldSide={ params.reverse ? "red" : "blue" }
            placement="right"
          />
        </Box>
      </SlideTransition>
    </Box>
  );
}
