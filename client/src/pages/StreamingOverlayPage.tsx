import { FC, Ref } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/slices';
import { FieldSideType, ObjectsStateType } from '@/slices/score';
import { Avatar, Box, Divider, Slide } from '@mui/material';
import { useDisplayScore } from '@/functional/useDisplayScore';
import { useDisplayTimer } from '@/functional/useDisplayTimer';
import { useSearchParams } from 'react-router-dom';
import { CenterFlex } from '@/ui/CenterFlex';
import { formatTime } from '@/util/formatTime';
import { config } from '@/config/load';
import { SlideTransition } from '@/ui/SlideTransition';

// とりあえず作りたいだけなので、強引な実装で解決
const ScoreDisplay = () => {
  const globalObjects = useSelector<RootState, ObjectsStateType>((state) => state.score.global);

  const Pole = ({ label , stat }: { label :number, stat: number }) => (
    <Avatar sx={{
      bgcolor: stat === 1 ? "blue" : stat === 2 ? "red" : "white",
      color: stat === 0 ? "black" : "white",
      width: "50px",
      height: "50px",
      margin: "8px auto",
      fontSize: "30px",
    }}>
      {label}
    </Avatar>
  );

  return (
    <Box sx={{
      width: "350px",
      height: "180px",
      backgroundColor: "#c0c0c0",
      display: "flex",
      padding: "10px 25px",
    }}>
      <CenterFlex sx={{ width: "70px" }}>
        <Pole label={1} stat={globalObjects["P01"]} />
        <Pole label={2} stat={globalObjects["P02"]} />
        <Pole label={3} stat={globalObjects["P03"]} />
      </CenterFlex>
      <CenterFlex sx={{ width: "70px" }}>
        <Pole label={4} stat={globalObjects["P04"]} />
        <Pole label={5} stat={globalObjects["P05"]} />
      </CenterFlex>
      <CenterFlex sx={{ width: "70px" }}>
        <Pole label={6} stat={globalObjects["P06"]} />
      </CenterFlex>
      <CenterFlex sx={{ width: "70px" }}>
        <Pole label={7} stat={globalObjects["P07"]} />
        <Pole label={8} stat={globalObjects["P08"]} />
      </CenterFlex>
      <CenterFlex sx={{ width: "70px" }}>
        <Pole label={9} stat={globalObjects["P09"]} />
        <Pole label={10} stat={globalObjects["P10"]} />
        <Pole label={11} stat={globalObjects["P11"]} />
      </CenterFlex>
    </Box>
  )
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
            <Box sx={{ fontSize: "28px" }}>
              <Box>
                {config.rule.vgoal.name}
              </Box>
              <Box>
                🏴 {formatTime(displayScore.scoreState.vgoal, "m:ss")}
              </Box>
            </Box>
          )}
          <Box sx={{ padding: "0 .1em", lineHeight: `${scoreBlockHeight}px`, }}>
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
      zIndex: 10,
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
  const showScoreBoard = useSelector<RootState, boolean>((state) => state.streamingInterface.showScoreBoard);
  
  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '1600px',
      height: '900px',
      backgroundColor: 'rgba(255, 255, 255, 0)',
    }}>
      <Slide in={showMainHud} direction="down" timeout={1000} appear={false}>
        <Box sx={{
          width: '100%',
          height: '500px',
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
          <Box>
            <TimerDisplay />
            <ScoreDisplay />
          </Box>
          <SlideTransition in={showScoreBoard} direction="right" duration={800} appear={false}>
            <Box>
              <ScoreBlock
                fieldSide={ params.reverse ? "red" : "blue" }
                placement="right"
              />
            </Box>
          </SlideTransition>
        </Box>
      </Slide>
    </Box>
  );
}
