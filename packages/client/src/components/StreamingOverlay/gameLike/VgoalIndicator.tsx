import { Box, Typography } from '@mui/material';
import type { RootState } from '@rolimoa/common/redux';
import type { FieldSideType } from '@rolimoa/common/redux';
import { useSelector } from 'react-redux';

const fieldColor = (fieldSide: FieldSideType, opacity = 0.9) =>
  fieldSide === 'blue' ? `rgba(0, 0, 240, ${opacity})` : `rgba(240, 0, 0, ${opacity})`;

interface InsectIconProps {
  type: 'beetle' | 'stag';
  status: 'normal' | 'ready' | 'filled';
  size?: number;
  fieldSide: FieldSideType;
}

const InsectIcon = ({ type, status, size = 40, fieldSide }: InsectIconProps) => {
  let borderColor: string;
  let backgroundColor: string;

  if (status === 'filled') {
    borderColor = fieldColor(fieldSide, 0.9);
    backgroundColor = fieldColor(fieldSide, 0.2);
  } else if (status === 'ready') {
    borderColor = 'rgba(0, 0, 0, 0.9)';
    backgroundColor = 'rgba(0, 0, 0, 0.2)';
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
    (state) => state.score.fields[fieldSide].tasks,
  );

  const touchedBeetleCount = taskObjects.B_beetle_touched ?? 0;
  const readyBeetleCount = taskObjects.C_beetle_display ?? 0;
  const touchedStagCount = taskObjects.D_stag_museum ?? 0;
  const readyStagCount = taskObjects.E_stag_display ?? 0;

  const beetleRequired = 1;
  const stagRequired = 4;
  const stagMax = 6;

  const isStagVgoalReady = readyStagCount >= stagRequired;

  return (
    <Box
      sx={{
        padding: '4px 8px',
        minWidth: '240px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center' }}>
          <Typography
            sx={{ fontSize: '15px', color: 'rgba(0, 0, 0, 0.8)', width: '80px', textAlign: 'left' }}
          >
            カブトムシ
          </Typography>
          <Box sx={{ width: '120px', display: 'flex', alignItems: 'center' }}>
            <InsectIcon
              type="beetle"
              status={
                readyBeetleCount >= 1 ? 'filled' : touchedBeetleCount >= 1 ? 'ready' : 'normal'
              }
              size={26}
              fieldSide={fieldSide}
            />
          </Box>
          <Typography sx={{ fontSize: '16px', color: 'rgba(0, 0, 0, 0.9)' }}>
            <Typography
              component="span"
              sx={{
                fontWeight: readyBeetleCount >= 1 ? 'bold' : 'normal',
                color: readyBeetleCount >= 1 ? fieldColor(fieldSide) : 'rgba(0, 0, 0, 0.9)',
              }}
            >
              {readyBeetleCount}
            </Typography>
            &nbsp;/&nbsp;{beetleRequired}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '6px', alignItems: 'center' }}>
          <Typography
            sx={{ fontSize: '15px', color: 'rgba(0, 0, 0, 0.8)', width: '80px', textAlign: 'left' }}
          >
            クワガタ
          </Typography>
          <Box sx={{ width: '120px', display: 'flex', alignItems: 'center' }}>
            {Array.from({ length: stagMax }, (_, i) => {
              const key = `stag-${fieldSide}-${readyStagCount}-${i}`;
              return (
                <InsectIcon
                  key={key}
                  type="stag"
                  status={i < readyStagCount ? 'filled' : i < touchedStagCount ? 'ready' : 'normal'}
                  size={26}
                  fieldSide={fieldSide}
                />
              );
            })}
          </Box>
          <Typography sx={{ fontSize: '16px' }}>
            <Typography
              component="span"
              sx={{
                fontWeight: isStagVgoalReady ? 'bold' : 'normal',
                color: isStagVgoalReady ? fieldColor(fieldSide) : 'rgba(0, 0, 0, 0.9)',
              }}
            >
              {readyStagCount}
            </Typography>
            &nbsp;/&nbsp;{stagRequired}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
