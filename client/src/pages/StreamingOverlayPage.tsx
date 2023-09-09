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
import { useCurrentMatchState } from '@/functional/useCurrentMatchState';

const TowerDisplay = (props: {
  color: string,
  value: number,
  location: string
}) => (
  <Box sx={{
    px: '5px',
  }}>
    <Box sx={{ 
      height: '100px',
      fontSize: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      alignItems: 'center',
      position: 'relative',
      }}>
      {
        Array(props.value).fill(0).map((_, i) => (
          <Box key={i} sx={{
            backgroundColor: `${props.color}`,
            opacity: 0.8,
            width: '30px',
            height: '8px',
            mt: '2px',
            }} />
        ))
      }
      <Box sx={{ 
        position: 'absolute',
        bottom: '0',
        height: '25px',
        lineHeight: '25px',
        fontSize: '20px',
        fontWeight: 'bold',
        color: 'rgba(0, 0, 0, 0.95)',
        textShadow: '1px 1px 0 #FFF, -1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px -1px 0 #FFF, 0px 1px 0 #FFF,  0-1px 0 #FFF, -1px 0 0 #FFF, 1px 0 0 #FFF;',
      }}>
          {props.value}
        </Box>
    </Box>
    <Box sx={{ 
      pt: '5px',
      fontSize: '16px',
      height: '25px',
      lineHeight: '25px',
      }}>
      {props.location}
    </Box>
  </Box>
);

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
  const { taskObjects } = useCurrentMatchState(fieldSide);
  const displayTasks = {
    "千葉": taskObjects["Chiba"],
    "さいたま": taskObjects["Saitama"],
    "横浜": taskObjects["Yokohama"],
    "渋谷": taskObjects["Shibuya"],
  };

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
            padding: placement === "left" ? '0 0 0 20px' : '0 20px 0 0',
            display: 'flex',
            flexDirection: 'row',
          }}>
            {
              Object.entries(displayTasks).map(([name, value]) => (
                <Box key={name} sx={{ 
                  width: '75px',
                }}>
                  <TowerDisplay
                    key={value}
                    color={color}
                    location={name}
                    value={value}
                  />
                </Box>
              ))
            }
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
            width: '180px',
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
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
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
