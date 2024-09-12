import { FC, useState } from 'react';
import { Avatar, Box, IconButton } from '@mui/material';
import { CenterFlex } from '@/ui/CenterFlex';
import CachedIcon from '@mui/icons-material/Cached';
import { useSelector } from 'react-redux';
import { RootState } from '@/slices';
import { useDisplayScore } from '@/functional/useDisplayScore';
import { useDisplayTimer } from '@/functional/useDisplayTimer';
import { usePlaySoundEffect } from '@/functional/usePlaySoundEffect';
import { StateDisplay } from '@/components/Natu2024';
import { useCurrentMatchState } from '@/functional/useCurrentMatchState';

const StateDisplayContainer = ({ fieldSide }: { fieldSide: "blue" | "red" }) => {
  const { taskObjects } = useCurrentMatchState(fieldSide);

  return <StateDisplay
    color={fieldSide == "blue" ? "rgba(0, 0, 240, 0.9)" : "rgba(240, 0, 0, 0.9)"}
    cooked={taskObjects["B"]}
    served={taskObjects["C"]}
    heating={!!taskObjects.heating}
  />;
}

const textShadow = (px: number, color = "#FFF") => `${px}px ${px}px 0 ${color}, -${px}px -${px}px 0 ${color}, -${px}px ${px}px 0 ${color}, ${px}px -${px}px 0 ${color}, 0px ${px}px 0 ${color},  0-${px}px 0 ${color}, -${px}px 0 0 ${color}, ${px}px 0 0 ${color}`;

const ScoreBoard = (props: {
  fieldSide: "blue" | "red",
  placement: "left" | "right",
}) => {
  const { fieldSide } = props;

  const teamName = useSelector<RootState, string>((state) => state.match.teams[fieldSide]?.shortName ?? "");
  const { value } = useDisplayScore(fieldSide);
  const winner = useSelector<RootState, boolean>((state) => state.score.fields[fieldSide].winner); 
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
        fontSize: '0.6em',
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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '50px',
      }}>
        <Box>
          {value}
        </Box>
        { winner ?
          <Box> 
            <Avatar sx={{
              width: '50px',
              height: '50px',
              pt: '0.15em',
              fontSize: '0.4em',
              backgroundColor: color,
              color: 'rgb(240, 240, 240)',
            }}>
              勝
            </Avatar>
          </Box>
        : <></> }
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
          py: "0.3em",
          fontSize: "0.7em",
        }}>
          <TimerDisplay />
        </CenterFlex>
        {/* ステータス */}
        <Box sx={{
          pt: '30px',
          display: "flex",
          height: "100%",
          justifyContent: "space-around",
        }}>
          <Box sx={{ transform: "scale(1.3)" }}>
            <StateDisplayContainer fieldSide={ reverse ? "blue" : "red" }  />
          </Box>
          <Box sx={{ transform: "scale(1.3)" }}>
            <StateDisplayContainer fieldSide={ reverse ? "red" : "blue" } />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
