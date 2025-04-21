import type { Theme } from '@emotion/react';
import { Box, Divider, type SxProps } from '@mui/material';
import type { RootState } from '@rolimoa/common/redux';
import type { Ref } from 'react';
import { useSelector } from 'react-redux';
import { useDisplayTimer } from '~/functional/useDisplayTimer';

type ScoreDisplayProps = {
  ref?: Ref<HTMLDivElement>;
  sxContainer?: SxProps<Theme>;
  sxDescription?: SxProps<Theme>;
  sxTime?: SxProps<Theme>;
  sxDivider?: SxProps<Theme>;
  sxMatchName?: SxProps<Theme>;
};

export const TimerDisplay = ({
  ref,
  sxContainer = {},
  sxDescription = {},
  sxTime = {},
  sxDivider = {},
  sxMatchName = {},
}: ScoreDisplayProps) => {
  const { description, displayTime } = useDisplayTimer();
  const matchName = useSelector<RootState, string>((state) => state.match.name);

  return (
    <Box
      ref={ref}
      sx={{
        width: '400px',
        height: '260px',
        textAlign: 'center',
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        boxSizing: 'border-box',
        color: 'rgba(240, 240, 240, 0.95)',
        zIndex: 10,
        fontSize: '24px',
        ...sxContainer,
      }}
    >
      <Box
        sx={{
          height: '70px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...sxDescription,
        }}
      >
        {description}
      </Box>
      <Box
        sx={{
          height: '120px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'DSEG14-Classic',
          fontWeight: 500,
          fontSize: '300%',
          ...sxTime,
        }}
      >
        {displayTime}
      </Box>
      <Divider
        sx={{
          margin: '0 30px',
          borderColor: 'rgba(240, 240, 240, 0.5)',
          ...sxDivider,
        }}
      />
      <Box
        sx={{
          height: '68px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          ...sxMatchName,
        }}
      >
        {matchName ?? ''}
      </Box>
    </Box>
  );
};
