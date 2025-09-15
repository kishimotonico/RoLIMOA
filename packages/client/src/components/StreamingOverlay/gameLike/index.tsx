import TimerIcon from '@mui/icons-material/Timer';
import { Box } from '@mui/material';
import { config } from '@rolimoa/common/config';
import type { RootState } from '@rolimoa/common/redux';
import type { FieldSideType } from '@rolimoa/common/redux';
import { useSelector } from 'react-redux';
import { useDisplayScore } from '~/functional/useDisplayScore';
import { CenterFlex } from '~/ui/CenterFlex';
import { SlideTransition } from '~/ui/SlideTransition';
import { formatTime } from '~/util/formatTime';
import { TimerDisplay } from '../TimerDisplay';
import { ScoreSubDisplay } from './ScoreSubDisplay';

const ScoreBlock = (props: {
  fieldSide: FieldSideType;
  placement: 'left' | 'right';
}) => {
  const { fieldSide, placement } = props;
  const teamName = useSelector<RootState, string | undefined>(
    (state) => state.match.teams[fieldSide]?.shortName,
  );
  const displayScore = useDisplayScore(fieldSide);

  const color = fieldSide === 'blue' ? 'rgba(0, 0, 240, 0.8)' : 'rgba(240, 0, 0, 0.8)';

  const containerHeight = 260;
  const nameBlockHeight = 55;
  const scoreBlockHeight = containerHeight - nameBlockHeight - 5; // 若干調整
  const teamNameFontSize = 30;

  return (
    <Box>
      <Box
        sx={{
          width: '600px',
          height: `${containerHeight}px`,
          textAlign: 'center',
          backgroundColor: 'rgba(240, 240, 240, 0.8)',
          clipPath: 'polygon(0 0, 0 100%, 30% 100%, 50% 190px, 100% 190px, 100% 0)',
          transform: placement === 'left' ? '' : 'scaleX(-1)',
        }}
      >
        <Box
          sx={{
            height: `${nameBlockHeight}px`,
            lineHeight: `${nameBlockHeight + 2}px`, // ちょっと調整
            backgroundColor: color,
            fontSize: `${teamNameFontSize}px`,
            color: 'rgba(255, 255, 255, 0.9)',
            transform: placement === 'left' ? '' : 'scaleX(-1)',
          }}
        >
          {teamName ?? ' '}
        </Box>
        <Box
          sx={{
            height: `${scoreBlockHeight}px`,
            fontSize: '100px',
            flexDirection: placement === 'left' ? 'row' : 'row-reverse',
            display: 'flex',
            transform: placement === 'left' ? '' : 'scaleX(-1)',
          }}
        >
          {/* 点数表示 */}
          <CenterFlex
            sx={{
              width: '280px',
            }}
          >
            {displayScore.scoreState.vgoal ? (
              <Box sx={{ fontSize: '42px', pb: 3 }}>
                <Box>{config.rule.vgoal.name}</Box>
                <CenterFlex
                  sx={{
                    fontSize: '32px',
                    flexDirection: 'row',
                    color: 'rgba(30, 30, 30, 0.9)',
                  }}
                >
                  {displayScore.value}
                  &nbsp;/&nbsp;
                  <TimerIcon sx={{ mr: 1 }} />
                  {formatTime(displayScore.scoreState.vgoal, 'm:ss')}
                </CenterFlex>
              </Box>
            ) : (
              <CenterFlex sx={{ fontSize: '90px', lineHeight: `${scoreBlockHeight}px` }}>
                {displayScore.value}
              </CenterFlex>
            )}
          </CenterFlex>
          {/* 詳細表示 */}
          <Box
            sx={{
              width: '300px',
              height: '135px',
              padding: placement === 'left' ? '0 0 0 20px' : '0 20px 0 0',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              fontSize: '24px',
              color: 'rgba(30, 30, 30, 0.9)',
            }}
          >
            <ScoreSubDisplay fieldSide={fieldSide} placement={placement} />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: placement === 'left' ? 'flex-start' : 'flex-end',
          position: 'relative',
          width: '420px',
          top: '-70px',
          left: placement === 'left' ? '180px' : '0',
          clipPath:
            placement === 'left'
              ? 'polygon(0 100%, 71% 100%, 100% 0, 29% 0)'
              : 'polygon(0 0, 29% 100%, 100% 100%, 71% 0)',
        }}
      >
        {displayScore.scoreState.winner && (
          <CenterFlex
            sx={{
              height: '70px',
              width: '420px',
              backgroundColor: `${color}`,
              fontSize: '42px',
              color: 'rgba(255, 255, 255, 0.95)',
            }}
          >
            Winner
          </CenterFlex>
        )}
      </Box>
    </Box>
  );
};

export const MainHud = ({
  showScoreBoard,
  params,
}: {
  showScoreBoard: boolean;
  params: { reverse: boolean };
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '320px',
        display: 'flex',
      }}
    >
      <SlideTransition in={showScoreBoard} direction="left" duration={800} appear={false}>
        <Box>
          <ScoreBlock fieldSide={params.reverse ? 'blue' : 'red'} placement="left" />
        </Box>
      </SlideTransition>
      <TimerDisplay
        sxContainer={{
          height: '190px',
          fontSize: '20px',
        }}
        sxDescription={{
          height: '50px',
          lineHeight: '50px',
        }}
        sxTime={{
          height: '90px',
          lineHeight: '90px',
        }}
        sxMatchName={{
          height: '50px',
          lineHeight: '50px',
        }}
      />
      <SlideTransition in={showScoreBoard} direction="right" duration={800} appear={false}>
        <Box>
          <ScoreBlock fieldSide={params.reverse ? 'red' : 'blue'} placement="right" />
        </Box>
      </SlideTransition>
    </Box>
  );
};
