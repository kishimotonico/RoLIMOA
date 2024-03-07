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
                🏴 {formatTime(displayScore.scoreState.vgoal, "m:ss")}
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
  const showSubHud = useSelector<RootState, boolean>((state) => state.streamingInterface.showSubHud);

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
