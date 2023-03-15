import { FC, useRef, Ref } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { FieldSideType } from 'slices/score';
import { Box, Divider, Slide } from '@mui/material';
import { useDisplayScore } from 'functional/useDisplayScore';
import { useDisplayTimer } from 'functional/useDisplayTimer';
import { useSearchParams } from 'react-router-dom';
import { CenterFlex } from 'ui/CenterFlex';
import config from 'config.json';

const secToTime = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

type ScoreBlockProps = {
  fieldSide: FieldSideType,
  placement: "left" | "right",
};

const ScoreBlock: FC<ScoreBlockProps> = ({
  fieldSide,
  placement,
}) => {
  const teamName = useSelector<RootState, string | undefined>((state) => state.match.teams[fieldSide]?.shortName);
  const displayScore = useDisplayScore(fieldSide);

  const color = fieldSide as string; // "blue" | "red"をそのまま文字列として使う

  const containerHeight = 260;
  const outlineBorderWidth = 8;
  const innerBorderWidth = 6;
  const nameBlockHeight = 80;
  const scoreBlockHeight = 16 + containerHeight - nameBlockHeight - outlineBorderWidth * 2 - innerBorderWidth; // 文字を下に下げるため微調整

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
              <Box>
                🏴 {secToTime(displayScore.scoreState.vgoal)}
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

const TimerDisplay: FC<{ ref?: Ref<null> }> = ({ ref }) => {
  const { description, displayTime } = useDisplayTimer();
  const matchName = useSelector<RootState, string>((state) => state.match.name);

  return <>
    <Box ref={ref} sx={{
      width: '400px',
      height: '260px',
      textAlign: 'center',
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      boxSizing: 'border-box',
      color: 'rgba(240, 240, 240, 0.95)',
    }}>
      <Box sx={{
        height: '70px',
        lineHeight: '70px',
        fontSize: '24px',
        display: 'flex',
        justifyContent: 'center',
      }}>
        {description}
      </Box>
      <Box sx={{
        fontFamily: "DSEG14-Classic",
        fontWeight: 500,
        height: '120px',
        lineHeight: '120px',
        fontSize: '72px',
      }}>
        {displayTime}
      </Box>
      <Divider sx={{
        margin: '0 30px',
        borderColor: 'rgba(240, 240, 240, 0.5)',
      }}/>
      <Box sx={{
        height: '69px',
        lineHeight: '69px',
        fontSize: '24px',
      }}>
        {matchName ?? ""}
      </Box>
    </Box>
  </>;
};

export type StreamingOverlayPageParams = {
  reverse: boolean,
};

export const StreamingOverlayPage: FC = () => {
  const [searchParams] = useSearchParams();
  const params: StreamingOverlayPageParams = {
    reverse: searchParams.get("reverse") !== null,
  };

  const showMainHud = useSelector<RootState, boolean>((state) => state.streamingInterface.showMainHud);
  
  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '1600px',
      height: '900px',
      backgroundColor: 'rgba(255, 255, 255, 0)',
    }}>
      <Slide in={showMainHud} direction="down" timeout={1000} >
        <Box sx={{
          width: '100%',
          height: '260px',
          display: 'flex',
        }}>
          <ScoreBlock
            fieldSide={ params.reverse ? "blue" : "red" }
            placement="left"
          />
          <TimerDisplay />
          <ScoreBlock
            fieldSide={ params.reverse ? "red" : "blue" }
            placement="right"
          />
        </Box>
      </Slide>
    </Box>
  );
}
