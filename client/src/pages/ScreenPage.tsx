import { FC, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { CenterFlex } from '@/ui/CenterFlex';
import CachedIcon from '@mui/icons-material/Cached';
import { useSelector } from 'react-redux';
import { RootState } from '@/slices';
import { useDisplayScore } from '@/functional/useDisplayScore';
import { useDisplayTimer } from '@/functional/useDisplayTimer';
import { usePlaySoundEffect } from '@/functional/usePlaySoundEffect';

const BLOCK_WIDTH = "60px";
const BLOCK_HEIGHT = "20px";
const BLOCK_MARGIN = "6px";

const textShadow = (px: number, color = "#FFF") => `${px}px ${px}px 0 ${color}, -${px}px -${px}px 0 ${color}, -${px}px ${px}px 0 ${color}, ${px}px -${px}px 0 ${color}, 0px ${px}px 0 ${color},  0-${px}px 0 ${color}, -${px}px 0 0 ${color}, ${px}px 0 0 ${color}`;

const TowerContainer = (props: {
  fieldSide: "blue" | "red",
}) => {
  const { scoreState } = useDisplayScore(props.fieldSide);
  const displayTasks = {
    "千葉": scoreState.tasks["Chiba"],
    "さい": scoreState.tasks["Saitama"],
    "横浜": scoreState.tasks["Yokohama"],
    "渋谷": scoreState.tasks["Shibuya"],
  };
  const color = props.fieldSide == "blue" ? "rgba(0, 0, 240, 0.7)" : "rgba(240, 0, 0, 0.7)";

  return (
    <Box sx={{ 
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
    }}>
      {
        Object.entries(displayTasks).map(([name, value]) => (
          <TowerDisplay
            key={name}
            color={color}
            location={name}
            value={value}
          />
        ))
      }
    </Box>
  );
}

const TowerDisplay = (props: {
  color: string,
  value: number,
  location: string
}) => (
  <Box sx={{
    height: '100%',
    mx: '0.5em',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    flex: 1,
  }}>
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
    }}>
      {
        Array(props.value).fill(0).map((_, i) => (
          <Box key={i} sx={{
            backgroundColor: `${props.color}`,
            opacity: 0.8,
            width: BLOCK_WIDTH,
            height: BLOCK_HEIGHT,
            mt: BLOCK_MARGIN,
          }} />
        ))
      }
      <Box sx={{ 
        position: 'absolute',
        bottom: '0',
        fontSize: '1em',
        fontWeight: 'bold',
        color: 'rgba(0, 0, 0, 0.95)',
        textShadow: '1px 1px 0 #FFF, -1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px -1px 0 #FFF, 0px 1px 0 #FFF,  0-1px 0 #FFF, -1px 0 0 #FFF, 1px 0 0 #FFF;',
        textAlign: 'center',
      }}>
          {props.value}
        </Box>
    </Box>
    <Box sx={{ 
      pt: '0.3em',
      fontSize: '1em',
      lineHeight: '1.1em',
      textAlign: 'center',
    }}>
      {props.location}
    </Box>
  </Box>
);

const ScoreBoard = (props: {
  fieldSide: "blue" | "red",
  placement: "left" | "right",
}) => {
  const { fieldSide } = props;

  const teamName = useSelector<RootState, string>((state) => state.match.teams[fieldSide]?.shortName ?? "");
  const { value } = useDisplayScore(fieldSide);
  const color = props.fieldSide == "blue" ? "rgba(0, 0, 250, 0.9)" : "rgba(250, 0, 0, 0.9)";

  return (
    <Box sx={{
      width: '100%',
      height: '180px',
      border: '2px solid',
      borderColor: color,
    }}>
      <Box sx={{
        backgroundColor: color,
        color: 'rgb(240, 240, 240)',
        height: '60px',
        lineHeight: '65px',
        fontSize: '0.7em',
        px: '0.5em',
        textAlign: 'center',
      }}>
        {teamName}
      </Box>
      <Box sx={{
        height: '120px',
        lineHeight: '125px',
        fontSize: '1.5em',
        textAlign: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
      }}>
        {value}
      </Box>
    </Box>
  );
};

const TimerDisplay = () => {
  const { description, displayTime } = useDisplayTimer();
  const matchName = useSelector<RootState, string>((state) => state.match.name);

  return <>
    <Box sx={{
      width: '100%',
      textAlign: 'center',
      boxSizing: 'border-box',
    }}>
      <Box sx={{ fontSize: '1em', textShadow: textShadow(1) }}>
        {matchName || "\u00A0"}
      </Box>
      <Box sx={{ fontSize: '0.6em', textShadow: textShadow(1) }}>
        {description || "\u00A0"}
      </Box>
      <Box sx={{
        fontFamily: "DSEG14-Classic",
        fontWeight: 500,
        fontSize: '4em',
        pt: '0.1em',
        textShadow: textShadow(6),
      }}>
        {displayTime}
      </Box>
    </Box>
  </>;
};

export const ScreenPage: FC = () => {
  usePlaySoundEffect();

  const [reverse, setReverse] = useState(false);
  const onReverseClick = () => { setReverse(toggle => !toggle) };

  return (
    <Box sx={{
      fontSize: '50px',
      height: '98vh',
      position: 'relative',
    }}>
      <Box>
        {/* スコア */}
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: 1 }}>
            <ScoreBoard fieldSide={ reverse ? "blue" : "red" } placement="left" />
          </Box>
          <CenterFlex sx={{
            opacity: 0.1,
            transition: "opacity",
            "&:hover": {
              opacity: 1.0,
            },
            width: "80px",
          }}>
            <IconButton aria-label="delete" color="default" onClick={onReverseClick}>
              <CachedIcon />
            </IconButton>
          </CenterFlex>
          <Box sx={{ flex: 1 }}>
            <ScoreBoard fieldSide={ reverse ? "red" : "blue" } placement="right" />
          </Box>
        </Box>
        {/* タイム */}
        <CenterFlex sx={{
          py: "0.5em",
        }}>
          <TimerDisplay />
        </CenterFlex>
      </Box>
      {/* タワー表示 */}
      <Box sx={{
        position: 'absolute',
        bottom: '0',
        width: '100%',
        zIndex: -100,
      }}>
        <Box sx={{ 
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-end",
          width: '100%',
        }}>
          <Box sx={{ flex: 1 }}>
            <TowerContainer fieldSide={ reverse ? "blue" : "red" } />
          </Box>
          <Box sx={{ width: "80px" }}></Box>
          <Box sx={{ flex: 1 }}>
            <TowerContainer fieldSide={ reverse ? "red" : "blue" } />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
