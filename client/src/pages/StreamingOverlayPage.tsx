import { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'slices';
import { FieldSideType } from 'slices/score';
import { Box } from '@mui/material';
import { useDisplayScore } from 'functional/useDisplayScore';
import { useDisplayTimer } from 'functional/useDisplayTimer';
import { useSearchParams } from 'react-router-dom';

type ScoreBlockProps = {
  fieldSide: FieldSideType,
};

const ScoreBlock: FC<ScoreBlockProps> = ({
  fieldSide,
}) => {
  const teamName = useSelector<RootState, string>((state) => state.teams[fieldSide].short);
  const displayScore = useDisplayScore(fieldSide);

  const color = fieldSide as string; // "blue" | "red"をそのまま文字列として使う

  return (
    <Box sx={{
      width: '600px',
      height: '100%',
      textAlign: 'center',
      border: `8px solid ${color}`,
      boxSizing: 'border-box',
      backgroundColor: 'rgba(240, 240, 240, 0.8)',
    }}>
      <Box sx={{
        height: '80px',
        lineHeight: '80px',
        borderBottom: `8px solid ${color}`,
        fontSize: '42px',
        display: 'flex',
        justifyContent: 'center',
      }}>
        {teamName}
      </Box>
      <Box sx={{
        fontSize: '120px',
        lineHeight: '180px',
      }}>
        {displayScore.text}
      </Box>
    </Box>
  );
};

const TimerDisplay: FC = () => {
  const { description, displayTime } = useDisplayTimer();

  return <>
    <Box sx={{
      width: '400px',
      height: '100%',
      textAlign: 'center',
      backgroundColor: 'rgba(10, 10, 10, 0.9)',
      boxSizing: 'border-box',
      color: 'rgba(240, 240, 240, 0.95)',
    }}>
      <Box sx={{
        height: '80px',
        lineHeight: '120px',
        fontSize: '24px',
        display: 'flex',
        justifyContent: 'center',
      }}>
        {description}
      </Box>
      <Box sx={{
        fontFamily: "DSEG14-Classic",
        fontWeight: 500,
        fontSize: '80px',
        lineHeight: '180px',
      }}>
        {displayTime}
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

  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '1600px',
      height: '900px',
      backgroundColor: 'rgba(255, 255, 255, 0)',
    }}>
      <Box sx={{
        width: '100%',
        height: '260px',
        display: 'flex',
        flexDirection: params.reverse ? 'row-reverse' : 'row',
      }}>
        <ScoreBlock fieldSide="red" />
        <TimerDisplay />
        <ScoreBlock fieldSide="blue" />
      </Box>
    </Box>
  );
}
