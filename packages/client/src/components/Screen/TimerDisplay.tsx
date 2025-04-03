import { useSelector } from 'react-redux';
import type { RootState } from '@rolimoa/common/redux';
import { Box, type SxProps } from '@mui/material';
import type { Theme } from '@emotion/react';
import { useDisplayTimer } from '@/functional/useDisplayTimer';

const textShadow = (px: number, color = '#FFF') =>
  `${px}px ${px}px 0 ${color}, -${px}px -${px}px 0 ${color}, -${px}px ${px}px 0 ${color}, ${px}px -${px}px 0 ${color}, 0px ${px}px 0 ${color},  0-${px}px 0 ${color}, -${px}px 0 0 ${color}, ${px}px 0 0 ${color}`;

type TimerDisplayProps = {
  sxContainer?: SxProps<Theme>;
  sxMatchName?: SxProps<Theme>;
  sxDescription?: SxProps<Theme>;
  sxTime?: SxProps<Theme>;
};

export const TimerDisplay = ({
  sxContainer = {},
  sxMatchName = {},
  sxDescription = {},
  sxTime = {},
}: TimerDisplayProps) => {
  const { description, displayTime } = useDisplayTimer();
  const matchName = useSelector<RootState, string>((state) => state.match.name);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          textAlign: 'center',
          boxSizing: 'border-box',
          ...sxContainer,
        }}
      >
        <Box
          sx={{
            fontSize: '1em',
            textShadow: textShadow(1),
            ...sxMatchName,
          }}
        >
          {matchName || '\u00A0'}
        </Box>
        <Box
          sx={{
            fontSize: '0.6em',
            textShadow: textShadow(1),
            ...sxDescription,
          }}
        >
          {description || '\u00A0'}
        </Box>
        <Box
          sx={{
            fontFamily: 'DSEG14-Classic',
            fontWeight: 500,
            fontSize: '4em',
            pt: '0.1em',
            textShadow: textShadow(8),
            ...sxTime,
          }}
        >
          {displayTime}
        </Box>
      </Box>
    </>
  );
};
