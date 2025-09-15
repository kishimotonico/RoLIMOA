import { Box, Typography } from '@mui/material';
import type { RootState } from '@rolimoa/common/redux';
import type { FieldSideType } from '@rolimoa/common/redux';
import { useSelector } from 'react-redux';

interface InsectIconProps {
  type: 'beetle' | 'stag';
  filled: boolean;
  size?: number;
  fieldSide?: FieldSideType;
}

const InsectIcon = ({ type, filled, size = 40, fieldSide }: InsectIconProps) => {
  let borderColor: string;
  let backgroundColor: string;

  if (filled && fieldSide) {
    borderColor = fieldSide === 'red' ? 'rgba(240, 0, 0, 0.9)' : 'rgba(0, 0, 240, 0.9)';
    backgroundColor = fieldSide === 'red' ? 'rgba(240, 0, 0, 0.2)' : 'rgba(0, 0, 240, 0.2)';
  } else {
    borderColor = 'rgba(120, 120, 120, 0.6)';
    backgroundColor = 'rgba(240, 240, 240, 0.1)';
  }

  if (type === 'beetle') {
    return (
      <Box
        sx={{
          width: size * 0.7,
          height: size * 0.7,
          borderRadius: '50%',
          backgroundColor,
          border: `2px solid ${borderColor}`,
          margin: '0 2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          fontWeight: 'bold',
          color: borderColor,
        }}
      >
        ●
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: size * 0.6,
        height: size * 0.6,
        backgroundColor,
        border: `2px solid ${borderColor}`,
        margin: '0 2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        color: borderColor,
      }}
    >
      ■
    </Box>
  );
};

export const VgoalIndicator = ({ fieldSide }: { fieldSide: FieldSideType }) => {
  const taskObjects = useSelector<RootState, Record<string, number>>(
    (state) => state.score.fields[fieldSide].tasks
  );

  const beetleCount = taskObjects.C_beetle_display || 0;
  const stagCount = taskObjects.E_stag_display || 0;

  const beetleRequired = 1;
  const stagRequired = 4;
  const stagMax = 6;

  const isVgoalReady = beetleCount >= beetleRequired && stagCount >= stagRequired;

  return (
    <Box
      sx={{
        padding: '4px 8px',
        minWidth: '240px',
      }}
    >

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.8)', width: '80px' }}>
            カブトムシ:
          </Typography>
          <Box sx={{ width: '120px', display: 'flex', alignItems: 'center' }}>
            <InsectIcon type="beetle" filled={beetleCount >= 1} size={26} fieldSide={fieldSide} />
          </Box>
          <Typography sx={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.9)' }}>
            {beetleCount}/{beetleRequired}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.8)', width: '80px' }}>
            クワガタ:
          </Typography>
          <Box sx={{ width: '120px', display: 'flex', alignItems: 'center' }}>
            {Array.from({ length: stagMax }, (_, i) => {
              const key = `stag-${fieldSide}-${stagCount}-${i}`;
              return (
                <InsectIcon
                  key={key}
                  type="stag"
                  filled={i < stagCount}
                  size={26}
                  fieldSide={fieldSide}
                />
              );
            })}
          </Box>
          <Typography sx={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.9)' }}>
            {stagCount}/{stagRequired}
          </Typography>
        </Box>
      </Box>

    </Box>
  );
};