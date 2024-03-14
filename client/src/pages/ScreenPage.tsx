import { FC, useState } from 'react';
import { Box, IconButton } from '@mui/material';
import { CenterFlex } from '@/ui/CenterFlex';
import CachedIcon from '@mui/icons-material/Cached';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useSelector } from 'react-redux';
import { RootState } from '@/slices';
import { useDisplayScore } from '@/functional/useDisplayScore';
import { useDisplayTimer } from '@/functional/useDisplayTimer';
import { usePlaySoundEffect } from '@/functional/usePlaySoundEffect';
import { ScoreDetailDisplay } from '@/components/ScoreInput/custom/harurobo2024';
import { formatTime } from '@/util/formatTime';
import { config } from '@/config/load';

const textShadow = (px: number, color = "#FFF") => `${px}px ${px}px 0 ${color}, -${px}px -${px}px 0 ${color}, -${px}px ${px}px 0 ${color}, ${px}px -${px}px 0 ${color}, 0px ${px}px 0 ${color},  0-${px}px 0 ${color}, -${px}px 0 0 ${color}, ${px}px 0 0 ${color}`;

const ScoreBoard = (props: {
  fieldSide: "blue" | "red",
  placement: "left" | "right",
}) => {
  const { fieldSide } = props;

  const teamName = useSelector<RootState, string>((state) => state.match.teams[fieldSide]?.shortName ?? "");
  const { value, scoreState } = useDisplayScore(fieldSide);
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
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
        <Box>
          {value}
        </Box>
        { scoreState.vgoal && (
          <Box sx={{
            fontSize: "40px",
            lineHeight: "50px",
            paddingLeft: "1em",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}>
            <Box>
              {config.rule.vgoal.name}
            </Box>
            <Box>
              🏴 {formatTime(scoreState.vgoal, "m:ss")}
            </Box>
          </Box>
        )}
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
        textShadow: textShadow(8),
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

  const [hinadanOpacity, setHinadanOpacity] = useState(0.9);
  const [hinadanBottom, setHinadanBottom] = useState(100);

  const blueTaskObj = useSelector<RootState, { [key: string]: number }>((state) => state.score.fields["blue"].tasks);
  const redTaskObj = useSelector<RootState, { [key: string]: number }>((state) => state.score.fields["red"].tasks);

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
            fontSize: "20px",
          }}>
            <Box>
              <IconButton size='small' onClick={() => setHinadanOpacity(opacity => opacity + 0.1)}>
                <AddIcon />
              </IconButton>
              <IconButton size='small' onClick={() => setHinadanOpacity(opacity => opacity - 0.1)}>
                <RemoveIcon />
              </IconButton>
            </Box>
            <Box>
              <IconButton color="default" onClick={onReverseClick}>
                <CachedIcon />
              </IconButton>
            </Box>
            <Box>
              <IconButton size='small' onClick={() => setHinadanBottom(bottom => bottom + 20)}>
                <AddIcon />
              </IconButton>
              <IconButton size='small' onClick={() => setHinadanBottom(bottom => bottom - 20)}>
                <RemoveIcon />
              </IconButton>          
            </Box>
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
      {/* ひなだんを表示 */}
      <Box sx={{
        position: 'absolute',
        bottom: `${hinadanBottom}px`,
        width: '100%',
        zIndex: -100,
      }}>
        <Box sx={{ 
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "flex-end",
          width: '100%',
          flexDirection: reverse ? "row-reverse" : "row",
        }}>
          <Box sx={{ 
            transform: 'scale(2)',
            opacity: hinadanOpacity,
          }}>
            <ScoreDetailDisplay            
              color="rgba(250, 0, 0, 0.9)"
              fieldSide="red"
              taskObjects={redTaskObj}
            />
          </Box>
          <Box sx={{ width: "80px" }}></Box>
          <Box sx={{ 
            transform: 'scale(2)',
            opacity: hinadanOpacity,
          }}>
            <ScoreDetailDisplay
              color= "rgba(0, 0, 250, 0.9)"
              fieldSide="blue"
              taskObjects={blueTaskObj}
            />            
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
