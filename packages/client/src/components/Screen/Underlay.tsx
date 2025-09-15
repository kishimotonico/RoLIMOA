import { Box } from '@mui/material';
import { VgoalIndicator } from '../StreamingOverlay/gameLike/VgoalIndicator';

export const Underlay = (props: {
  reverse: boolean;
}) => (
  <Box
    sx={{
      fontSize: '100px',
      height: '100%',
    }}
  >
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'cnter',
        position: 'absolute',
        bottom: '50px',
        width: '100%',
      }}
    >
      <Box sx={{ width: '50%', px: 8, py: 4 }}>
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderColor: 'rgba(0, 0, 0, 0.3)',
            boxShadow: '0 0 3px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '160px',
          }}
        >
          <Box sx={{ transform: 'scale(1.6)' }}>
            <VgoalIndicator fieldSide={props.reverse ? 'blue' : 'red'} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ width: '50%', px: 8, py: 4 }}>
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderColor: 'rgba(0, 0, 0, 0.3)',
            boxShadow: '0 0 3px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '160px',
          }}
        >
          <Box sx={{ transform: 'scale(1.6)' }}>
            <VgoalIndicator fieldSide={props.reverse ? 'red' : 'blue'} />
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);
