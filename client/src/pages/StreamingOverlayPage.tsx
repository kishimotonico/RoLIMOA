import { FC, Ref } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/slices';
import { FieldSideType } from '@/slices/score';
import { Box, Divider, Slide } from '@mui/material';
import { useDisplayScore } from '@/functional/useDisplayScore';
import { useDisplayTimer } from '@/functional/useDisplayTimer';
import { useSearchParams } from 'react-router-dom';
import { CenterFlex } from '@/ui/CenterFlex';
import { formatTime } from '@/util/formatTime';
import { config } from '@/config/load';
import { SlideTransition } from '@/ui/SlideTransition';

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

  const color = fieldSide == "blue" ? "rgba(0, 0, 240, 0.8)" : "rgba(240, 0, 0, 0.8)";

  const containerHeight = 260;
  const outlineBorderWidth = 0;
  const innerBorderWidth = 6;
  const nameBlockHeight = 60;
  const scoreBlockHeight = 16 + containerHeight - nameBlockHeight - outlineBorderWidth * 2 - innerBorderWidth; // 文字を下に下げるため微調整
  const teamNameFontSize = 30;

  return (
    <Box>
      <Box sx={{
        width: '600px',
        height: `${containerHeight}px`,
        textAlign: 'center',
        border: `${outlineBorderWidth}px solid`,
        borderColor: color,
        boxSizing: 'border-box',
        backgroundColor: 'rgba(240, 240, 240, 0.8)',
        clipPath: 'polygon(0 0, 0 100%, 30% 100%, 50% 190px, 100% 190px, 100% 0)',
        transform: placement === "left" ? '' : 'scaleX(-1)',
      }}>
        <Box sx={{
          height: `${nameBlockHeight}px`,
          lineHeight: `${nameBlockHeight}px`,
          backgroundColor: color,
          fontSize: `${teamNameFontSize}px`,
          color: "rgba(255, 255, 255, 0.9)",
          transform: placement === "left" ? '' : 'scaleX(-1)',
        }}>
          {teamName ?? " "}
        </Box>
        <Box sx={{
          height: `${scoreBlockHeight}px`,
          fontSize: '100px',
          flexDirection: placement === "left" ? 'row' : 'row-reverse',
          display: 'flex',
          transform: placement === "left" ? '' : 'scaleX(-1)',
        }}>
          {/* 点数表示 */}
          <Box sx={{
            width: '280px',
           }}>
            {displayScore.scoreState.vgoal && (
              <Box sx={{ fontSize: "40px" }}>
                <Box>
                  {config.rule.vgoal.name}
                </Box>
                <Box>
                  🏴 {formatTime(displayScore.scoreState.vgoal, "m:ss")}
                </Box>
              </Box>
            )}
            <CenterFlex sx={{ fontSize: '80px', lineHeight: `${scoreBlockHeight}px` }}>
              {displayScore.value}
            </CenterFlex>
          </Box>
          {/* 詳細表示 */}
          <Box sx={{ 
            width: '320px',
            height: '130px',
            backgroundColor: 'yellow',
            fontSize: '16px',
          }}>
            ここに得点をいい感じに詳細表示する
          </Box>
        </Box>
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
      height: '190px',
      textAlign: 'center',
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      boxSizing: 'border-box',
      color: 'rgba(240, 240, 240, 0.95)',
      zIndex: 10,
    }}>
      <Box sx={{
        height: '50px',
        lineHeight: '50px',
        fontSize: '20px',
        display: 'flex',
        justifyContent: 'center',
      }}>
        {description}
      </Box>
      <Box sx={{
        fontFamily: "DSEG14-Classic",
        fontWeight: 500,
        height: '90px',
        lineHeight: '90px',
        fontSize: '60px',
      }}>
        {displayTime}
      </Box>
      <Divider sx={{
        margin: '0 30px',
        borderColor: 'rgba(240, 240, 240, 0.5)',
      }}/>
      <Box sx={{
        height: '50px',
        lineHeight: '50px',
        fontSize: '20px',
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
      </Slide>
    </Box>
  );
}
