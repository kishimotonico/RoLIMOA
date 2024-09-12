import { FC, Ref } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/slices';
import { FieldSideType, ObjectsStateType } from '@/slices/score';
import { Avatar, Box, Divider, Slide, Stack } from '@mui/material';
import { useDisplayScore } from '@/functional/useDisplayScore';
import { useDisplayTimer } from '@/functional/useDisplayTimer';
import { useSearchParams } from 'react-router-dom';
import { CenterFlex } from '@/ui/CenterFlex';
import { formatTime } from '@/util/formatTime';
import { config } from '@/config/load';
import { SlideTransition } from '@/ui/SlideTransition';
import { useCurrentMatchState } from '@/functional/useCurrentMatchState';
import TimerIcon from '@mui/icons-material/Timer';
import { StateDisplay } from '@/components/Natu2024';

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
          height: `${nameBlockHeight - 5}px`, // ちょっと調整
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
          <CenterFlex sx={{
            width: '280px',
           }}>
            {displayScore.scoreState.vgoal ? (
              <Box sx={{ fontSize: "48px", pb: 3 }}>
                <Box>
                  {config.rule.vgoal.name}
                </Box>
                <CenterFlex sx={{ fontSize: "32px", flexDirection: "row", color: "rgba(30, 30, 30, 0.9)" }}>
                  {displayScore.value}
                  &nbsp;/&nbsp;
                  <TimerIcon sx={{ mr: 1 }} />{formatTime(displayScore.scoreState.vgoal, "m:ss")}
                </CenterFlex>
              </Box>
            ) : (
              <CenterFlex sx={{ fontSize: '90px', lineHeight: `${scoreBlockHeight}px` }}>
                {displayScore.value}
              </CenterFlex>
            )}
          </CenterFlex>
          {/* 詳細表示 */}
          <Box sx={{ 
            width: '300px',
            height: '130px',
            padding: placement === "left" ? '0 0 0 20px' : '0 20px 0 0',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <StateDisplay
              color={color}
              cooked={taskObjects["B"]}
              served={taskObjects["C"]}
              heating={!!taskObjects.heating}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{
        display: "flex",
        justifyContent: placement === "left" ? "flex-start" : "flex-end",
        position: "relative",
        width: '420px',
        top: "-70px",
        left: placement === "left" ? "180px" : "0",
        clipPath: placement === "left" ? 'polygon(0 100%, 71% 100%, 100% 0, 29% 0)'
                                      : 'polygon(0 0, 29% 100%, 100% 100%, 71% 0)',
      }}>
        {displayScore.scoreState.winner && 
          <CenterFlex sx={{
            height: "70px",
            width: '420px',
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

const SubHudDisplay = () => {
  const globalObjects = useSelector<RootState, ObjectsStateType>((state) => state.score.global);

  const ShopArea = (props: { label :number, stat: number }) => (
    <Avatar sx={{
      bgcolor: props.stat === 1 ? "rgba(0, 0, 240, 0.9)"
             : props.stat === 2 ? "rgba(240, 0, 0, 0.9)" : "rgba(240, 240, 240, 0.9)",
      color: props.stat === 0 ? "black" : "white",
      width: "36px",
      height: "36px",
      margin: "8px auto",
      fontSize: "16px",
    }}>
      {props.label}
    </Avatar>
  );

  return (
    <Box sx={{ 
      width: '90px',
      bgcolor: 'rgba(240, 240, 240, 0.7)',
      borderStyle: 'solid 1px rgba(240, 240, 240, 0.5)',
      borderRadius: '8px',
      p: 2,
      mt: 4,
     }}>
      <CenterFlex sx={{ fontSize: '18px', my: 1 }}>
        売店ゾーン
      </CenterFlex>
      <Stack>
        <ShopArea label={1} stat={globalObjects['shop_1']} />
        <ShopArea label={2} stat={globalObjects['shop_2']} />
        <ShopArea label={3} stat={globalObjects['shop_3']} />
        <ShopArea label={4} stat={globalObjects['shop_4']} />
        <ShopArea label={5} stat={globalObjects['shop_5']} />
        <ShopArea label={6} stat={globalObjects['shop_6']} />
        <ShopArea label={7} stat={globalObjects['shop_7']} />
        <ShopArea label={8} stat={globalObjects['shop_8']} />
      </Stack>
    </Box>
  );
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
  const showSubHud = false; // サブHUD未実装？

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
      <Box sx={{
        width: '100%',
        position: 'absolute',
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <Slide in={showSubHud} direction="left" timeout={800} appear={false}>
          <Box sx={{ width: '160px' }}>
            <SubHudDisplay />
          </Box>
        </Slide>
      </Box>
    </Box>
  );
}
