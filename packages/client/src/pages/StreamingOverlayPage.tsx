import { MainHud } from '@/components/StreamingOverlay/simple';
import { Box, Slide } from '@mui/material';
import type { RootState } from '@rolimoa/common/redux';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

type StreamingOverlayPageParams = {
  reverse: boolean;
};

export const StreamingOverlayPage = () => {
  const [searchParams] = useSearchParams();
  const params: StreamingOverlayPageParams = {
    reverse: searchParams.get('reverse') !== null,
  };

  const showMainHud = useSelector<RootState, boolean>(
    (state) => state.streamingInterface.showMainHud,
  );
  const showScoreBoard = useSelector<RootState, boolean>(
    (state) => state.streamingInterface.showScoreBoard,
  );
  const showSubHud = false;

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '1600px',
        height: '900px',
        backgroundColor: 'rgba(255, 255, 255, 0)',
      }}
    >
      <Slide in={showMainHud} direction="down" timeout={1000} appear={false}>
        <MainHud showScoreBoard={showScoreBoard} params={params} />
      </Slide>
      <Box
        sx={{
          width: '100%',
          position: 'absolute',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Slide in={showSubHud} direction="left" timeout={800} appear={false}>
          <Box sx={{ width: '160px' }}>{/* <SubHudDisplay /> */}</Box>
        </Slide>
      </Box>
    </Box>
  );
};
